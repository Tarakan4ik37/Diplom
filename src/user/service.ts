import { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import {
    GetOneUserResponse,
    GetPublicUserResponse,
} from './types/getOneUserTypes.ts';
import {
    UserUpdateRequest,
    UserUpdateResponse,
} from './types/updateUserTypes.ts';
import {
    UpdateForAdminRequest,
    UpdateForAdminResponse,
} from './types/updateForAdminTypes.ts';

export class UserService {
    constructor(private readonly fastify: FastifyInstance) {}

    //Универсальный приватный метод
    private async getUserBase<TResult>(
        id: number,
        includeApproval: boolean,
    ): Promise<TResult> {
        const user = await this.fastify.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nickName: true,
                email: true,
                firstName: true,
                lastMame: true,
                midName: true,
                ...(includeApproval && { isApproved: true }), //только для me
            },
        });

        if (!user) {
            throw createError(404, 'Пользователь не найден');
        }

        return user as TResult;
    }

    //Для себя
    public async getUserSelf(id: number): Promise<GetOneUserResponse> {
        return await this.getUserBase(id, true);
    }

    //Для чужих профилей
    public async getPublicUser(id: number): Promise<GetPublicUserResponse> {
        return await this.getUserBase(id, false);
    }

    //Редактироваие
    public async updateUserSelf(
        id: number,
        data: UserUpdateRequest,
    ): Promise<UserUpdateResponse> {
        await this.fastify.prisma.user.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastMame: data.lastName,
                midName: data.midName,
            },
        });

        return { success: true };
    }

    //Редактирование для прав админа
    public async updateUserAdmin(
        id: number,
        data: UpdateForAdminRequest,
    ): Promise<UpdateForAdminResponse> {
        try {
            await this.fastify.prisma.user.update({
                where: { id },
                data: {
                    firstName: data.firstName,
                    lastMame: data.lastName,
                    midName: data.midName,
                    nickName: data.nickName,
                },
            });

            return { success: true };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002' &&
                Array.isArray(error.meta?.target) &&
                error.meta.target.includes('nickName')
            ) {
                throw createError(
                    409,
                    'Псевдоним уже занят другим пользователем',
                );
            }

            throw error;
        }
    }
}
