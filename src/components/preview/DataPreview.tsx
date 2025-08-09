
import { useEffect, useRef } from 'react';
import { OutputFormat } from '../../types/schema';

interface DataPreviewProps {
  data: string;
  format: OutputFormat;
}

export function DataPreview({ data }: DataPreviewProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = 0;
    }
  }, [data]);

  return (
    <div className="relative">
      <pre
        ref={preRef}
        className="bg-gray-50 p-4 rounded overflow-auto max-h-[600px] text-sm"
      >
        <code>{data}</code>
      </pre>
    </div>
  );
}
