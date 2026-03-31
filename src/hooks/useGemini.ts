import { useState, useCallback } from 'react';
import type { Genre, GenerationStatus, ShotListResult, Style } from '../types';
import { buildShotListPrompt, generateShotList } from '../lib/gemini';
import { parseAIResponse } from '../lib/parser';

export function useGemini() {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [result, setResult] = useState<ShotListResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (story: string, intent: string, genre: Genre, style: Style, numShots: number) => {
      setStatus('generating');
      setResult(null);
      setError(null);

      try {
        const prompt = buildShotListPrompt(story, intent, genre, style, numShots);
        const rawText = await generateShotList(prompt);
        const parsed = parseAIResponse(rawText);
        setResult(parsed);
        setStatus('done');
        return parsed;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setStatus('error');
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, generate, reset, setResult };
}
