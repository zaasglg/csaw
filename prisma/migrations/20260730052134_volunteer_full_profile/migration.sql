/*
  Warnings:

  - You are about to drop the column `fullName` on the `Volunteer` table. All the data in the column will be lost.
  - Added the required column `badgeName` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizenship` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Volunteer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surname` to the `Volunteer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Volunteer" DROP COLUMN "fullName",
ADD COLUMN     "badgeName" TEXT NOT NULL,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "citizenship" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "infoLanguage" TEXT,
ADD COLUMN     "patronymic" TEXT,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "surname" TEXT NOT NULL;
