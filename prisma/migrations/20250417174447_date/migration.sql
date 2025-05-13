-- CreateEnum
CREATE TYPE "AnimeStatus" AS ENUM ('RELEASED', 'ONGOING', 'PAUSED', 'PLANNED');

-- CreateEnum
CREATE TYPE "StatusViewingUser" AS ENUM ('POSTPONED', 'WATCHING', 'VIEWED', 'ABANDONED', 'PLANNED', 'REVIEWING');

-- CreateEnum
CREATE TYPE "AnimeSource" AS ENUM ('MANGA', 'GAME', 'ORIGINAL', 'OTHER', 'WEB_MANGA', 'LIGHT_NOVELLA', 'RANOBE', 'VISUAL_NOVELLA');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('FILN', 'TV_SERIES', 'SPECIAL', 'OVA', 'ONA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nickName" TEXT NOT NULL,
    "firstName" TEXT,
    "lastMame" TEXT,
    "midName" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "episodesReleased" INTEGER NOT NULL,
    "episodesTotal" INTEGER,
    "status" "AnimeStatus" NOT NULL,
    "season" TIMESTAMP(3) NOT NULL,
    "source" "AnimeSource" NOT NULL,
    "studio" TEXT NOT NULL,
    "ageRating" INTEGER NOT NULL,
    "posterURl" TEXT NOT NULL,
    "averageRating" DOUBLE PRECISION,
    "Type" "Type" NOT NULL,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "animeId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Characters" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photoURL" TEXT NOT NULL,
    "voiceActor" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "Characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusViewing" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "animeId" INTEGER NOT NULL,
    "status" "StatusViewingUser" NOT NULL,

    CONSTRAINT "StatusViewing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimeToGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AnimeToGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nickName_key" ON "User"("nickName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Genres_name_key" ON "Genres"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Review_commentId_key" ON "Review"("commentId");

-- CreateIndex
CREATE INDEX "_AnimeToGenres_B_index" ON "_AnimeToGenres"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusViewing" ADD CONSTRAINT "StatusViewing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusViewing" ADD CONSTRAINT "StatusViewing_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeToGenres" ADD CONSTRAINT "_AnimeToGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeToGenres" ADD CONSTRAINT "_AnimeToGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
