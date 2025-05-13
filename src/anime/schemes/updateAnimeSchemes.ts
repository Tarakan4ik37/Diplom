import { convertEnumToScheme } from '../../generic/utils.ts';
import { $Enums } from '@prisma/client';

export const animePutBodyRequest = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        type: {
            type: 'string',
            enum: convertEnumToScheme($Enums.Type),
        },
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
            items: { type: 'number' },
            nullable: true,
        },
        characters: {
            type: 'array',
            items: {
                anyOf: [
                    { type: 'number' },
                    {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            photoURL: { type: 'string' },
                            voiceActor: { type: 'string' },
                        },
                    },
                ],
            },
            nullable: true,
        },
        related: {
            type: 'array',
            items: { type: 'number' },
            nullable: true,
        },
    },
};
