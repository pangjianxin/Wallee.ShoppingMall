"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, node, ...rest }) {
          const isInline = !(node && (node as any).parent && (node as any).parent.tagName === 'pre');
          if (isInline) {
            return <code className={className}>{children}</code>;
          }
          return (
            <pre className="rounded bg-neutral-900 p-3 overflow-auto text-sm">
              <code className={className} {...rest}>
                {children}
              </code>
            </pre>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}