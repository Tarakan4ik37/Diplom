import Fastify from 'fastify';
import { animeController } from './anime/controller.ts';
import prismaPlugin from './prisma/plugin.ts';
import fastifySwagger from '@fastify/swagger';
import { charactersController } from './characters/controller.ts';
import { genresController } from './genres/controller.ts';
import { reviewsController } from './review/controller.ts';
import cookie from '@fastify/cookie';
import process from 'node:process';
import { authController } from './auth/controller.ts';
import jwtPlugin from './auth/jwt.ts';
import { userMeController } from './user/meController.ts';
import { userController } from './user/userController.ts';
import cors from '@fastify/cors';

const fastify = Fastify({
    logger: true,
});

await fastify.register(cors, {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    credentials: true,
});

await fastify.register(fastifySwagger, {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: 'Anime',
            description: 'AnimeAPI',
            version: '0.1.0',
        },
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    name: 'apiKey',
                    in: 'header',
                },
            },
        },
    },
});

await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: '/api',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
        return swaggerObject;
    },
    transformSpecificationClone: true,
});

fastify.register(cookie, {
    secret: process.env.COOKIE_SECRET as string,
    hook: 'onRequest',
});

fastify.register(prismaPlugin);
fastify.register(jwtPlugin);

fastify.register(animeController);
fastify.register(charactersController);
fastify.register(genresController);
fastify.register(reviewsController);
fastify.register(authController);
fastify.register(userMeController);
fastify.register(userController);

// Run the server!
try {
    await fastify.ready();
    fastify.swagger();
    await fastify.listen({ port: 3000 });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}
