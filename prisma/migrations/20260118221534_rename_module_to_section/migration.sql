-- CreateTable
CREATE TABLE "Section" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Course" (
    "code" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "contents" TEXT[],
    "indicators" TEXT[],
    "sectionCode" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "uniqueCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "solution" TEXT,
    "imageUrl" TEXT[],
    "correctLabel" TEXT,
    "courseCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT[],
    "questionCode" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_uniqueCode_key" ON "Question"("uniqueCode");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_sectionCode_fkey" FOREIGN KEY ("sectionCode") REFERENCES "Section"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionCode_fkey" FOREIGN KEY ("questionCode") REFERENCES "Question"("uniqueCode") ON DELETE RESTRICT ON UPDATE CASCADE;
