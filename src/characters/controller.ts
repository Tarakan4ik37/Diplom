import { FastifyInstance } from 'fastify';
import { CharactersService } from './service.ts';
import {
    CharactersGetManyRequest,
    CharactersGetManyResponse,
} from './types/getManyCharactersTypes.ts';
import {
    charactersGetManyRequest,
    charactersGetManyResponse,
} from './schemes/getManyCharactersSchemes.ts';
import { characterPutBodyRequest } from './schemes/updateCharactersSchemes.ts';
import { idSchemes } from '../generic/schemes.ts';
import {
    CharactersUpdateRequest,
    CharactersUpdateResponse,
} from './types/updateCharactersTypes.ts';

export async function charactersController(fastify: FastifyInstance) {
    const charactersService = new CharactersService(fastify);

    //Получение множества сущностей
    fastify.get<CharactersGetManyRequest>(
        '/characters',
        {
            schema: {
                tags: ['characters'],
                querystring: charactersGetManyRequest,
                response: { '2xx': charactersGetManyResponse },
            },
        },
        async (request): Promise<CharactersGetManyResponse> => {
            return charactersService.getMany(request.query);
        },
    );

    //Обновление сущности
    fastify.put<CharactersUpdateRequest>(
        '/characters/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['characters'],
                params: idSchemes,
                body: characterPutBodyRequest,
                response: {
                    '2xx': {
                        type: 'object',
                        properties: { success: { type: 'boolean' } },
                    },
                },
            },
        },
        async (request): Promise<CharactersUpdateResponse> => {
            const { id } = request.params;
            await charactersService.update({ ...request.body, id });
            return { success: true };
        },
    );

    //Удаление сущности
    fastify.delete<{ Params: { id: number } }>(
        '/characters/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['characters'],
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                        },
                    },
                },
            },
        },
        async (request) => {
            const id = Number(request.params.id);
            await charactersService.delete(id);
            return { success: true };
        },
    );
}
