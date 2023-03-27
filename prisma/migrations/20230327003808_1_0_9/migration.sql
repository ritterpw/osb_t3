-- CreateIndex
CREATE FULLTEXT INDEX `Idea_tag_one_tag_two_idx` ON `Idea`(`tag_one`, `tag_two`);

-- CreateIndex
CREATE FULLTEXT INDEX `Idea_title_description_idx` ON `Idea`(`title`, `description`);
