'use server';

import { userCRUD } from "../crud/user";
import { User, Prisma } from "@prisma/client";

export async function getAllUsers(): Promise<User[]> {
    return await userCRUD.getAll();
}

export async function createUser(data: Prisma.UserCreateInput): Promise<User | null> {
    return await userCRUD.create(data);
}

export async function updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    return await userCRUD.update(id, data);
}