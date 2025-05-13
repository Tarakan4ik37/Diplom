import 'fastify';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
    export interface FastifyInstance {
        prisma: PrismaClient;
        authenticate: any;
        admin: any;
    }

    interface FastifyRequest {
        user: {
            id: number;
            role: string;
        };
    }
}
