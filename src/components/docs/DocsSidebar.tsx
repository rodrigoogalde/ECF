'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Course {
  code: string;
  name: string;
  slug: string;
}

interface Section {
  code: string;
  name: string;
  courses: Course[];
}

interface DocsSidebarProps {
  sections: Section[];
  currentTopics?: { title: string; slug: string[] }[];
}

export function DocsSidebar({ sections, currentTopics = [] }: DocsSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.map(s => s.code)
  );

  const toggleSection = (code: string) => {
    setExpandedSections(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <nav className="sticky top-20 space-y-1 pr-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        {sections.map((section) => (
          <div key={section.code} className="mb-4">
            <button
              onClick={() => toggleSection(section.code)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                {section.code}
              </span>
              {expandedSections.includes(section.code) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {expandedSections.includes(section.code) && (
              <div className="ml-4 mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-2">
                {section.courses.map((course) => {
                  const href = `/docs/${section.code}/${course.slug}`;
                  const isActive = pathname.startsWith(href);

                  return (
                    <Link
                      key={course.code}
                      href={href}
                      className={cn(
                        "block px-2 py-1.5 text-sm rounded-md transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {course.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {currentTopics.length > 0 && (
          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
              En esta página
            </p>
            <div className="space-y-0.5">
              {currentTopics.map((topic) => {
                const href = `/docs/${topic.slug.join('/')}`;
                const isActive = pathname === href;

                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "block px-2 py-1 text-sm rounded-md transition-colors",
                      isActive
                        ? "text-blue-700 dark:text-blue-300 font-medium"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {topic.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
