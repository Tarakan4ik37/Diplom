import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import * as process from 'node:process';

export default fp(async function (fastify: FastifyInstance) {
    fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET as string,
        cookie: {
            cookieName: 'accessToken',
            signed: false,
        },
    });

    fastify.decorate('authenticate', async function (request: any, reply: any) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.status(401).send({ error: 'Войдите' });
        }
    });

    fastify.decorate('admin', async function (request: any, reply: any) {
        try {
            await request.jwtVerify();
            if (request.user.role !== 'admin') {
                return reply
                    .status(403)
                    .send({ error: 'Доступ запрещен: нехватает прав' });
            }
        } catch (err) {
            reply.status(401).send({ error: 'Войдите' });
        }
    });
});
