import { Section, Prisma } from "@prisma/client";
import { BaseCRUD, QueryOptions } from "./base";
import { prisma } from "@/lib/prisma";
import { SectionWithCourses } from "@/lib/interfaces/section";

class SectionCRUD extends BaseCRUD<Section, Prisma.SectionCreateInput, Prisma.SectionUpdateInput> {
  constructor() {
    super('Section', prisma.section);
  }

  async getAll(whereConditions?: Prisma.SectionWhereInput, options?: QueryOptions): Promise<SectionWithCourses[]> {
    const mergedOptions: QueryOptions = {
      ...options,
      include: {
        ...options?.include,
        courses: true
      }
    };

    return await super.getAll(
      whereConditions,
      mergedOptions
    ) as SectionWithCourses[];
  }
}

export const sectionCRUD = new SectionCRUD();
