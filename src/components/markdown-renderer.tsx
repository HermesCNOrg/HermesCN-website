import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function withoutFrontmatter(markdown: string) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

export function MarkdownRenderer({
  className = "",
  content,
}: {
  className?: string;
  content: string;
}) {
  return (
    <div
      className={`space-y-4 text-base leading-8 text-[#0000f2]/72 ${className}`}
    >
      <ReactMarkdown
        components={{
          a: ({ children, ...props }) => (
            <a
              {...props}
              className="underline underline-offset-4 hover:text-[#0000f2]"
              rel="noreferrer"
              target="_blank"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#0000f2]/30 pl-4 text-[#0000f2]/62">
              {children}
            </blockquote>
          ),
          code: ({ children, className: codeClassName, ...props }) => (
            <code
              {...props}
              className={`${codeClassName ?? ""} bg-[#0000f2]/6 px-1.5 py-0.5 text-[0.9em]`}
            >
              {children}
            </code>
          ),
          h1: ({ children }) => (
            <h1 className="mt-10 text-3xl leading-tight text-[#0000f2]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 border-t border-[#0000f2]/15 pt-8 text-2xl leading-tight text-[#0000f2]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 text-xl leading-tight text-[#0000f2]">
              {children}
            </h3>
          ),
          hr: () => <hr className="my-8 border-[#0000f2]/15" />,
          li: ({ children }) => <li className="my-1 pl-1">{children}</li>,
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-6">{children}</ol>
          ),
          p: ({ children }) => <p>{children}</p>,
          pre: ({ children }) => (
            <pre className="overflow-x-auto border border-[#0000f2]/15 bg-[#0000f2]/4 p-4 text-sm leading-6 [&_code]:bg-transparent [&_code]:p-0">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          td: ({ children }) => (
            <td className="border border-[#0000f2]/15 px-3 py-2 align-top">
              {children}
            </td>
          ),
          th: ({ children }) => (
            <th className="border border-[#0000f2]/20 px-3 py-2 text-left font-medium text-[#0000f2]">
              {children}
            </th>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-6">{children}</ul>
          ),
        }}
        remarkPlugins={[remarkGfm]}
      >
        {withoutFrontmatter(content)}
      </ReactMarkdown>
    </div>
  );
}
