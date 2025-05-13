export type UserUpdateRequest = {
    firstName?: string | null;
    lastName?: string | null;
    midName?: string | null;
};

export type UserUpdateResponse = { success: true };
