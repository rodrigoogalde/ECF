'use server';

import { optionCRUD } from "../crud/option";
import { optionSchema } from "@/lib/validations/option";
import { Prisma } from "@prisma/client";

export async function getAllOptions(filters?: Prisma.OptionWhereInput) {
  return await optionCRUD.getAll(filters);
}

export async function getOptionById(id: number) {
  return await optionCRUD.getOne({ id });
}

export async function getOptionsByQuestionCode(questionCode: string) {
  return await optionCRUD.getAll({ questionCode });
}

export async function createOption(data: unknown) {
  const validatedData = optionSchema.parse(data);
  
  return await optionCRUD.create({
    label: validatedData.label,
    text: validatedData.text,
    imageUrl: validatedData.imageUrl,
    question: {
      connect: { uniqueCode: validatedData.questionCode }
    }
  });
}

export async function updateOption(id: number, data: unknown) {
  const validatedData = optionSchema.partial().parse(data);
  
  const updateData: Prisma.OptionUpdateInput = {
    ...(validatedData.label && { label: validatedData.label }),
    ...(validatedData.text && { text: validatedData.text }),
    ...(validatedData.imageUrl && { imageUrl: validatedData.imageUrl }),
    ...(validatedData.questionCode && { 
      question: { connect: { uniqueCode: validatedData.questionCode } }
    })
  };
  
  return await optionCRUD.update(id.toString(), updateData);
}

export async function deleteOption(id: number, isSoft: boolean = true) {
  return await optionCRUD.delete(id.toString(), isSoft);
}
