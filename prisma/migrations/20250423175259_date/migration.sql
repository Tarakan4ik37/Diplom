/*
  Warnings:

  - You are about to drop the `AnimeRelation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AnimeRelation" DROP CONSTRAINT "AnimeRelation_fromAnimeId_fkey";

-- DropForeignKey
ALTER TABLE "AnimeRelation" DROP CONSTRAINT "AnimeRelation_toAnimeId_fkey";

-- DropTable
DROP TABLE "AnimeRelation";

-- CreateTable
CREATE TABLE "_RelatedAnime" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RelatedAnime_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RelatedAnime_B_index" ON "_RelatedAnime"("B");

-- AddForeignKey
ALTER TABLE "_RelatedAnime" ADD CONSTRAINT "_RelatedAnime_A_fkey" FOREIGN KEY ("A") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RelatedAnime" ADD CONSTRAINT "_RelatedAnime_B_fkey" FOREIGN KEY ("B") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
