import { BuildImagePathParams } from "@/lib/interfaces/images";
import { list, del } from "@vercel/blob";
import { put } from '@vercel/blob';

class ImageCRUD {
  constructor() {
  }

  buildImagePath({ moduleCode, courseCode, questionCode, type, filename }: BuildImagePathParams): string {
    return `images/${moduleCode}/${courseCode}/${questionCode}/${type}/${filename}`;
  }

  async createImage(filename: string, body: ReadableStream): Promise<{ url: string }> {
    try {
      const blob = await put(filename, body, {
        access: 'public',
      });
      return { url: blob.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  async getImage(filename: string): Promise<{url: string}> {
    try {
      const { blobs } = await list({
        prefix: filename,
        limit: 1,
      });
      
      if (blobs.length === 0) {
        throw new Error('Image not found');
      }
      
      return { url: blobs[0].url };
    } catch (error) {
      console.error('Error getting image:', error);
      throw new Error('Failed to get image');
    }
  }

  async deleteImage(url: string): Promise<void> {
    try {
      await del(url);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  async listImages(prefix?: string, limit: number = 100): Promise<Array<{ url: string; pathname: string; size: number; uploadedAt: Date }>> {
    try {
      const { blobs } = await list({
        prefix: prefix || '',
        limit,
      });
      
      return blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }));
    } catch (error) {
      console.error('Error listing images:', error);
      throw new Error('Failed to list images');
    }
  }
}

export const imageCRUD = new ImageCRUD();