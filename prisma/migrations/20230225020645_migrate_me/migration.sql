-- CreateTable
CREATE TABLE `PendingContributions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ideaId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    INDEX `PendingContributions_ideaId_idx`(`ideaId`),
    UNIQUE INDEX `PendingContributions_userId_ideaId_key`(`userId`, `ideaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AcceptedContributions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `ideaId` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    INDEX `AcceptedContributions_ideaId_idx`(`ideaId`),
    UNIQUE INDEX `AcceptedContributions_userId_ideaId_key`(`userId`, `ideaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
