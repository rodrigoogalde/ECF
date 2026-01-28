import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { DocsBreadcrumb } from '@/components/docs/DocsBreadcrumb';
import { getDocBySlug, getDocsNavigation, getDocsByCourse, getAllDocSlugs } from '@/lib/mdx';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { mdxComponents } from '@/components/docs/mdx-components';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const navigation = getDocsNavigation();
  
  // Get topics for current course if we're viewing a course index
  let currentTopics: { title: string; slug: string[] }[] = [];
  if (slug.length >= 2) {
    const topics = getDocsByCourse(slug[0], slug[1]);
    currentTopics = topics.map(t => ({
      title: t.title,
      slug: t.slug,
    }));
  }

  // Build breadcrumb items
  const breadcrumbItems = [];
  
  if (slug.length >= 1) {
    const section = navigation.sections.find((s: { code: string }) => s.code === slug[0]);
    if (section) {
      breadcrumbItems.push({
        label: section.code,
        href: `/docs`,
      });
    }
  }
  
  if (slug.length >= 2) {
    const section = navigation.sections.find((s: { code: string }) => s.code === slug[0]);
    if (section) {
      const course = section.courses.find((c: { slug: string }) => c.slug === slug[1]);
      if (course) {
        breadcrumbItems.push({
          label: course.name,
          href: `/docs/${slug[0]}/${slug[1]}`,
        });
      }
    }
  }
  
  if (slug.length >= 3) {
    breadcrumbItems.push({
      label: doc.meta.title,
      href: `/docs/${slug.join('/')}`,
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* KaTeX CSS */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
        crossOrigin="anonymous"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar estático */}
          <aside className="w-64 shrink-0 hidden lg:block">
            <nav className="sticky top-20 space-y-1 pr-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              {navigation.sections.map((section: { code: string; name: string; courses: { code: string; name: string; slug: string }[] }) => (
                <div key={section.code} className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    {section.code}
                  </div>
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-2">
                    {section.courses.map((course: { code: string; name: string; slug: string }) => {
                      const href = `/docs/${section.code}/${course.slug}`;
                      const isCourseActive = slug[0] === section.code && slug[1] === course.slug;
                      
                      // Get topics for this specific course
                      const courseTopics = isCourseActive ? currentTopics : [];
                      
                      return (
                        <div key={course.code}>
                          <Link
                            href={href}
                            className={`block px-2 py-1.5 text-sm rounded-md transition-colors ${
                              isCourseActive
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 font-medium"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            {course.name}
                          </Link>
                          
                          {/* Show topics under the active course */}
                          {courseTopics.length > 0 && (
                            <div className="ml-2 mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-2">
                              {courseTopics.map((topic) => {
                                const topicHref = `/docs/${topic.slug.join('/')}`;
                                const isTopicActive = slug.join('/') === topic.slug.join('/');
                                return (
                                  <Link
                                    key={topicHref}
                                    href={topicHref}
                                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors ${
                                      isTopicActive
                                        ? "text-blue-700 dark:text-blue-300 font-medium"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                    {topic.title}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <article className="flex-1 min-w-0">
            <DocsBreadcrumb items={breadcrumbItems} />
            
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm prose prose-slate dark:prose-invert max-w-none">
              <MDXRemote 
                source={doc.content} 
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm, remarkMath],
                    rehypePlugins: [rehypeKatex],
                  },
                }}
              />
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
