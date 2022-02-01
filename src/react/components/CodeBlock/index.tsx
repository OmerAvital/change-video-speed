import React, { FC, ReactChildren, useRef } from 'react';
import CopyBtn from './CopyBtn';

export interface CodeBlockProps {
  children: ReactChildren | string;
}

const CodeBlock: FC<CodeBlockProps> = ({ children }: CodeBlockProps) => {
  const preRef = useRef<HTMLPreElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative p-2 mt-2 rounded bg-zinc-100 border select-text
                  dark:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-600"
      ref={parentRef}
    >
      <CopyBtn
        parent={parentRef}
        className="absolute top-1.5 right-2"
        content={preRef?.current?.textContent ?? ''}
      />
      <pre ref={preRef}>
        <code>{children}</code>
      </pre>
    </div>
  );
};
export default CodeBlock;
