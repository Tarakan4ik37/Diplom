export const commentIdParams = {
    type: 'object',
    properties: {
        id: { type: 'number' },
    },
    required: ['id'],
};

export const commentUpdateBodyRequest = {
    type: 'object',
    properties: {
        text: { type: 'string', minLength: 1 },
    },
    required: ['text'],
    additionalProperties: false,
};
