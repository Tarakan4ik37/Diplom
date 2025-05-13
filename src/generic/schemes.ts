export const idSchemes = {
    type: 'object',
    properties: {
        id: { type: 'number' },
    },
};

export const queryPaginationScheme = {
    page: { type: 'number', minimum: 1 },
    limit: { type: 'number', minimum: 1 },
};
