import { FastifyInstance } from 'fastify';
import { GenresService } from './service.ts';
import { genresGetManyResponse } from './schemes/getManyGenresSchemes.ts';
import {
    GenresGetManyRequest,
    GenresGetManyResponse,
} from './types/getManyGenresTypes.ts';
import { idSchemes } from '../generic/schemes.ts';
import { genresPutBodyRequest } from './schemes/updateGenresSchemes.ts';
import {
    GenresUpdateResponse,
    GenresUpdateRequest,
} from './types/updateGenresTypes.ts';
import {
    GenresCreateRequest,
    GenresCreateResponse,
} from './types/createGenresTypes.ts';
import { genresCreateBodyRequest } from './schemes/createGenresSchemes.ts';

export async function genresController(fastify: FastifyInstance) {
    const genresService = new GenresService(fastify);

    //Получение множества сущностей
    fastify.get<GenresGetManyRequest>(
        '/genres',
        {
            schema: {
                tags: ['genres'],

                response: { '2xx': genresGetManyResponse },
            },
        },
        async (request): Promise<GenresGetManyResponse> => {
            return genresService.getMany(request.query);
        },
    );

    //Изменение сущности
    fastify.put<GenresUpdateRequest>(
        '/genres/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['genres'],
                params: idSchemes,
                body: genresPutBodyRequest,
                response: {
                    '2xx': {
                        type: 'object',
                        properties: { success: { type: 'boolean' } },
                    },
                },
            },
        },
        async (request): Promise<GenresUpdateResponse> => {
            const { id } = request.params;
            await genresService.update({ ...request.body, id });
            return { success: true };
        },
    );

    //Создание сущности
    fastify.post<GenresCreateRequest>(
        '/genres',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['genres'],
                body: genresCreateBodyRequest,
                response: { '2xx': idSchemes },
            },
        },
        async (request): Promise<GenresCreateResponse> => {
            return genresService.create(request.body);
        },
    );

    //Удаление сущности
    fastify.delete<{ Params: { id: number } }>(
        '/genres/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['genres'],
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
            await genresService.delete(id);
            return { success: true };
        },
    );
}
