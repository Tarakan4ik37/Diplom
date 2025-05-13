/*
  Warnings:

  - You are about to drop the column `animeId` on the `Characters` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Characters" DROP CONSTRAINT "Characters_animeId_fkey";

-- AlterTable
ALTER TABLE "Characters" DROP COLUMN "animeId";

-- CreateTable
CREATE TABLE "_AnimeToCharacters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnimeToCharacters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AnimeToCharacters_B_index" ON "_AnimeToCharacters"("B");

-- AddForeignKey
ALTER TABLE "_AnimeToCharacters" ADD CONSTRAINT "_AnimeToCharacters_A_fkey" FOREIGN KEY ("A") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeToCharacters" ADD CONSTRAINT "_AnimeToCharacters_B_fkey" FOREIGN KEY ("B") REFERENCES "Characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
