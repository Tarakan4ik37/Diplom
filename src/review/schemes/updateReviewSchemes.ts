export const reviewIdParams = {
    type: 'object',
    properties: {
        id: { type: 'number' },
    },
    required: ['id'],
};
export const reviewUpdateBodyRequest = {
    type: 'object',
    properties: {
        rating: { type: 'number', minimum: 1, maximum: 10 },
        comment: { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
};
