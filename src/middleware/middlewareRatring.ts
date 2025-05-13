import { PrismaClient } from '@prisma/client';

const ratingExtension = new PrismaClient().$extends({
    query: {
        review: {
            async create({ args, query }) {
                const result = await query(args);
                if (result.animeId !== undefined) {
                    await recalculateRating(result.animeId);
                }
                return result;
            },
            async update({ args, query }) {
                const result = await query(args);
                if (result.animeId !== undefined) {
                    await recalculateRating(result.animeId);
                }
                return result;
            },
            async delete({ args, query }) {
                const review = await ratingExtension.review.findUnique({
                    where: args.where,
                    select: { animeId: true },
                });

                const result = await query(args);

                if (review?.animeId) {
                    await recalculateRating(review.animeId);
                }
                return result;
            },
        },
    },
});

async function recalculateRating(animeId: number): Promise<void> {
    const avg = await ratingExtension.review.aggregate({
        where: { animeId },
        _avg: { rating: true },
    });

    await ratingExtension.anime.update({
        where: { id: animeId },
        data: {
            averageRating: avg._avg.rating ?? 0,
        },
    });
}
