import { Prisma } from "@prisma/client";

export type ModuleWithCourses = Prisma.ModuleGetPayload<{ 
  include: { 
    courses: true 
  } 
}>