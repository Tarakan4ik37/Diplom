import { FastifyInstance } from 'fastify';
import { idSchemes } from '../generic/schemes.ts';
import { animeGetOneResponse } from './schemes/getOneAnimeSchemes.ts';
import { animeCreateBodyRequest } from './schemes/createAnimeSchemes.ts';
import {
    AnimeGetOneRequest,
    AnimeGetOneResponse,
} from './types/getOneAnimeTypes.ts';
import {
    AnimeCreateRequest,
    AnimeCreateResponse,
} from './types/createAnimeTypes.ts';
import { AnimeService } from './service.ts';
import {
    AnimeGetManyRequest,
    AnimeGetManyResponse,
} from './types/getManyAnimeTypes.ts';
import {
    animeGetManyRequest,
    animeGetManyResponse,
} from './schemes/getManyAnimeSchemes.ts';
import {
    AnimeUpdateRequest,
    AnimeUpdateResponse,
} from './types/updateAnimeTypes.ts';
import { animePutBodyRequest } from './schemes/updateAnimeSchemes.ts';
import { $Enums } from '@prisma/client';
import { convertEnumToScheme } from '../generic/utils.ts';

export async function animeController(fastify: FastifyInstance) {
    const animeService = new AnimeService(fastify);

    //Получения 1 сущности
    fastify.get<AnimeGetOneRequest>(
        '/anime/:id',
        {
            schema: {
                tags: ['anime'],
                params: idSchemes,
                response: { '2xx': animeGetOneResponse },
            },
        },
        async (request): Promise<AnimeGetOneResponse> => {
            return animeService.getOne(request.params.id);
        },
    );

    //Получение множества сущностей
    fastify.get<AnimeGetManyRequest>(
        '/anime',
        {
            schema: {
                tags: ['anime'],
                querystring: animeGetManyRequest,
                response: { '2xx': animeGetManyResponse },
            },
        },
        async (request): Promise<AnimeGetManyResponse> => {
            return animeService.getMany(request.query);
        },
    );

    //Создание сущности
    fastify.post<AnimeCreateRequest>(
        '/anime',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['anime'],
                body: animeCreateBodyRequest,
                response: { '2xx': idSchemes },
            },
        },
        async (request): Promise<AnimeCreateResponse> => {
            return animeService.create(request.body);
        },
    );

    //Обновление сущности
    fastify.put<AnimeUpdateRequest>(
        '/anime/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['anime'],
                params: idSchemes,
                body: animePutBodyRequest,
                response: {
                    '2xx': {
                        type: 'object',
                        properties: { success: { type: 'boolean' } },
                    },
                },
            },
        },
        async (request): Promise<AnimeUpdateResponse> => {
            const { id } = request.params;
            await animeService.update({ ...request.body, id });
            return { success: true };
        },
    );

    fastify.patch<{
        Params: { id: number };
        Querystring: { status: $Enums.StatusViewingUser };
    }>(
        '/anime/:id',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['anime'],
                params: idSchemes,
                querystring: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: convertEnumToScheme($Enums.StatusViewingUser),
                        },
                    },
                },
            },
        },
        async (request) => {
            return animeService.statysProsmotra(
                request.params.id,
                request.user.id,
                request.query.status,
            );
        },
    );

    //Удаление сущности
    fastify.delete<{ Params: { id: number } }>(
        '/anime/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['anime'],
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
            await animeService.delete(id);
            return { success: true };
        },
    );
}
