import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Genre, Style, TargetModel } from '../types';

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
  intent: string,
  targetModel: TargetModel = 'Universal',
  genre: Genre,
  style: Style,
  numShots: number
): string {
  const intentLine = intent.trim()
    ? `\nVIDEO INTENT / GOAL:\n${intent.trim()}\n`
    : '';

  let modelRules = 'Make aiVideoPrompt self-contained and ready to paste into Grok, Veo, Kling, Sora, or Runway.';
  let promptStructure = '[Camera movement] [Subject/action] [Setting] [Lighting & atmosphere] [Visual style] [Specs]';
  
  if (targetModel === 'Grok') {
    modelRules = 'Grok Aurora/Imagine prefers: Subject + Motion + Camera + Style + Atmosphere/Lighting. Keep it concise. Use strong action verbs. Add "photorealistic, 4K" if applicable.';
    promptStructure = '[Subject] [Motion] [Camera] [Style] [Atmosphere/Lighting]';
  } else if (targetModel === 'Veo') {
    modelRules = 'Gemini Veo prefers: [Cinematography/Camera] + [Subject] + [Action] + [Context/Setting] + [Style & Ambiance]. Use natural language, avoid quotes for dialogue (use colon). Focus on ONE clear idea per clip.';
    promptStructure = '[Cinematography/Camera] [Subject] [Action] [Context/Setting] [Style & Ambiance]';
  } else if (targetModel === 'Kling') {
    modelRules = 'Kling prefers: Subject + Action + Context + Style. Start with scene/setting, then characters/action/camera, then style. Simple scenes with one main action perform best.';
    promptStructure = '[Setting/Context] [Subject] [Action] [Camera] [Style]';
  } else if (targetModel === 'Sora') {
    modelRules = 'Sora prefers highly descriptive, cinematic language with physics-aware details. Focus on detailed camera movements, specific lighting physics, and world-building.';
    promptStructure = '[Descriptive Camera & Movement] [Subject & Physics] [Setting Detail] [Lighting] [Cinematic Style]';
  }

  return `You are an expert director and advertising creative specialising in short-form video content for AI video platforms. Turn the following concept into a professional, ready-to-shoot shot list.
${intentLine}
TARGET AI MODEL FORMATTING:
Optimize the "aiVideoPrompt" exactly for ${targetModel}.
Rule: ${modelRules}

CONCEPT / IDEA:
"""
${story}
"""

PARAMETERS:
- Genre: ${genre}
- Visual Style: ${style}
- Number of Shots: ${numShots}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no explanation, just JSON):

{
  "title": "Short punchy title for this video concept",
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
      "duration": "Estimated screen time. MUST be exactly '5 seconds' or '10 seconds'",
      "transition": "How this shot transitions to the next e.g. Hard cut, Dissolve, Match cut",
      "aiVideoPrompt": "A ready-to-use ${targetModel} prompt. Structure STRICTLY as: ${promptStructure}. Self-contained.",
      "notes": "Director notes: pacing cue, energy level, viewer emotion, any practical tip"
    }
  ]
}

IMPORTANT RULES:
- Total video duration across ALL shots MUST stay under 2 minutes (120 seconds) — this is for short ads and promos
- Clip durations MUST be exactly 5 seconds or 10 seconds to align with standard AI video generation tools.
- Every shot must earn its place — tight pacing, maximum impact per second
- Make aiVideoPrompt self-contained and formatted exclusively for ${targetModel} using the structure requested.
- Use professional cinema terminology throughout
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

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-preview-image-generation',
  });

  const imagePrompt = `Create a cinematic storyboard panel sketch for a short-form ad or promo video shot. Style: rough professional storyboard, black and white with subtle grey tones, clean lines, directional arrows for camera movement where applicable.

Shot type: ${shotType}
Visual style: ${style}
Scene description: ${shotPrompt}

Make it look like a professional director's storyboard sketch - clean, expressive, with strong composition.`;

  const result = await model.generateContent([{ text: imagePrompt }]);
  const response = result.response;

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
