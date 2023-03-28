/*
  Warnings:

  - You are about to drop the `AcceptedContributions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PendingContributions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `AcceptedContributions`;

-- DropTable
DROP TABLE `PendingContributions`;

-- CreateTable
CREATE TABLE `Contribution` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ideaId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,

    INDEX `Contribution_userId_idx`(`userId`),
    INDEX `Contribution_ideaId_idx`(`ideaId`),
    UNIQUE INDEX `Contribution_userId_ideaId_key`(`userId`, `ideaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
