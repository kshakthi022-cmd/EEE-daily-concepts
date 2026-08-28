import React, { useMemo } from "react";
import katex from "katex";

interface KatexMathProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const KatexMath: React.FC<KatexMathProps> = ({ math, block = false, className = "" }) => {
  const html = useMemo(() => {
    try {
      // Clean up escaped backslashes if needed
      const cleanMath = math.trim();
      return katex.renderToString(cleanMath, {
        displayMode: block,
        throwOnError: false,
        output: "htmlAndMathml",
      });
    } catch (e) {
      console.warn("KaTeX render error:", e);
      return `<span class="text-amber-300 font-mono">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`katex-render ${block ? "block my-2 overflow-x-auto py-1 text-center" : "inline-block align-middle px-1"} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// Component to parse text containing $math$ and $$math$$ delimiters
interface FormattedTextWithMathProps {
  text: string;
  className?: string;
}

export const FormattedTextWithMath: React.FC<FormattedTextWithMathProps> = ({ text, className = "" }) => {
  const parts = useMemo(() => {
    if (!text) return [];

    // Split by block math $$...$$ first, then inline math $...$
    const result: { type: "text" | "inline-math" | "block-math"; content: string }[] = [];
    
    // Regular expression matching $$...$$ or $...$
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = mathRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({
          type: "text",
          content: text.substring(lastIndex, match.index),
        });
      }

      const matchStr = match[0];
      if (matchStr.startsWith("$$") && matchStr.endsWith("$$")) {
        result.push({
          type: "block-math",
          content: matchStr.slice(2, -2),
        });
      } else if (matchStr.startsWith("$") && matchStr.endsWith("$")) {
        result.push({
          type: "inline-math",
          content: matchStr.slice(1, -1),
        });
      }

      lastIndex = match.index + matchStr.length;
    }

    if (lastIndex < text.length) {
      result.push({
        type: "text",
        content: text.substring(lastIndex),
      });
    }

    return result;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === "block-math") {
          return <KatexMath key={index} math={part.content} block={true} />;
        }
        if (part.type === "inline-math") {
          return <KatexMath key={index} math={part.content} block={false} />;
        }
        return <span key={index}>{part.content}</span>;
      })}
    </span>
  );
};
