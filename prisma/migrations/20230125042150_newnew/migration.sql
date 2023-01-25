/*
  Warnings:

  - You are about to drop the column `producer_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Idea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IdeaUserLikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Account_userId_idx` ON `Account`;

-- DropIndex
DROP INDEX `Session_userId_idx` ON `Session`;

-- DropIndex
DROP INDEX `User_producer_name_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `producer_name`,
    DROP COLUMN `role`;

-- DropTable
DROP TABLE `Idea`;

-- DropTable
DROP TABLE `_IdeaUserLikes`;
