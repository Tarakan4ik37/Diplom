import { $Enums } from '@prisma/client';
import { convertEnumToScheme } from '../../generic/utils.ts';

export const animeGetOneResponse = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        type: { type: 'string', enum: convertEnumToScheme($Enums.Type) },
        description: { type: 'string' },
        releaseDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', nullable: true, format: 'date-time' },
        episodesReleased: { type: 'number' },
        episodesTotal: { type: 'number', nullable: true },
        status: {
            type: 'string',
            enum: convertEnumToScheme($Enums.AnimeStatus),
        },
        season: { type: 'string' },
        source: {
            type: 'string',
            enum: convertEnumToScheme($Enums.AnimeSource),
        },
        studio: { type: 'string' },
        ageRating: { type: 'number' },
        posterURl: { type: 'string' },
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
        averageRating: { type: 'number' },
        characters: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    photoURL: { type: 'string' },
                    voiceActor: { type: 'string' },
                },
            },
        },
        related: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    posterURl: { type: 'string' },
                },
            },
        },
        symmetricRelated: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    posterURl: { type: 'string' },
                },
            },
        },
    },
};
