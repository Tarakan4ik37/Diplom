import { FastifyInstance } from 'fastify';
import {
    CommentResponse,
    ReviewsGetManyRequest,
    ReviewsGetManyResponse,
} from './types/getManyReviewTypes.ts';

import createError from 'http-errors';
import { ReviewUpdateRequest } from './types/updateReviewTypes.ts';

export class ReviewsService {
    constructor(private readonly fastify: FastifyInstance) {}

    public async getMany({
        page,
        limit,
        animeId,
    }: ReviewsGetManyRequest['Querystring']): Promise<ReviewsGetManyResponse> {
        const reviews = (await this.fastify.prisma.review.findMany({
            where: { animeId, NOT: { comment: null } },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                createdAt: true,
                rating: true,
                user: {
                    select: { id: true, nickName: true },
                },
                comment: {
                    select: {
                        id: true,
                        user: {
                            select: { id: true, nickName: true },
                        },
                        text: true,
                        createdAt: true,
                    },
                },
            },
        })) as unknown as ReviewsGetManyResponse;

        const visited = new Set<CommentResponse>();
        const stack = reviews.reduce((acc, review) => {
            review.comment.replies = [];
            acc.push(review.comment);
            return acc;
        }, [] as CommentResponse[]);

        while (stack.length > 0) {
            const node = stack.pop();
            if (!node || visited.has(node)) continue;

            visited.add(node);
            node.replies = (
                (await this.fastify.prisma.comment.findMany({
                    where: { parentId: node.id },
                    select: {
                        id: true,
                        user: {
                            select: { id: true, nickName: true },
                        },
                        text: true,
                        createdAt: true,
                    },
                })) as CommentResponse[]
            ).map((reply) => {
                reply.replies = [];
                return reply;
            });

            stack.push(...node.replies);
        }

        return reviews;
    }

    public async update(
        data: ReviewUpdateRequest['Body'] & { id: number; userId: number },
    ): Promise<void> {
        const review = await this.fastify.prisma.review.findUnique({
            where: { id: data.id },
            include: { comment: true },
        });

        if (!review) throw createError(404, 'Отзыв не найден');
        if (review.userId !== data.userId)
            throw createError(403, 'Нет доступа');

        if (data.comment && review.commentId) {
            await this.fastify.prisma.comment.update({
                where: { id: review.commentId },
                data: { text: data.comment },
            });
        }

        await this.fastify.prisma.review.update({
            where: { id: data.id },
            data: {
                rating: data.rating,
            },
        });
    }

    public async delete(id: number, userId: number): Promise<void> {
        const review = await this.fastify.prisma.review.findUnique({
            where: { id },
            include: { comment: true },
        });

        if (!review) throw createError(404, 'Отзыв не найден');
        if (review.userId !== userId) throw createError(403, 'Нет доступа');

        if (review.commentId) {
            await this.fastify.prisma.comment.delete({
                where: { id: review.commentId },
            });
        }

        await this.fastify.prisma.review.delete({ where: { id } });
    }
}
