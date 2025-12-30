import React, { useState, useRef } from 'react';
import { Upload, FileCode, HardDrive } from 'lucide-react';
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
        relative w-full max-w-2xl mx-auto min-h-[380px] 
        border-2 border-dashed rounded-[12px] 
        flex flex-col items-center justify-center p-12 transition-all duration-300
        ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[1.01]' : 'border-white/10 bg-white/[0.02]'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400 hover:bg-white/[0.04]'}
      `}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      
      <div className={`p-6 rounded-2xl mb-8 ${isDragging ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'bg-slate-800 text-slate-400'} transition-all`}>
        {isDragging ? <FileCode className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
      </div>

      <h3 className="text-2xl font-bold text-white mb-3">
        {isDragging ? 'Initiate Sequence' : 'Ingest Media Asset'}
      </h3>
      <p className="text-slate-400 text-center max-w-sm text-base leading-relaxed">
        Drop high-bitrate video or audio for edge-isolated transformation. No data leaves your machine.
      </p>

      <div className="absolute bottom-8 flex flex-wrap justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> MP4</div>
        <div className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> WEBM</div>
        <div className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> MP3</div>
        <div className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> WAV</div>
        <div className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> SRT</div>
      </div>
    </div>
  );
};