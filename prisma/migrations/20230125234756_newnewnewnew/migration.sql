/*
  Warnings:

  - You are about to drop the column `likes` on the `Idea` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Idea` DROP COLUMN `likes`;

-- AlterTable
ALTER TABLE `User` MODIFY `producer_name` VARCHAR(191) NULL;
