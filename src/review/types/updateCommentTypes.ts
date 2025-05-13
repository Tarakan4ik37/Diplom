export type CommentUpdateRequest = {
    Params: { id: number };
    Body: {
        text: string;
    };
};

export type CommentUpdateResponse = {
    success: true;
};
