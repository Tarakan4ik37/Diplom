const baseUserProperties = {
    id: { type: 'number' },
    nickName: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string', nullable: true },
    lastMame: { type: 'string', nullable: true },
    midName: { type: 'string', nullable: true },
};

export const userSelfGetOneResponse = {
    type: 'object',
    properties: {
        ...baseUserProperties,
        isApproved: { type: 'boolean' },
    },
};

export const userPublicGetOneResponse = {
    type: 'object',
    properties: {
        ...baseUserProperties,
    },
};
