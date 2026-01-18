'use server';

import { sectionCRUD } from "../crud/section";
import { SectionWithCourses } from "@/lib/interfaces/section";

export async function getAllSections(): Promise<SectionWithCourses[]> {
    return await sectionCRUD.getAll();
}
