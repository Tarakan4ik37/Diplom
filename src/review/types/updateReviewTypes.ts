export type ReviewUpdateRequest = {
    Params: { id: number };
    Body: {
        rating?: number;
        comment?: string;
    };
};
export type ReviewUpdateResponse = { success: true };
