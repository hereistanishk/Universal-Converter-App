
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

export type ConversionFormat = 'mp4' | 'webm' | 'mp3' | 'wav' | 'txt' | 'srt';

export interface ConversionSettings {
  targetFormat: ConversionFormat;
  isTranscription: boolean;
}

export interface ProcessingProgress {
  percentage: number;
  step: string;
}
