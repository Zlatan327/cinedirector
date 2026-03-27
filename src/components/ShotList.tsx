import { useState } from 'react';
import type { ShotListResult, Style } from '../types';
import { ShotCard } from './ShotCard';

interface Props {
  result: ShotListResult;
  style: Style;
  onImageUpdate: (shotNumber: number, url: string) => void;
}

export function ShotList({ result, style, onImageUpdate }: Props) {
  const [allCopied, setAllCopied] = useState(false);

  const copyAllPrompts = async () => {
    const text = result.shots
      .map((s) => `SHOT ${String(s.shotNumber).padStart(2, '0')} — ${s.sceneHeading}\n${s.aiVideoPrompt}`)
      .join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2500);
  };

  const downloadText = () => {
    const text = [
      `CINEDIRECTOR SHOT LIST`,
      `═══════════════════════`,
      `Title: ${result.title}`,
      `Genre: ${result.genre}`,
      `Mood: ${result.mood}`,
      `Total Shots: ${result.totalShots}`,
      `Generated: ${new Date().toLocaleString()}`,
      ``,
      ...result.shots.flatMap((s) => [
        ``,
        `━━━ SHOT ${String(s.shotNumber).padStart(2, '0')} ━━━━━━━━━━━━━━━━━━━━━━━━━`,
        `Scene:        ${s.sceneHeading}`,
        `Type:         ${s.shotType}`,
        `Angle:        ${s.cameraAngle}`,
        `Movement:     ${s.cameraMovement}`,
        `Lens:         ${s.lens}`,
        `Subject:      ${s.subject}`,
        `Action:       ${s.action}`,
        `Lighting:     ${s.lighting}`,
        `Color:        ${s.colorPalette}`,
        `Mood:         ${s.mood}`,
        `Duration:     ${s.duration}`,
        `Transition:   ${s.transition}`,
        `Notes:        ${s.notes || 'N/A'}`,
        ``,
        `AI VIDEO PROMPT:`,
        s.aiVideoPrompt,
      ]),
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/[^a-zA-Z0-9]/g, '_')}_shotlist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="shot-list-section" id="shot-list-section">
      {/* Output header */}
      <div className="shot-list-header">
        <div className="shot-list-meta">
          <div className="shot-list-title-row">
            <h2 className="shot-list-title">{result.title}</h2>
            <span className="shot-count-badge">{result.totalShots} shots</span>
          </div>
          <div className="shot-list-tags">
            <span className="meta-tag">🎭 {result.genre}</span>
            <span className="meta-tag">🌊 {result.mood}</span>
          </div>
        </div>
        <div className="shot-list-actions">
          <button
            id="copy-all-prompts-btn"
            className={`btn-secondary ${allCopied ? 'copied' : ''}`}
            onClick={copyAllPrompts}
          >
            {allCopied ? '✓ All Copied!' : '⎘ Copy All Prompts'}
          </button>
          <button
            id="download-shotlist-btn"
            className="btn-primary"
            onClick={downloadText}
          >
            ↓ Download Shot List
          </button>
        </div>
      </div>

      {/* Shot cards */}
      <div className="shot-cards-grid">
        {result.shots.map((shot, i) => (
          <ShotCard
            key={shot.shotNumber}
            shot={shot}
            index={i}
            style={style}
            onImageUpdate={onImageUpdate}
          />
        ))}
      </div>
    </section>
  );
}
