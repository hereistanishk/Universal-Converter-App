
import React, { useState, useRef } from 'react';
import { Upload, FileCode, CheckCircle } from 'lucide-react';
import { FileMetadata } from '../types';

interface DropzoneProps {
  onFileSelect: (file: FileMetadata) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (disabled) return;
    onFileSelect({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      blob: file
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`
        relative w-full max-w-2xl mx-auto min-h-[320px] 
        border-2 border-dashed rounded-[12px] 
        flex flex-col items-center justify-center p-8 transition-all duration-300
        ${isDragging ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 bg-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400 hover:shadow-sm'}
      `}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      
      <div className={`p-4 rounded-full mb-6 ${isDragging ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'} transition-colors`}>
        {isDragging ? <FileCode className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {isDragging ? 'Release to Surgical Input' : 'Drop your file here'}
      </h3>
      <p className="text-slate-500 text-center max-w-xs">
        Supports high-bitrate video, audio, and documents for client-side AI processing.
      </p>

      <div className="absolute bottom-6 flex gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
        <span>MP4</span>
        <span>MOV</span>
        <span>MP3</span>
        <span>WAV</span>
        <span>SRT</span>
      </div>
    </div>
  );
};
