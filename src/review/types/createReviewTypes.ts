export type ReviewCreateRequest = {
    Body: {
        animeId: number;
        rating: number;
        commentText?: string | null;
    };
};

export type ReviewCreateResponse = {
    success: true;
    reviewId: number;
};
