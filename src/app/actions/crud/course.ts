import { Course, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";

class CourseCRUD extends BaseCRUD<Course, Prisma.CourseCreateInput, Prisma.CourseUpdateInput> {
  constructor() {
    super('Course', prisma.course);
  }

  async getAll(whereConditions?: Prisma.CourseWhereInput, options?: QueryOptions): Promise<Course[]> {
    return await super.getAll(
      whereConditions,
      options
    );
  }
}

export const courseCRUD = new CourseCRUD();