import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import { sendConfirmationEmail } from '../smtp/utils.ts';

export class AuthService {
    constructor(private readonly fastify: FastifyInstance) {}

    public async login(
        email: string,
        password: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.fastify.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                password: true,
                isApproved: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw createError(400, 'Email или пароль неверны');
        }

        if (!user.isApproved) {
            throw createError(400, 'Подтвердите почту');
        }

        const payload = { id: user.id, role: user.role.name };

        const accessToken = this.fastify.jwt.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.fastify.jwt.sign(payload, {
            expiresIn: '30d',
        });

        return { accessToken, refreshToken };
    }

    public async register(
        email: string,
        password: string,
        nickName: string,
    ): Promise<void> {
        const user = await this.fastify.prisma.user.findFirst({
            where: {
                OR: [{ email }, { nickName }],
            },
            select: {
                id: true,
            },
        });

        if (user) {
            throw createError(400, 'Email или ник уже зарегистрирован');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let userRole = await this.fastify.prisma.role.findFirst({
            select: {
                id: true,
                name: true,
            },
            where: { name: 'user' },
        });
        if (!userRole) {
            userRole = await this.fastify.prisma.role.create({
                select: {
                    id: true,
                    name: true,
                },
                data: {
                    name: 'user',
                },
            });
        }

        const emailConfirmationToken = uuidv4();

        const createdUser = await this.fastify.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nickName,
                role: {
                    connect: userRole,
                },
                emailConfirmationToken,
            },
        });

        try {
            await sendConfirmationEmail(email, emailConfirmationToken);
        } catch {
            await this.fastify.prisma.user.delete({
                where: { id: createdUser.id },
            });
            throw new Error('Smtp down');
        }
    }

    public async confirmEmail(token: string) {
        const user = await this.fastify.prisma.user.findFirst({
            where: { emailConfirmationToken: token },
        });

        if (!user) {
            throw createError(404, 'Пользователь с данным токеном не найден');
        }

        await this.fastify.prisma.user.update({
            where: { id: user.id },
            data: { isApproved: true },
        });
    }
}
