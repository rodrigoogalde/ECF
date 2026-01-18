-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ESTUDIANTE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'ESTUDIANTE';
