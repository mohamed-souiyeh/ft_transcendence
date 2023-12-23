/*
  Warnings:

  - You are about to drop the column `conversationId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `convNotificationData` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the column `unreadNotifications` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `userState` table. All the data in the column will be lost.
  - You are about to drop the column `info` on the `userState` table. All the data in the column will be lost.
  - You are about to drop the `_bannedUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_conversationTouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `conversation` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `receiverId` on table `notification` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `channelId` to the `userState` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('public', 'protected', 'private');

-- AlterEnum
ALTER TYPE "UserState" ADD VALUE 'banned';

-- DropForeignKey
ALTER TABLE "_bannedUsers" DROP CONSTRAINT "_bannedUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_bannedUsers" DROP CONSTRAINT "_bannedUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_conversationTouser" DROP CONSTRAINT "_conversationTouser_A_fkey";

-- DropForeignKey
ALTER TABLE "_conversationTouser" DROP CONSTRAINT "_conversationTouser_B_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "userState" DROP CONSTRAINT "userState_conversationId_fkey";

-- DropIndex
DROP INDEX "notification_conversationId_key";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "conversationId",
ADD COLUMN     "channelId" INTEGER,
ADD COLUMN     "dmId" INTEGER;

-- AlterTable
ALTER TABLE "notification" DROP COLUMN "convNotificationData",
DROP COLUMN "conversationId",
DROP COLUMN "type",
ALTER COLUMN "receiverId" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "unreadNotifications",
ADD COLUMN     "friendRequests" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isProfileSetup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "machesPlayed" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "TFAisEnabled" SET DEFAULT false;

-- AlterTable
ALTER TABLE "userState" DROP COLUMN "conversationId",
DROP COLUMN "info",
ADD COLUMN     "channelId" INTEGER NOT NULL,
ADD COLUMN     "untile" TIMESTAMP(3);

-- DropTable
DROP TABLE "_bannedUsers";

-- DropTable
DROP TABLE "_conversationTouser";

-- DropTable
DROP TABLE "conversation";

-- DropEnum
DROP TYPE "ConversationState";

-- DropEnum
DROP TYPE "ConversationType";

-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "type" "ChannelType" NOT NULL,
    "channelName" TEXT NOT NULL,
    "channelImage" TEXT NOT NULL,
    "channelDescription" TEXT NOT NULL,
    "channelPassword" TEXT,
    "ownerId" INTEGER NOT NULL,
    "modiratorIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dm" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_channelTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_dmTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_achievementTouser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_channelTouser_AB_unique" ON "_channelTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_channelTouser_B_index" ON "_channelTouser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_dmTouser_AB_unique" ON "_dmTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_dmTouser_B_index" ON "_dmTouser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_achievementTouser_AB_unique" ON "_achievementTouser"("A", "B");

-- CreateIndex
CREATE INDEX "_achievementTouser_B_index" ON "_achievementTouser"("B");

-- AddForeignKey
ALTER TABLE "userState" ADD CONSTRAINT "userState_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_dmId_fkey" FOREIGN KEY ("dmId") REFERENCES "dm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelTouser" ADD CONSTRAINT "_channelTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_channelTouser" ADD CONSTRAINT "_channelTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dmTouser" ADD CONSTRAINT "_dmTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "dm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dmTouser" ADD CONSTRAINT "_dmTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_achievementTouser" ADD CONSTRAINT "_achievementTouser_A_fkey" FOREIGN KEY ("A") REFERENCES "achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_achievementTouser" ADD CONSTRAINT "_achievementTouser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
