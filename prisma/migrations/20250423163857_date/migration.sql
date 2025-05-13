-- CreateTable
CREATE TABLE "AnimeRelation" (
    "id" SERIAL NOT NULL,
    "fromAnimeId" INTEGER NOT NULL,
    "toAnimeId" INTEGER NOT NULL,

    CONSTRAINT "AnimeRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_fromAnimeId_fkey" FOREIGN KEY ("fromAnimeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_toAnimeId_fkey" FOREIGN KEY ("toAnimeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
