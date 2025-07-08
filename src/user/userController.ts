import { FastifyInstance } from 'fastify';
import { UserService } from './service.ts';
import { GetPublicUserResponse } from './types/getOneUserTypes.ts';
import { updateForAdminRequest } from './schemes/updateForAdminSchemes.ts';
import {
    UpdateForAdminRequest,
    UpdateForAdminResponse,
} from './types/updateForAdminTypes.ts';
import { userPublicGetOneResponse } from './schemes/getOneUserSchemes.ts';

export async function userController(fastify: FastifyInstance) {
    const service = new UserService(fastify);

    fastify.get(
        '/users/:id',
        {
            schema: {
                tags: ['users'],
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                    },
                    required: ['id'],
                },
                response: { '2xx': userPublicGetOneResponse },
            },
        },
        async (request): Promise<GetPublicUserResponse> => {
            const { id } = request.params as { id: number };
            return service.getPublicUser(id);
        },
    );

    fastify.put(
        '/admin/users/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['admin'],
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                    },
                    required: ['id'],
                },
                body: updateForAdminRequest,
                response: {
                    '2xx': {
                        type: 'object',
                        properties: { success: { type: 'boolean' } },
                    },
                },
            },
        },
        async (request): Promise<UpdateForAdminResponse> => {
            const { id } = request.params as { id: number };
            const body = request.body as UpdateForAdminRequest;

            return service.updateUserAdmin(id, body);
        },
    );
}
