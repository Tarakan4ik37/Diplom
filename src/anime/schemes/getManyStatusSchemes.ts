import { $Enums } from '@prisma/client';
import { convertEnumToScheme } from '../../generic/utils.ts';
import { queryPaginationScheme } from '../../generic/schemes.ts';

export const statusGetManyRequest = {
    type: 'object',
    properties: {
        ...queryPaginationScheme,
        search: { type: 'string', nullable: true },
        status: {
            type: 'string',
            enum: convertEnumToScheme($Enums.StatusViewingUser),
            nullable: true,
        },
    },
    required: ['page', 'limit'],
};

export const statusGetManyResponse = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            type: {
                type: 'string',
                enum: convertEnumToScheme($Enums.Type),
            },
            posterURl: { type: 'string' },
            averageRating: { type: 'number' },
            description: { type: 'string' },
            releaseDate: {
                type: 'string',
                format: 'date-time',
            },
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
        },
        required: [
            'id',
            'name',
            'type',
            'posterURl',
            'genres',
            'description',
            'releaseDate',
        ],
    },
};
