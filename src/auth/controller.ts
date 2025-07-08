import { FastifyInstance } from 'fastify';
import { loginRequestBody } from './schemes/loginSchemes.ts';
import { RegisterRequestBody } from './types/registerTypes.ts';
import { AuthService } from './service.ts';
import { registerRequestBody } from './schemes/registerSchemes.ts';
import { LoginRequestBody } from './types/loginTypes.ts';
import { accessTokenTtl, refreshTokenTtl } from './constants.ts';

export async function authController(fastify: FastifyInstance) {
    const authService = new AuthService(fastify);

    fastify.post<{ Body: LoginRequestBody }>(
        '/login',
        {
            schema: {
                tags: ['auth'],
                body: loginRequestBody,
            },
        },
        async (request, reply) => {
            const { email, password } = request.body;

            const { accessToken, refreshToken } = await authService.login(
                email,
                password,
            );

            reply
                .setCookie('accessToken', accessToken, {
                    path: '/',
                    httpOnly: false,
                    maxAge: accessTokenTtl,
                    sameSite: 'none',
                    secure: true,
                })
                .setCookie('refreshToken', refreshToken, {
                    path: '/',
                    httpOnly: true,
                    maxAge: refreshTokenTtl,
                    sameSite: 'none',
                    secure: true,
                })
                .send({ success: true });
        },
    );

    fastify.post<{ Body: RegisterRequestBody }>(
        '/register',
        {
            schema: {
                tags: ['auth'],
                body: registerRequestBody,
            },
        },
        async (request) => {
            const { email, password, nickName } = request.body;

            await authService.register(email, password, nickName);
        },
    );

    fastify.post(
        '/refresh',
        { schema: { tags: ['auth'] } },
        async (request, reply) => {
            const { refreshToken } = request.cookies;

            if (!refreshToken) {
                return reply
                    .status(400)
                    .send({ error: 'Отсутствует refresh token' });
            }

            try {
                const decoded = fastify.jwt.verify(refreshToken) as {
                    id: string;
                    role: string;
                };

                const newAccessToken = fastify.jwt.sign(
                    { id: decoded.id, role: decoded.role },
                    { expiresIn: '1h' },
                );

                const newRefreshToken = fastify.jwt.sign(
                    { id: decoded.id, role: decoded.role },
                    {
                        expiresIn: '30d',
                    },
                );

                reply
                    .setCookie('accessToken', newAccessToken, {
                        path: '/',
                        httpOnly: false,
                        maxAge: accessTokenTtl,
                    })
                    .setCookie('refreshToken', newRefreshToken, {
                        path: '/',
                        httpOnly: true,
                        maxAge: refreshTokenTtl,
                    })
                    .send({ success: true });
            } catch {
                reply.status(400).send({ error: 'Invalid refresh token' });
            }
        },
    );

    fastify.post(
        '/logout',
        { schema: { tags: ['auth'] } },
        async (_, reply) => {
            reply
                .clearCookie('accessToken', { path: '/' })
                .clearCookie('refreshToken', { path: '/' })
                .send({ success: true });
        },
    );

    fastify.get<{ Querystring: { token: string } }>(
        '/confirm-email',
        {
            schema: {
                tags: ['auth'],
                querystring: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                    },
                },
            },
        },
        async (request, reply) => {
            await authService.confirmEmail(request.query.token);

            // TODO: поменять на страницу входа на фронте
            reply.redirect('http://localhost:5173', 302);
        },
    );
}
