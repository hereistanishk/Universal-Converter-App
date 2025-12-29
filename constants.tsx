
export const INITIAL_CREDITS = 50;
export const COST_CONVERSION = 1;
export const COST_TRANSCRIPTION = 5;

export const SUPPORTED_FORMATS = {
  video: ['mp4', 'webm', 'mov', 'avi'],
  audio: ['mp3', 'wav', 'ogg', 'm4a'],
  image: ['png', 'jpg', 'webp']
};

export const TARGET_OPTIONS = [
  { id: 'mp4', label: 'MP4 Video', category: 'video' },
  { id: 'webm', label: 'WebM Video', category: 'video' },
  { id: 'mp3', label: 'MP3 Audio', category: 'audio' },
  { id: 'wav', label: 'WAV Audio', category: 'audio' },
  { id: 'txt', label: 'AI Transcription (TXT)', category: 'ai' },
  { id: 'srt', label: 'AI Subtitles (SRT)', category: 'ai' }
];
