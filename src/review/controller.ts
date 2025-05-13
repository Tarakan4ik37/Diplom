import { FastifyInstance } from 'fastify';
import { ReviewsService } from './reviewService.ts';
import { CommentService } from './commentService.ts';
import {
    ReviewsGetManyRequest,
    ReviewsGetManyResponse,
} from './types/getManyReviewTypes.ts';
import {
    commentSchema,
    reviewsGetManyRequest,
    reviewsGetManyResponse,
} from './schemes/getManyReviewSchemes.ts';
import {
    ReviewUpdateRequest,
    ReviewUpdateResponse,
} from './types/updateReviewTypes.ts';
import {
    reviewIdParams,
    reviewUpdateBodyRequest,
} from './schemes/updateReviewSchemes.ts';
import {
    CommentUpdateRequest,
    CommentUpdateResponse,
} from './types/updateCommentTypes.ts';
import {
    commentIdParams,
    commentUpdateBodyRequest,
} from './schemes/updateCommentSchemes.ts';

export async function reviewsController(fastify: FastifyInstance) {
    const reviewService = new ReviewsService(fastify);
    const commentService = new CommentService(fastify);

    fastify.addSchema(commentSchema);

    fastify.get<ReviewsGetManyRequest>(
        '/reviews',
        {
            schema: {
                tags: ['review'],
                querystring: reviewsGetManyRequest,
                response: { '2xx': reviewsGetManyResponse },
            },
        },
        async (request): Promise<ReviewsGetManyResponse> => {
            return reviewService.getMany(request.query);
        },
    );

    fastify.put<ReviewUpdateRequest, ReviewUpdateResponse>(
        '/review/:id',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['review'],
                params: reviewIdParams,
                body: reviewUpdateBodyRequest,
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                        },
                    },
                },
            },
        },
        async (request): Promise<ReviewUpdateResponse> => {
            const { id } = request.params;
            await reviewService.update({
                ...request.body,
                id,
                userId: request.user.id,
            });
            return { success: true };
        },
    );

    fastify.delete<{ Params: { id: number } }>(
        '/review/:id',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['review'],
                params: {
                    type: 'object',
                    properties: { id: { type: 'number' } },
                    required: ['id'],
                },
                response: {
                    '2xx': {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                        },
                    },
                },
            },
        },
        async (request) => {
            await reviewService.delete(request.params.id, request.user.id);
            return { success: true };
        },
    );

    fastify.put<CommentUpdateRequest, CommentUpdateResponse>(
        '/comments/:id',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                params: commentIdParams,
                body: commentUpdateBodyRequest,
            },
        },
        async (request): Promise<CommentUpdateResponse> => {
            await commentService.update({
                id: request.params.id,
                userId: request.user.id,
                text: request.body.text,
            });

            return { success: true };
        },
    );
    fastify.delete<{ Params: { id: number } }>(
        '/comments/:id',
        {
            preHandler: [fastify.authenticate],
            schema: {
                tags: ['comment'],
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                    },
                    required: ['id'],
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                        },
                    },
                },
            },
        },
        async (request): Promise<{ success: true }> => {
            await commentService.delete(request.params.id, request.user.id);
            return { success: true };
        },
    );

    fastify.delete<{ Params: { id: number } }>(
        '/admin/comments/:id',
        {
            preHandler: [fastify.admin],
            schema: {
                tags: ['admin'],
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                    },
                    required: ['id'],
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            success: { type: 'boolean' },
                        },
                    },
                },
            },
        },
        async (request): Promise<{ success: true }> => {
            await commentService.deleteByAdmin(request.params.id);
            return { success: true };
        },
    );
}
