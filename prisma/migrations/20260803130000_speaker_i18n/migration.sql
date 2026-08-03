-- AlterTable
ALTER TABLE "Speaker" ADD COLUMN "nameKk" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "nameRu" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "roleKk" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "roleRu" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "roleEn" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "organizationKk" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "organizationRu" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "organizationEn" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "bioKk" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "bioRu" TEXT;
ALTER TABLE "Speaker" ADD COLUMN "bioEn" TEXT;

-- Backfill existing rows into all locales
UPDATE "Speaker"
SET
  "nameKk" = "name",
  "nameRu" = "name",
  "nameEn" = "name",
  "roleKk" = "role",
  "roleRu" = "role",
  "roleEn" = "role",
  "organizationKk" = "organization",
  "organizationRu" = "organization",
  "organizationEn" = "organization",
  "bioKk" = "bio",
  "bioRu" = "bio",
  "bioEn" = "bio";

-- Enforce NOT NULL on required fields
ALTER TABLE "Speaker" ALTER COLUMN "nameKk" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "nameRu" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "nameEn" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "roleKk" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "roleRu" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "roleEn" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "organizationKk" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "organizationRu" SET NOT NULL;
ALTER TABLE "Speaker" ALTER COLUMN "organizationEn" SET NOT NULL;

-- DropTable columns
ALTER TABLE "Speaker" DROP COLUMN "name";
ALTER TABLE "Speaker" DROP COLUMN "role";
ALTER TABLE "Speaker" DROP COLUMN "organization";
ALTER TABLE "Speaker" DROP COLUMN "bio";
