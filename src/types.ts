export interface Shot {
  shotNumber: number;
  sceneHeading: string;
  shotType: string;
  cameraAngle: string;
  cameraMovement: string;
  lens: string;
  subject: string;
  action: string;
  lighting: string;
  colorPalette: string;
  mood: string;
  duration: string;
  transition: string;
  aiVideoPrompt: string;
  notes: string;
  imageUrl?: string; // generated on demand
}

export interface ShotListResult {
  title: string;
  genre: string;
  mood: string;
  totalShots: number;
  shots: Shot[];
}

export interface HistoryEntry {
  id: string;
  createdAt: number;
  storyInput: string;
  genre: string;
  style: string;
  result: ShotListResult;
}

export type Genre =
  | 'Drama'
  | 'Action'
  | 'Romance'
  | 'Horror'
  | 'Comedy'
  | 'Documentary'
  | 'Thriller'
  | 'Sci-Fi'
  | 'Ad / Commercial'
  | 'Reels / Short';

export type Style =
  | 'Cinematic'
  | 'Indie Film'
  | 'Noir'
  | 'Documentary'
  | 'Music Video'
  | 'Social Media'
  | 'Anime / Animation'
  | 'Horror';

export type GenerationStatus = 'idle' | 'generating' | 'done' | 'error';
