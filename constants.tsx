export const INITIAL_CREDITS = 50;
export const COST_CONVERSION = 1;
export const COST_TRANSCRIPTION = 5;

export const SUPPORTED_FORMATS = {
  video: ['mp4', 'webm', 'mov', 'avi'],
  audio: ['mp3', 'wav', 'ogg', 'm4a'],
  image: ['png', 'jpg', 'webp']
};

export const TARGET_OPTIONS = [
  // Video Tier (Essential for distribution)
  { id: 'mp4', label: 'Universal H.264', category: 'Video', description: 'Universal compatibility, high efficiency.' },
  { id: 'webm', label: 'Web Streamer', category: 'Video', description: 'Open-source, web-optimized VP9.' },
  
  // Audio Tier (Lossless & Lossy)
  { id: 'mp3', label: 'High-Fidelity MP3', category: 'Audio', description: '320kbps industry standard.' },
  { id: 'wav', label: 'Uncompressed WAV', category: 'Audio', description: 'Lossless studio master quality.' },
  
  // Image Tier (Modern Codecs)
  { id: 'webp', label: 'Modern WebP', category: 'Image', description: 'Next-gen compression for the web.' },
  { id: 'png', label: 'Alpha PNG', category: 'Image', description: 'Lossless with transparency support.' },
  
  // Intelligence Tier (Transformers.js)
  { id: 'txt', label: 'Raw Transcript', category: 'Intelligence', description: 'Speech-to-text via Local Whisper.' },
  { id: 'srt', label: 'Timed Subtitles', category: 'Intelligence', description: 'SRT generated via AI synthesis.' }
];