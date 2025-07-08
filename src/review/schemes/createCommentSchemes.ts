export const commentCreateBodyRequest = {
    type: 'object',
    required: ['text'],
    properties: {
        parentId: { type: 'number', nullable: true },
        text: {
            type: 'string',
            minLength: 1,
            maxLength: 2000,
        },
    },
};

export const commentCreateResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        commentId: { type: 'number' },
    },
};
