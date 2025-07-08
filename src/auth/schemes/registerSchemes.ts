export const registerRequestBody = {
    type: 'object',
    required: ['email', 'password', 'nickName'],
    properties: {
        email: { type: 'string', format: 'email' },
        nickName: { type: 'string' },
        password: { type: 'string', minLength: 6 },
    },
};
