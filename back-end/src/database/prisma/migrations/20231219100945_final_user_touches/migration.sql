/*
  Warnings:

  - You are about to drop the column `UnreadNotifications` on the `user` table. All the data in the column will be lost.
  - Added the required column `unreadNotifications` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "UnreadNotifications",
ADD COLUMN     "activeRefreshToken" TEXT,
ADD COLUMN     "unreadNotifications" JSONB NOT NULL,
ALTER COLUMN "TFASecret" DROP NOT NULL;
