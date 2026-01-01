import { ConversionCategory, ConversionFormat } from './types';

export const INITIAL_CREDITS = 50;
export const COST_CONVERSION = 1;
export const COST_TRANSCRIPTION = 5;

export interface CategoryOption {
  id: ConversionCategory;
  label: string;
  description: string;
  icon: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'video', label: 'Video', description: 'MP4, WebM', icon: 'Film' },
  { id: 'audio', label: 'Audio', description: 'MP3, WAV', icon: 'Music' },
  { id: 'image', label: 'Image', description: 'PNG, WebP', icon: 'ImageIcon' },
  { id: 'other', label: 'Text/AI', description: 'Transcripts, SRT', icon: 'Sparkles' },
];

export const FORMAT_MAP: Record<ConversionCategory, { id: ConversionFormat; label: string }[]> = {
  video: [
    { id: 'mp4', label: 'MP4 (H.264)' },
    { id: 'webm', label: 'WebM (VP9)' },
  ],
  audio: [
    { id: 'mp3', label: 'MP3' },
    { id: 'wav', label: 'WAV' },
  ],
  image: [
    { id: 'webp', label: 'WebP' },
    { id: 'png', label: 'PNG' },
    { id: 'jpg', label: 'JPG' },
  ],
  other: [
    { id: 'txt', label: 'Transcript' },
    { id: 'srt', label: 'Subtitles' },
  ],
};

export const RESOLUTIONS = ['720p', '1080p', '4K'] as const;
export const QUALITIES = ['Small File', 'Balanced', 'High Quality'] as const;
