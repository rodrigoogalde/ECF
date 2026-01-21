import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_PATH = path.join(process.cwd(), 'content/docs');

export interface DocMeta {
  title: string;
  description: string;
  section: string;
  course: string;
  order?: number;
  slug: string[];
}

export interface DocContent {
  meta: DocMeta;
  content: string;
}

export function getDocBySlug(slug: string[]): DocContent | null {
  const filePath = path.join(CONTENT_PATH, ...slug);
  
  // Try exact file match first
  let fullPath = `${filePath}.mdx`;
  
  // If not found, try index.mdx in directory
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(filePath, 'index.mdx');
  }
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    meta: {
      title: data.title || '',
      description: data.description || '',
      section: data.section || '',
      course: data.course || '',
      order: data.order,
      slug,
    },
    content,
  };
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = [];
  
  function walkDir(dir: string, currentSlug: string[] = []) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath, [...currentSlug, file]);
      } else if (file.endsWith('.mdx')) {
        const name = file.replace('.mdx', '');
        if (name === 'index') {
          slugs.push(currentSlug);
        } else {
          slugs.push([...currentSlug, name]);
        }
      }
    }
  }
  
  if (fs.existsSync(CONTENT_PATH)) {
    walkDir(CONTENT_PATH);
  }
  
  return slugs;
}

export function getDocsNavigation() {
  const configPath = path.join(CONTENT_PATH, 'config.json');
  if (!fs.existsSync(configPath)) {
    return { sections: [] };
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config;
}

export function getDocsByCourse(section: string, course: string): DocMeta[] {
  const docs: DocMeta[] = [];
  const coursePath = path.join(CONTENT_PATH, section, course);
  
  if (!fs.existsSync(coursePath)) {
    return docs;
  }
  
  const files = fs.readdirSync(coursePath);
  
  for (const file of files) {
    if (file.endsWith('.mdx') && file !== 'index.mdx') {
      const filePath = path.join(coursePath, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      docs.push({
        title: data.title || '',
        description: data.description || '',
        section: data.section || section,
        course: data.course || course,
        order: data.order,
        slug: [section, course, file.replace('.mdx', '')],
      });
    }
  }
  
  return docs.sort((a, b) => (a.order || 0) - (b.order || 0));
}
