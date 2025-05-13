-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_commentId_fkey";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "commentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
