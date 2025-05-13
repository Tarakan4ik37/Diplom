export type UpdateForAdminRequest = {
    firstName?: string | null;
    lastName?: string | null;
    midName?: string | null;
    isApproved?: boolean;
    nickName?: string;
};

export type UpdateForAdminResponse = { success: true };
