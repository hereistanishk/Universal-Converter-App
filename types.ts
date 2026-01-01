export enum AppState {
  IDLE = 'IDLE',
  SELECTION = 'SELECTION',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  blob: Blob;
}

export type ConversionCategory = 'video' | 'audio' | 'image' | 'other';

export type ConversionFormat = 'mp4' | 'webm' | 'mp3' | 'wav' | 'txt' | 'srt' | 'webp' | 'png' | 'jpg';

export interface ConversionSettings {
  category: ConversionCategory;
  targetFormat: ConversionFormat;
  resolution?: '720p' | '1080p' | '4K';
  quality?: 'Small File' | 'Balanced' | 'High Quality';
  imageQuality?: 'Good' | 'Great' | 'Best';
  bitrate?: '128kbps' | '192kbps' | '320kbps';
  isTranscription?: boolean;
}

export interface ProcessingProgress {
  percentage: number;
  step: string;
}