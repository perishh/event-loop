/*
  Warnings:

  - A unique constraint covering the columns `[afm]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `afm` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "afm" TEXT NOT NULL,
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_afm_key" ON "user"("afm");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");
