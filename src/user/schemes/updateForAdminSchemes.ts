export const updateForAdminRequest = {
    type: 'object',
    properties: {
        firstName: { type: 'string', nullable: true },
        lastName: { type: 'string', nullable: true },
        midName: { type: 'string', nullable: true },
        nickName: { type: 'string' },
    },
    additionalProperties: false,
};
