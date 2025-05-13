import { Review, Comment } from '@prisma/client';

export type ReviewsGetManyRequest = {
    Querystring: {
        page: number;
        limit: number;
        animeId: number;
    };
};

export type CommentResponse = Pick<Comment, 'id' | 'text' | 'createdAt'> & {
    user: {
        id: number;
        nickName: string;
    };
    replies: CommentResponse[];
};

export type ReviewsGetManyResponse = (Pick<Review, 'id' | 'rating'> & {
    comment: CommentResponse;
})[];
