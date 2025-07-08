import { FastifyInstance } from 'fastify';
import { UserService } from './service.ts';
import { GetOneUserResponse } from './types/getOneUserTypes.ts';
import { userSelfGetOneResponse } from './schemes/getOneUserSchemes.ts';
import { userUpdateRequestBody } from './schemes/updateUserSchemes.ts';
import {
    UserUpdateRequest,
    UserUpdateResponse,
} from './types/updateUserTypes.ts';

export async function userMeController(fastify: FastifyInstance) {
    const service = new UserService(fastify);

    fastify.get(
        '/me',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['me'],
                response: { '2xx': userSelfGetOneResponse },
            },
        },
        async (request): Promise<GetOneUserResponse> => {
            return service.getUserSelf(request.user.id);
        },
    );

    fastify.get(
        '/admin/users/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['admin'],
                response: { '2xx': userSelfGetOneResponse },
            },
        },
        async (request): Promise<GetOneUserResponse> => {
            return service.getUserSelf(request.user.id);
        },
    );

    fastify.put(
        '/me',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['me'],
                body: userUpdateRequestBody,
                response: {
                    '2xx': {
                        type: 'object',
                        properties: { success: { type: 'boolean' } },
                    },
                },
            },
        },
        async (request): Promise<UserUpdateResponse> => {
            const userId = request.user.id;
            const body = request.body as UserUpdateRequest;

            return service.updateUserSelf(userId, body);
        },
    );
}
