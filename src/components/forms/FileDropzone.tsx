'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon } from '@heroicons/react/24/outline';
import yaml from 'js-yaml';

interface FileDropzoneProps {
  onFileParsed: (data: unknown) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileParsed }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null); // Clear previous errors
    if (acceptedFiles.length === 0) {
      setError('JSONまたはYAMLファイルのみをドロップしてください。');
      return;
    }

    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        let parsedData: unknown;

        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(content);
        } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
          parsedData = yaml.load(content);
        } else {
          setError('サポートされていないファイル形式です。JSONまたはYAMLファイルのみが許可されています。');
          return;
        }
        onFileParsed(parsedData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(`ファイルの解析中にエラーが発生しました: ${e.message}`);
        } else {
          setError('ファイルの解析中に不明なエラーが発生しました。');
        }
      }
    };

    reader.onerror = () => {
      setError('ファイルの読み込み中にエラーが発生しました。');
    };

    reader.readAsText(file);
  }, [onFileParsed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/yaml': ['.yaml', '.yml'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
      `}
    >
      <input {...getInputProps()} />
      <DocumentIcon className="h-10 w-10 text-gray-400" />
      {isDragActive ? (
        <p className="mt-2 text-sm text-blue-600">ここにファイルをドロップしてください...</p>
      ) : (
        <p className="mt-2 text-sm text-gray-600">
          JSONまたはYAMLファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください。
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FileDropzone;
