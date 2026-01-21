import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-2 mb-4" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-8 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-2" {...props} />
  ),
  h4: (props) => (
    <h4 className="text-lg font-medium text-slate-900 dark:text-white mt-4 mb-2" {...props} />
  ),
  p: (props) => (
    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-inside space-y-1 mb-4 text-slate-700 dark:text-slate-300 ml-4" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-inside space-y-1 mb-4 text-slate-700 dark:text-slate-300 ml-4" {...props} />
  ),
  li: (props) => (
    <li className="text-slate-700 dark:text-slate-300" {...props} />
  ),
  a: (props) => {
    const href = props.href || '';
    if (href.startsWith('/')) {
      return <Link href={href} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" {...props} />;
    }
    return <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />;
  },
  blockquote: (props) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-600 dark:text-slate-400 my-4" {...props} />
  ),
  code: (props) => (
    <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800 dark:text-slate-200" {...props} />
  ),
  pre: (props) => (
    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm" {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800" {...props} />
  ),
  td: (props) => (
    <td className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700" {...props} />
  ),
  hr: () => <hr className="my-8 border-slate-200 dark:border-slate-700" />,
  strong: (props) => (
    <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
  ),
  em: (props) => (
    <em className="italic" {...props} />
  ),
};
