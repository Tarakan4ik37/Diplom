import { $Enums } from '@prisma/client';

export const statusGetOneRequest = {
    type: 'object',
    properties: {
        animeId: { type: 'integer' },
    },
    required: ['animeId'],
} as const;

export const statusGetOneResponse = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: Object.values($Enums.StatusViewingUser),
        },
    },
} as const;
