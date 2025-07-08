export const reviewCreateBodyRequest = {
    type: 'object',
    required: ['animeId', 'rating'],
    properties: {
        animeId: { type: 'number' },
        rating: {
            type: 'number',
            minimum: 1,
            maximum: 10,
        },
        commentText: {
            type: 'string',
            nullable: true,
        },
    },
};

export const reviewCreateResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        reviewId: { type: 'number' },
    },
};
