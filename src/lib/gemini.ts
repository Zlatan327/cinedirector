import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Genre, Style } from '../types';

export const DEFAULT_API_KEY = 'AIzaSyAG3bMOHqi_nb8NZRSnDB-yTW3O5Yt_k6Q';

export function getApiKey(): string {
  return localStorage.getItem('cinedirector_api_key') || DEFAULT_API_KEY;
}

export function setApiKey(key: string): void {
  localStorage.setItem('cinedirector_api_key', key);
}

// ─────────────────────────────────────────────
//  Shot List Generation
// ─────────────────────────────────────────────
export function buildShotListPrompt(
  story: string,
  genre: Genre,
  style: Style,
  numShots: number
): string {
  return `You are an expert Hollywood film director and cinematographer. Analyze the following story/script and create a professional, director-ready shot list.

STORY / SCRIPT:
"""
${story}
"""

PARAMETERS:
- Genre: ${genre}
- Visual Style: ${style}
- Number of Shots: ${numShots}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no explanation, just JSON):

{
  "title": "Scene or project title based on the story",
  "genre": "${genre}",
  "mood": "Overall emotional tone and atmosphere",
  "totalShots": ${numShots},
  "shots": [
    {
      "shotNumber": 1,
      "sceneHeading": "INT./EXT. LOCATION - DAY/NIGHT",
      "shotType": "e.g. Close-Up (CU), Wide Shot (WS), Medium Shot (MS), Extreme Wide Shot (EWS), Over-the-Shoulder (OTS)",
      "cameraAngle": "e.g. Eye level, Low angle, High angle, Dutch angle, Bird's eye",
      "cameraMovement": "e.g. Static, Dolly in, Pan right, Tilt up, Handheld, Steadicam, Crane up, Tracking shot",
      "lens": "e.g. 35mm standard, 85mm portrait, 24mm wide, 200mm telephoto",
      "subject": "Who or what is in the shot",
      "action": "Precise description of what happens in this shot",
      "lighting": "Detailed lighting setup and rationale",
      "colorPalette": "Dominant colors and color grading direction",
      "mood": "Emotional impact this shot should convey",
      "duration": "Estimated screen time e.g. 2-3 seconds",
      "transition": "How this shot transitions to the next e.g. Hard cut, Dissolve, Match cut",
      "aiVideoPrompt": "A ready-to-use AI video generation prompt using the format: [Camera movement] [Subject/action] [Setting description] [Lighting & atmosphere] [Visual style] [Technical specs]. Make this highly specific and cinematic.",
      "notes": "Optional director notes, e.g. focus pulls, practical considerations, alternative takes"
    }
  ]
}

IMPORTANT RULES:
- Use professional cinema terminology throughout
- Make aiVideoPrompt self-contained and ready to paste into Kling, Sora, Veo, or Runway
- Each shot must serve the story — explain WHY each shot choice matters in the notes
- Vary shot types for dynamic storytelling rhythm
- Match ${style} visual style in all choices`;
}

// ─────────────────────────────────────────────
//  Shot Image Generation (on-demand, quota-friendly)
// ─────────────────────────────────────────────
export async function generateShotImage(
  shotPrompt: string,
  shotType: string,
  style: Style
): Promise<string> {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  // Use gemini-2.0-flash-preview-image-generation for image output
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-preview-image-generation',
  });

  const imagePrompt = `Create a cinematic storyboard panel sketch for a film shot. Style: rough professional storyboard, black and white with subtle grey tones, clean lines, directional arrows for camera movement where applicable.

Shot type: ${shotType}
Visual style: ${style}
Scene description: ${shotPrompt}

Make it look like a professional director's storyboard sketch - clean, expressive, with strong composition.`;

  const result = await model.generateContent([{ text: imagePrompt }]);
  const response = result.response;

  // Extract inline image data from response parts
  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData?.mimeType?.startsWith('image/')) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('No image generated in response');
}

// ─────────────────────────────────────────────
//  Main text generation (returns full response text)
// ─────────────────────────────────────────────
export async function generateShotList(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
