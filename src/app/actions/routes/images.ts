"use server";

import { imageCRUD } from "../crud/image";
import { CreateImageProps, GetImageProps, DeleteImageProps, ListImagesProps, BuildImagePathParams } from "@/lib/interfaces/images";

export async function createImage({ filename, body }: CreateImageProps): Promise<{ url: string }> {
  return await imageCRUD.createImage(filename, body);
}

export async function getImage({ filename }: GetImageProps): Promise<{ url: string }> {
  return await imageCRUD.getImage(filename);
}

export async function deleteImage({ url }: DeleteImageProps): Promise<void> {
  await imageCRUD.deleteImage(url);
}

export async function listImages({ prefix, limit = 100 }: ListImagesProps = {}): Promise<Array<{ url: string; pathname: string; size: number; uploadedAt: Date }>> {
  return await imageCRUD.listImages(prefix, limit);
}

export function buildImagePath(params: BuildImagePathParams): string {
  return imageCRUD.buildImagePath(params);
}
