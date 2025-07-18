export const genresGetManyResponse = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
        },
        required: ['id', 'name'],
    },
};
