'use server';

import { userCRUD } from "../crud/user";
import { User } from "@prisma/client";

export async function getAllUsers(): Promise<User[]> {
    return await userCRUD.getAll();
}
