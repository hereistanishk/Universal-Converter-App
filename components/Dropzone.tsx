import React, { useState, useRef } from 'react';
import { CloudUpload, Files, CheckCircle } from 'lucide-react';
import { FileMetadata } from '../types';

interface DropzoneProps {
  onFilesSelect: (files: FileMetadata[]) => void;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList) => {
    if (disabled) return;
    const filesArray: FileMetadata[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      filesArray.push({
        name: f.name,
        size: f.size,
        type: f.type,
        lastModified: f.lastModified,
        blob: f
      });
    }
    if (filesArray.length > 0) {
      onFilesSelect(filesArray);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative group w-full h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-300
        ${isDragging ? 'bg-blue-600/[0.04]' : 'hover:bg-white/[0.02]'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      
      <div className="mb-8 relative">
        <div className={`
          w-24 h-24 rounded-3xl border-[0.5px] transition-all duration-300 flex items-center justify-center
          ${isDragging 
            ? 'bg-blue-600 border-blue-400 scale-110 shadow-lg shadow-blue-900/20' 
            : 'bg-slate-800 border-white/10 group-hover:border-blue-500/50 group-hover:bg-slate-700'}
        `}>
          <CloudUpload className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
        </div>
        {!isDragging && (
           <div className="absolute inset-0 rounded-3xl border border-blue-500/20 animate-pulse" />
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">Upload Files</h3>
        <p className="text-sm text-slate-400 max-w-[200px]">
          Click or drag your media here to get started.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-3 text-xs font-semibold text-slate-500">
        <CheckCircle className="w-4 h-4 text-emerald-500/50" />
        Runs privately in your browser
      </div>
    </div>
  );
};