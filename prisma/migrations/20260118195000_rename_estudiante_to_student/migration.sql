-- First, add the new STUDENT value to the enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'STUDENT';

-- Update all existing ESTUDIANTE values to STUDENT
UPDATE "users" SET "role" = 'STUDENT' WHERE "role" = 'ESTUDIANTE';

-- Remove the old ESTUDIANTE value (PostgreSQL doesn't support removing enum values directly)
-- We need to recreate the enum
ALTER TYPE "UserRole" RENAME TO "UserRole_old";

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT');

ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING ("role"::text::"UserRole");
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STUDENT';

DROP TYPE "UserRole_old";
