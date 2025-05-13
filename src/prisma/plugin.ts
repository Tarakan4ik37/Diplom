import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prismaPlugin: FastifyPluginAsync = fp(async (server) => {
    const prisma = new PrismaClient();

    prisma.$use(async (params, next) => {
        if (params.model === 'Review') {
            const action = params.action;
            let animeIdToUpdate = null;

            if (
                action === 'delete' ||
                action === 'update' ||
                action === 'deleteMany'
            ) {
                if (params.args.where && params.args.where.id) {
                    try {
                        const review = await prisma.review.findUnique({
                            where: { id: params.args.where.id },
                            select: { animeId: true },
                        });
                        if (review) {
                            animeIdToUpdate = review.animeId;
                        }
                    } catch (fetchError) {
                        console.error(
                            `Ошибка при получении animeId для ревью ${params.args.where.id} перед ${action}:`,
                            fetchError,
                        );
                    }
                }
            } else if (action === 'create') {
                if (params.args.data && params.args.data.animeId) {
                    animeIdToUpdate = params.args.data.animeId;
                } else if (
                    params.args.data &&
                    params.args.data.anime &&
                    params.args.data.anime.connect &&
                    params.args.data.anime.connect.id
                ) {
                    animeIdToUpdate = params.args.data.anime.connect.id;
                }
            }

            const result = await next(params);

            if (animeIdToUpdate !== null) {
                try {
                    const average = await prisma.review.aggregate({
                        _avg: {
                            rating: true,
                        },
                        where: {
                            animeId: animeIdToUpdate,
                        },
                    });

                    const newAverageRating = average._avg.rating;

                    await prisma.anime.update({
                        where: { id: animeIdToUpdate },
                        data: { averageRating: newAverageRating },
                    });
                } catch (updateError) {
                    console.error(
                        `Ошибка при агрегации или обновлении среднего рейтинга для Anime ID ${animeIdToUpdate}:`,
                        updateError,
                    );
                }
            }

            return result;
        }

        return next(params);
    });

    await prisma.$connect();

    server.decorate('prisma', prisma);

    server.addHook('onClose', async (server) => {
        await server.prisma.$disconnect();
    });
});

export default prismaPlugin;
