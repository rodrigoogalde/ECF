'use server';

import { courseCRUD } from "../crud/course";

export async function getAllCourses() {
    return await courseCRUD.getAll();
}