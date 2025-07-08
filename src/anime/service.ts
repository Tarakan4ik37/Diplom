import { FastifyInstance } from 'fastify';
import createError from 'http-errors';

import {
    AnimeCreateRequest,
    AnimeCreateResponse,
    CreateCharacter,
} from './types/createAnimeTypes.ts';
import { AnimeGetOneResponse } from './types/getOneAnimeTypes.ts';
import {
    AnimeGetManyRequest,
    AnimeGetManyResponse,
} from './types/getManyAnimeTypes.ts';
import { AnimeUpdateRequest } from './types/updateAnimeTypes.ts';
import { $Enums } from '@prisma/client';
import { StatusGetManyResponse } from './types/getManyStatusTypes.ts';

export class AnimeService {
    constructor(private readonly fastify: FastifyInstance) {}

    public async getOne(id: number): Promise<AnimeGetOneResponse> {
        const anime = await this.fastify.prisma.anime.findFirst({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                releaseDate: true,
                endDate: true,
                episodesReleased: true,
                episodesTotal: true,
                status: true,
                season: true,
                source: true,
                studio: true,
                ageRating: true,
                posterURl: true,
                averageRating: true,
                type: true,
                genres: true,
                characters: true,
                related: {
                    select: {
                        id: true,
                        name: true,
                        posterURl: true,
                    },
                },
                symmetricRelated: {
                    select: {
                        id: true,
                        name: true,
                        posterURl: true,
                    },
                },
            },
        });

        if (!anime) {
            throw createError(404, 'Аниме не найдено');
        }

        return anime;
    }

    public async getMany({
        page,
        limit,
        search,
        startYear,
        endYear,
        genres,
        includeAllGenres,
        type,
        status,
        sortBy,
        isDescending,
    }: AnimeGetManyRequest['Querystring']): Promise<AnimeGetManyResponse> {
        const genresCondition = genres
            ? includeAllGenres
                ? {
                      AND: genres.map((id) => ({
                          genres: {
                              some: { id },
                          },
                      })),
                  }
                : {
                      genres: {
                          some: {
                              id: {
                                  in: genres,
                              },
                          },
                      },
                  }
            : {};

        return this.fastify.prisma.anime.findMany({
            select: {
                id: true,
                name: true,
                type: true,
                posterURl: true,
                averageRating: true,
                description: true,
                releaseDate: true,
                genres: true,
            },
            where: {
                name: search
                    ? {
                          contains: search,
                          mode: 'insensitive',
                      }
                    : undefined,
                releaseDate: {
                    gte: startYear ? new Date(startYear, 0, 1) : undefined,
                    lte: endYear ? new Date(endYear, 11, 31) : undefined,
                },
                ...genresCondition,
                type,
                status,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: sortBy
                ? {
                      [sortBy]: isDescending ? 'desc' : 'asc',
                  }
                : undefined,
        });
    }

    public async create(
        data: AnimeCreateRequest['Body'],
    ): Promise<AnimeCreateResponse> {
        const { existingCharacters, missingCharacters } =
            data.characters.reduce<{
                existingCharacters: { id: number }[];
                missingCharacters: CreateCharacter[];
            }>(
                (acc, character) => {
                    if (typeof character === 'number') {
                        acc.existingCharacters.push({ id: character });
                    } else {
                        acc.missingCharacters.push(character);
                    }
                    return acc;
                },
                {
                    existingCharacters: [],
                    missingCharacters: [],
                },
            );

        return this.fastify.prisma.anime.create({
            select: { id: true },
            data: {
                name: data.name,
                type: data.type,
                description: data.description,
                releaseDate: data.releaseDate,
                endDate: data.endDate,
                episodesReleased: data.episodesReleased,
                episodesTotal: data.episodesTotal,
                status: data.status,
                season: data.season,
                source: data.source,
                studio: data.studio,
                ageRating: data.ageRating,
                posterURl: data.posterURl,
                characters: {
                    create: missingCharacters,
                    connect: existingCharacters,
                },
                genres: {
                    connect: data.genres.map((genreId) => ({ id: genreId })),
                },
                related: {
                    connect: data.related?.map((animeId) => ({
                        id: animeId,
                    })),
                },
            },
        });
    }

    public async update(
        data: AnimeUpdateRequest['Body'] & { id: number },
    ): Promise<void> {
        // Список полей, которые можно просто перенести в update
        const scalarFields = [
            'name',
            'type',
            'description',
            'releaseDate',
            'endDate',
            'episodesReleased',
            'episodesTotal',
            'status',
            'season',
            'source',
            'studio',
            'ageRating',
            'posterURl',
        ] as const;

        // Собираем объект updates только из переданных полей
        const updates: Record<string, any> = Object.fromEntries(
            scalarFields
                .map((key) => [key, data[key]])
                .filter(([_, value]) => value !== undefined),
        );

        // Обработка genres
        if (data.genres) {
            updates.genres = {
                set: data.genres.map((id) => ({ id })),
            };
        }

        // Обработка characters
        if (data.characters) {
            const { existingCharacters, missingCharacters } =
                data.characters.reduce<{
                    existingCharacters: { id: number }[];
                    missingCharacters: CreateCharacter[];
                }>(
                    (acc, character) => {
                        if (typeof character === 'number') {
                            acc.existingCharacters.push({ id: character });
                        } else {
                            acc.missingCharacters.push(character);
                        }
                        return acc;
                    },
                    { existingCharacters: [], missingCharacters: [] },
                );

            updates.characters = {
                set: existingCharacters,
                create: missingCharacters,
            };
        }

        // Обработка related
        if (data.related) {
            updates.related = {
                set: data.related.map((id) => ({ id })),
            };
        }

        // Выполняем обновление
        await this.fastify.prisma.anime.update({
            where: { id: data.id },
            data: updates,
        });
    }

    public async delete(id: number): Promise<void> {
        await this.fastify.prisma.anime.delete({
            where: { id },
        });
    }

    public async statysProsmotra(
        animeId: number,
        userId: number,
        status: $Enums.StatusViewingUser,
    ) {
        const data = await this.fastify.prisma.statusViewing.findFirst({
            select: { id: true },
            where: { animeId, userId },
        });
        if (data) {
            await this.fastify.prisma.statusViewing.update({
                where: { id: data.id },
                data: { status },
            });
            return;
        }
        await this.fastify.prisma.statusViewing.create({
            data: { status, userId, animeId },
        });
    }

    public async getByStatus(
        userId: number,
        page: number,
        limit: number,
        status?: $Enums.StatusViewingUser,
        search?: string,
    ): Promise<StatusGetManyResponse> {
        const results = await this.fastify.prisma.statusViewing.findMany({
            where: {
                userId,
                ...(status ? { status } : {}),
                anime: {
                    name: search
                        ? {
                              contains: search,
                              mode: 'insensitive',
                          }
                        : undefined,
                },
            },
            select: {
                anime: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        posterURl: true,
                        averageRating: true,
                        description: true,
                        releaseDate: true,
                        genres: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        return results.map((entry) => entry.anime);
    }
}
