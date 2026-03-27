import type { ShotListResult } from '../types';

/**
 * Attempts to parse the AI response as a ShotListResult JSON object.
 * Handles cases where the model wraps JSON in markdown code fences.
 */
export function parseAIResponse(raw: string): ShotListResult {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
  }

  // Find the first '{' and last '}' to extract JSON even if there's surrounding text
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No JSON object found in AI response.');
  }
  cleaned = cleaned.slice(start, end + 1);

  const parsed = JSON.parse(cleaned) as ShotListResult;

  // Validate required fields
  if (!parsed.shots || !Array.isArray(parsed.shots)) {
    throw new Error('Invalid shot list format: missing shots array.');
  }

  // Ensure shot numbers are sequential
  parsed.shots = parsed.shots.map((shot, i) => ({
    ...shot,
    shotNumber: i + 1,
  }));

  parsed.totalShots = parsed.shots.length;

  return parsed;
}
