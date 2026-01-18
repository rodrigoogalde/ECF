export interface CreateImageProps {
  filename: string;
  body: ReadableStream;
}

export interface GetImageProps {
  filename: string;
}

export interface DeleteImageProps {
  url: string;
}

export interface ListImagesProps {
  prefix?: string;
  limit?: number;
}

export type ImageType = 'question' | 'option' | 'solution';

export interface BuildImagePathParams {
  moduleCode: string;
  courseCode: string;
  questionCode: string;
  type: ImageType;
  filename: string;
}
