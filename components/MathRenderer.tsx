"use client";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export function MathRenderer({
  content,
  className = "",
  inline = false,
}: MathRendererProps) {
  const Wrapper = inline ? "span" : "div";

  return (
    <Wrapper className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={
          inline
            ? {
                p: ({ children }) => <span>{children}</span>,
              }
            : undefined
        }
      >
        {content}
      </ReactMarkdown>
    </Wrapper>
  );
}
