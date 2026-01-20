import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SyllabusSection {
  name: string;
  courses: {
    topic: string;
    course: string;
    contents: string[];
    indicators: string[];
  }[];
}

interface QuestionData {
  section: string;
  course: string;
  type: string;
  period: string;
  questions: {
    id: number;
    title: string;
    code: string;
    content: string;
    image?: string;
    options?: {
      label: string;
      text: string;
      image?: string;
    }[];
    answer?: string;
    solution?: string;
  }[];
}

interface UploadImageParams {
  localPath: string;
  sectionCode: string;
  courseCode: string;
  questionCode: string;
  type: 'question' | 'option' | 'solution';
}

function buildImagePath(
  sectionCode: string,
  courseCode: string,
  questionCode: string,
  type: 'question' | 'option' | 'solution',
  filename: string
): string {
  return `images/${sectionCode}/${courseCode}/${questionCode}/${type}/${filename}`;
}

async function uploadImage({
  localPath,
  sectionCode,
  courseCode,
  questionCode,
  type,
}: UploadImageParams): Promise<string | null> {
  try {
    const fullPath = path.join(__dirname, '..', 'data', localPath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`    ⚠️  Image not found: ${fullPath}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(localPath);
    const remotePath = buildImagePath(sectionCode, courseCode, questionCode, type, fileName);
    
    console.log(`    📤 Uploading image: ${fileName} -> ${remotePath}`);
    
    const blob = await put(remotePath, fileBuffer, {
      access: 'public',
      allowOverwrite: true,
    });
    
    console.log(`    ✅ Uploaded: ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error(`    ❌ Error uploading image ${localPath}:`, error);
    return null;
  }
}

async function main() {
  console.log('🌱 Starting seed...');

  const syllabusPath = path.join(__dirname, '..', 'data', 'syllabus.json');
  const questionsPath = path.join(__dirname, '..', 'data', 'questions', 'questions.json');

  const syllabusData: { sections: SyllabusSection[] } = JSON.parse(
    fs.readFileSync(syllabusPath, 'utf-8')
  );
  const questionsData: QuestionData[] = JSON.parse(
    fs.readFileSync(questionsPath, 'utf-8')
  );

  console.log('📚 Loading syllabus data...');

  for (const [index, sectionData] of syllabusData.sections.entries()) {
    const sectionCode = `M${index + 1}`;
    
    console.log(`  Creating section: ${sectionCode} - ${sectionData.name}`);
    
    await prisma.section.upsert({
      where: { code: sectionCode },
      update: { name: sectionData.name },
      create: {
        code: sectionCode,
        name: sectionData.name,
      },
    });

    for (const courseData of sectionData.courses) {
      console.log(`    Creating course: ${courseData.course} - ${courseData.topic}`);
      
      await prisma.course.upsert({
        where: { code: courseData.course },
        update: {
          topic: courseData.topic,
          contents: courseData.contents,
          indicators: courseData.indicators,
          sectionCode: sectionCode,
        },
        create: {
          code: courseData.course,
          topic: courseData.topic,
          contents: courseData.contents,
          indicators: courseData.indicators,
          sectionCode: sectionCode,
        },
      });
    }
  }

  console.log('❓ Loading questions data...');

  for (const questionSet of questionsData) {
    const courseCode = questionSet.course;
    
    const courseExists = await prisma.course.findUnique({
      where: { code: courseCode },
      include: { section: true },
    });

    if (!courseExists) {
      console.warn(`  ⚠️  Course ${courseCode} not found, skipping questions`);
      continue;
    }

    const sectionCode = courseExists.sectionCode;
    console.log(`  Loading questions for course: ${courseCode}`);

    for (const q of questionSet.questions) {
      console.log(`    Creating question: ${q.code}`);
      
      const imageUrls: string[] = [];
      if (q.image) {
        const uploadedUrl = await uploadImage({
          localPath: q.image,
          sectionCode,
          courseCode,
          questionCode: q.code,
          type: 'question',
        });
        if (uploadedUrl) {
          imageUrls.push(uploadedUrl);
        }
      }

      // format id to be 'nn' 1 -> 01, 10 -> 10, 100 -> 100
      const title = `${questionSet.period.replace('-', '')}${q.id.toString().padStart(2, '0')} - ${q.title}`;

      await prisma.question.upsert({
        where: { uniqueCode: q.code },
        update: {
          title: title,
          content: q.content,
          period: questionSet.period,
          type: questionSet.type,
          solution: q.solution || null,
          imageUrl: imageUrls,
          correctLabel: q.answer || null,
          courseCode: courseCode,
        },
        create: {
          uniqueCode: q.code,
          title: title,
          content: q.content,
          period: questionSet.period,
          type: questionSet.type,
          solution: q.solution || null,
          imageUrl: imageUrls,
          correctLabel: q.answer || null,
          courseCode: courseCode,
        },
      });

      if (q.options && q.options.length > 0) {
        await prisma.option.deleteMany({
          where: { questionCode: q.code },
        });

        for (const opt of q.options) {
          const optionImageUrls: string[] = [];
          if (opt.image) {
            const uploadedUrl = await uploadImage({
              localPath: opt.image,
              sectionCode,
              courseCode,
              questionCode: q.code,
              type: 'option',
            });
            if (uploadedUrl) {
              optionImageUrls.push(uploadedUrl);
            }
          }

          await prisma.option.create({
            data: {
              label: opt.label,
              text: opt.text,
              imageUrl: optionImageUrls,
              questionCode: q.code,
            },
          });
        }
      }
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
