export type CommentCreateRequest = {
    Body: {
        parentId?: number;
        text: string;
    };
};

export type CommentCreateResponse = {
    success: true;
    commentId: number;
};
