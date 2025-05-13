import { queryPaginationScheme } from '../../generic/schemes.ts';
import { convertEnumToScheme } from '../../generic/utils.ts';
import { SortBy } from '../types/getManyCharactersTypes.ts';

export const charactersGetManyRequest = {
    type: 'object',
    properties: {
        ...queryPaginationScheme,
        search: { type: 'string', nullable: true },
        sortBy: {
            type: 'string',
            enum: convertEnumToScheme(SortBy),
            nullable: true,
        },
        isDescending: { type: 'boolean', nullable: true },
        nameAnime: { type: 'string', nullable: true },
    },
};

export const charactersGetManyResponse = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            photoURL: { type: 'string' },
            voiceActor: { type: 'string' },
            anime: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                    },
                },
            },
        },
    },
};
