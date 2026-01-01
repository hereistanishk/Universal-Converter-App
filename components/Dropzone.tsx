import React, { useState, useRef } from 'react';
import { ArrowUp, Files, ShieldCheck, Box } from 'lucide-react';
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
        relative group w-full h-full flex flex-col items-center justify-center p-12 transition-all duration-500
        ${isDragging ? 'bg-blue-600/[0.02]' : 'hover:bg-white/[0.01]'}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
      
      {/* Visual Center - Hierarchy 1 */}
      <div className="relative mb-12">
        <div className={`
          w-32 h-32 rounded-[24px] surgical-border transition-all duration-500 flex items-center justify-center
          ${isDragging 
            ? 'bg-blue-600 border-blue-400/50 scale-105 shadow-[0_0_50px_-10px_rgba(59,130,246,0.3)]' 
            : 'bg-white/5 group-hover:bg-blue-500/10 group-hover:border-blue-500/30'}
        `}>
          <ArrowUp className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-slate-700 group-hover:text-blue-500'} transition-colors duration-300`} strokeWidth={1.5} />
        </div>
        
        {/* Pulse effect */}
        {!isDragging && (
           <div className="absolute inset-0 rounded-[24px] border border-blue-500/10 pulse-ring pointer-events-none" />
        )}
      </div>

      <div className="text-center space-y-4 max-w-xs">
        <div className="space-y-1">
          <h3 className="text-xl font-black uppercase tracking-[0.4em] text-white italic transition-all group-hover:tracking-[0.5em]">
            Ingest
          </h3>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em] opacity-80 group-hover:opacity-100">
            Push objects to the local core
          </p>
        </div>

        <div className="pt-6 flex items-center justify-center gap-4 opacity-20">
          <div className="h-[0.5px] w-8 bg-slate-800" />
          <Box className="w-3 h-3 text-slate-500" />
          <div className="h-[0.5px] w-8 bg-slate-800" />
        </div>
      </div>

      {/* Security Signal - Minimal Anchor */}
      <div className="absolute bottom-8 left-8 flex items-center gap-3 text-[8px] font-black text-slate-800 uppercase tracking-[0.4em]">
        <ShieldCheck className="w-3 h-3 text-emerald-500/30" />
        Local Node Encrypted
      </div>

      {/* Meta Anchor */}
      <div className="absolute bottom-8 right-8 text-[8px] font-black text-slate-800 uppercase tracking-[0.3em]">
        Buffer Limit: 2GB
      </div>
    </div>
  );
};