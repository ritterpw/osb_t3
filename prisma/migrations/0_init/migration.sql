-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('Hip_hop', 'Trap', 'Rnb', 'Pop', 'Electronic', 'Reggae', 'Rock', 'Underground', 'Old_school', 'West_coast', 'Drill', 'Reggaeton', 'Soul', 'Afro_beat', 'New_soul', 'East_coast', 'Pop_hip_hop', 'Alternative_rnb', 'Club', 'Dance_hall', 'Alternative', 'Pop_rap', 'House', 'Gangsta', 'Pop_rnb', 'Alternative_hip_hop', 'World', 'Indie_rock', 'Hyperpop', 'Orchestral', 'Downtempo', 'Pop_electronic', 'Pop_rock', 'Indie', 'Neo_soul', 'Ambient', 'Break_beat', 'Country', 'Lofi', 'Boom_Bap', 'Grime', 'Hip_Hop_Soul', 'Latin', 'Alternative_rock', 'Funk', 'Drum_and_bass', 'Dance', 'Beats', 'Class_soul', 'K_pop', 'Underground_Hip_Hop', 'Roots', 'Uk_grime', 'Afro_pop', 'Techno', 'Afro', 'Two_step', 'Chill', 'Old_school_hip_hop', 'Pop_country', 'Synthwave', 'Crunk', 'Instrumental_Hip_Hop', 'Rage_Beats', 'Emo_Hip_Hop', 'Dubstep', 'Experimental_Hip_Hop', 'Classical', 'Freestyle_Rap', 'Jazz', 'Gangsta_Rap', 'LoFi_Hip_Hop', 'Folk', 'Dub', 'Contemporary_Rnb', 'Country_rock', 'California_Sound', 'Cloud_Rap', 'Jersey_Club', 'Electro_pop', 'Trance', 'Gospel', 'Industrial', 'Jazz_Rap', 'Hardcore_Hip_Hop', 'Jazz_fusion', 'Metal', 'Edm', 'Trip_hop', 'Smooth_rnb', 'Classical_rock', 'Pop_80s', 'Punk_rock', 'Synth_Pop', 'Classical_instruments', 'Hardcore', 'Latin_pop');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "name" TEXT,
    "producer_name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tag_one" TEXT NOT NULL,
    "tag_two" TEXT NOT NULL,
    "original_file" TEXT,
    "file" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT,
    "genre" "Genre" NOT NULL DEFAULT 'Hip_hop',

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "status" "status" NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IdeaUserLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_producer_name_key" ON "User"("producer_name");

-- CreateIndex
CREATE UNIQUE INDEX "Idea_file_key" ON "Idea"("file");

-- CreateIndex
CREATE UNIQUE INDEX "Idea_slug_key" ON "Idea"("slug");

-- CreateIndex
CREATE INDEX "Idea_userId_idx" ON "Idea"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Contribution_userId_idx" ON "Contribution"("userId");

-- CreateIndex
CREATE INDEX "Contribution_ideaId_idx" ON "Contribution"("ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "_IdeaUserLikes_AB_unique" ON "_IdeaUserLikes"("A", "B");

-- CreateIndex
CREATE INDEX "_IdeaUserLikes_B_index" ON "_IdeaUserLikes"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdeaUserLikes" ADD CONSTRAINT "_IdeaUserLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IdeaUserLikes" ADD CONSTRAINT "_IdeaUserLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

