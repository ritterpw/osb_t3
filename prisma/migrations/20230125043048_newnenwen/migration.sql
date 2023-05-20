/*
  Warnings:

  - A unique constraint covering the columns `[producer_name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `producer_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `producer_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `Idea` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `tag_one` VARCHAR(191) NOT NULL,
    `tag_two` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `likes` INTEGER NOT NULL DEFAULT 0,
    `slug` VARCHAR(191) NULL,

    UNIQUE INDEX `Idea_file_key`(`file`),
    UNIQUE INDEX `Idea_slug_key`(`slug`),
    INDEX `Idea_userId_idx`(`userId`),
    FULLTEXT INDEX `Idea_title_description_tag_one_tag_two_idx`(`title`, `description`, `tag_one`, `tag_two`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_IdeaUserLikes` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_IdeaUserLikes_AB_unique`(`A`, `B`),
    INDEX `_IdeaUserLikes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_producer_name_key` ON `User`(`producer_name`);
