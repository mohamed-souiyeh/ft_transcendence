/*
  Warnings:

  - You are about to drop the column `modiratorIds` on the `channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "channel" DROP COLUMN "modiratorIds";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "loses" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "achievement_name_key" ON "achievement"("name");
