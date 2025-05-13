import { FastifyInstance } from 'fastify';
import createError from 'http-errors';

export class CommentService {
    constructor(private readonly fastify: FastifyInstance) {}

    public async delete(id: number, userId: number): Promise<void> {
        const comment = await this.fastify.prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) throw createError(404, 'Комментарий не найден');
        if (comment.userId !== userId) throw createError(403, 'Нет доступа');

        await this.deleteWithReplies(id);
    }

    public async update(data: {
        id: number;
        userId: number;
        text: string;
    }): Promise<void> {
        const comment = await this.fastify.prisma.comment.findUnique({
            where: { id: data.id },
        });

        if (!comment) throw createError(404, 'Комментарий не найден');
        if (comment.userId !== data.userId)
            throw createError(403, 'Нет доступа');

        await this.fastify.prisma.comment.update({
            where: { id: data.id },
            data: { text: data.text },
        });
    }

    private async deleteWithReplies(id: number): Promise<void> {
        const replies = await this.fastify.prisma.comment.findMany({
            where: { parentId: id },
            select: { id: true },
        });

        for (const reply of replies) {
            await this.deleteWithReplies(reply.id);
        }

        await this.fastify.prisma.comment.delete({ where: { id } });
    }

    public async deleteByAdmin(id: number): Promise<void> {
        const comment = await this.fastify.prisma.comment.findUnique({
            where: { id },
        });

        if (!comment) {
            throw createError(404, 'Комментарий не найден');
        }

        await this.deleteWithReplies(id);
    }
}
