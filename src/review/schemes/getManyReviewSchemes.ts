import { queryPaginationScheme } from '../../generic/schemes.ts';

export const reviewsGetManyRequest = {
    type: 'object',
    properties: {
        ...queryPaginationScheme,
        animeId: { type: 'number' },
    },
};

export const commentSchema = {
    $id: 'Comment',
    type: 'object',
    properties: {
        id: { type: 'number' },
        text: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        user: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                nickName: { type: 'string' },
            },
            required: ['id', 'nickName'],
        },
        replies: {
            type: 'array',
            items: { $ref: 'Comment#' }, // Обращаемся по $id!
        },
    },
    required: ['id', 'text', 'createdAt', 'user', 'replies'],
};

export const reviewsGetManyResponse = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            rating: { type: 'number' },
            user: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    nickName: { type: 'string' },
                },
                required: ['id', 'nickName'],
            },
            comment: { $ref: 'Comment#' },
        },
        required: ['id', 'createdAt', 'rating', 'user', 'comment'],
    },
};
