import { Prisma } from "@prisma/client";

export type SectionWithCourses = Prisma.SectionGetPayload<{ 
  include: { 
    courses: true 
  } 
}>
