import { queryPaginationScheme } from '../../generic/schemes.ts';

export const genresGetManyRequest = {
    type: 'object',
    properties: {
        ...queryPaginationScheme,
        search: { type: 'string', nullable: true },
        isDescending: { type: 'boolean', nullable: true },
    },
};

export const genresGetManyResponse = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
        },
    },
};
