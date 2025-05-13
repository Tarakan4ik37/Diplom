import { $Enums } from '@prisma/client';
import { convertEnumToScheme } from '../../generic/utils.ts';
import { queryPaginationScheme } from '../../generic/schemes.ts';
import { SortBy } from '../types/getManyAnimeTypes.ts';

export const animeGetManyRequest = {
    type: 'object',
    properties: {
        ...queryPaginationScheme,
        search: { type: 'string', nullable: true },
        startYear: { type: 'number', nullable: true },
        endYear: { type: 'number', nullable: true },
        genres: { type: 'array', items: { type: 'number' }, nullable: true },
        includeAllGenres: { type: 'boolean', nullable: true },
        type: {
            type: 'string',
            enum: convertEnumToScheme($Enums.Type),
            nullable: true,
        },
        status: {
            type: 'string',
            enum: convertEnumToScheme($Enums.AnimeStatus),
            nullable: true,
        },
        sortBy: {
            type: 'string',
            enum: convertEnumToScheme(SortBy),
            nullable: true,
        },
        isDescending: { type: 'boolean', nullable: true },
    },
};

export const animeGetManyResponse = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            type: { type: 'string', enum: convertEnumToScheme($Enums.Type) },
            posterURl: { type: 'string' },
            averageRating: { type: 'number' },
            genres: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                    },
                },
            },
            description: { type: 'string' },
            releaseDate: { type: 'string', format: 'date-time' },
        },
    },
};
