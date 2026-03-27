import { useState } from 'react';
import type { Shot, Style } from '../types';
import { generateShotImage } from '../lib/gemini';

interface Props {
  shot: Shot;
  index: number;
  style: Style;
  onImageUpdate: (shotNumber: number, url: string) => void;
}

export function ShotCard({ shot, index, style, onImageUpdate }: Props) {
  const [copied, setCopied] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(shot.aiVideoPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = shot.aiVideoPrompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateImage = async () => {
    setImgLoading(true);
    setImgError(null);
    try {
      const url = await generateShotImage(shot.action + ' ' + shot.subject, shot.shotType, style);
      onImageUpdate(shot.shotNumber, url);
    } catch (err) {
      setImgError('Image generation failed. Check API key or try again.');
      console.error(err);
    } finally {
      setImgLoading(false);
    }
  };

  const shotTypeShort = shot.shotType.match(/\(([^)]+)\)/)?.[1] || shot.shotType.split(' ')[0];

  return (
    <article
      className="shot-card"
      id={`shot-card-${shot.shotNumber}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Card Header / Slate */}
      <div className="shot-slate">
        <div className="shot-number-badge">
          <span className="shot-num-label">SHOT</span>
          <span className="shot-num">{String(shot.shotNumber).padStart(2, '0')}</span>
        </div>
        <div className="shot-meta">
          <span className="shot-heading">{shot.sceneHeading}</span>
          <div className="shot-tags">
            <span className="tag tag-type">{shotTypeShort}</span>
            <span className="tag tag-angle">{shot.cameraAngle.split(',')[0]}</span>
            <span className="tag tag-mood">{shot.mood}</span>
          </div>
        </div>
        <button
          className="card-expand-btn"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Collapse shot details' : 'Expand shot details'}
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {expanded
              ? <path d="M18 15l-6-6-6 6"/>
              : <path d="M6 9l6 6 6-6"/>}
          </svg>
        </button>
      </div>

      {/* Storyboard image */}
      {shot.imageUrl ? (
        <div className="shot-image-container">
          <img src={shot.imageUrl} alt={`Storyboard panel for shot ${shot.shotNumber}`} className="shot-image" />
          <span className="shot-image-label">Storyboard Panel</span>
        </div>
      ) : (
        <div className="shot-image-placeholder">
          <div className="shot-image-placeholder-inner">
            <div className="placeholder-frame">
              <span className="placeholder-shot-type">{shotTypeShort}</span>
              <div className="placeholder-lines">
                <div className="ph-line ph-line-wide" />
                <div className="ph-line ph-line-mid" />
                <div className="ph-line ph-line-short" />
              </div>
            </div>
            <button
              className="btn-generate-image"
              onClick={handleGenerateImage}
              disabled={imgLoading}
              id={`generate-image-btn-${shot.shotNumber}`}
              title="Uses one API call"
            >
              {imgLoading ? (
                <><span className="spinner spinner-sm" aria-hidden /> Generating…</>
              ) : (
                <>🎨 Generate Storyboard Image</>
              )}
            </button>
            {imgError && <p className="img-error">{imgError}</p>}
          </div>
        </div>
      )}

      {/* Core info grid — always visible */}
      <div className="shot-body">
        <div className="shot-grid">
          <div className="shot-field">
            <span className="field-label">📷 Shot Type</span>
            <span className="field-value">{shot.shotType}</span>
          </div>
          <div className="shot-field">
            <span className="field-label">🎥 Camera Movement</span>
            <span className="field-value">{shot.cameraMovement}</span>
          </div>
          <div className="shot-field">
            <span className="field-label">🔭 Lens</span>
            <span className="field-value">{shot.lens}</span>
          </div>
          <div className="shot-field">
            <span className="field-label">⏱ Duration</span>
            <span className="field-value">{shot.duration}</span>
          </div>
        </div>

        <div className="shot-field shot-field-full">
          <span className="field-label">🎭 Subject & Action</span>
          <span className="field-value">{shot.subject} — {shot.action}</span>
        </div>

        <div className="shot-field shot-field-full">
          <span className="field-label">💡 Lighting</span>
          <span className="field-value">{shot.lighting}</span>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="shot-expanded">
            <div className="shot-grid">
              <div className="shot-field">
                <span className="field-label">🎨 Color Palette</span>
                <span className="field-value">{shot.colorPalette}</span>
              </div>
              <div className="shot-field">
                <span className="field-label">✂️ Transition</span>
                <span className="field-value">{shot.transition}</span>
              </div>
            </div>
            {shot.notes && (
              <div className="shot-field shot-field-full">
                <span className="field-label">📝 Director's Notes</span>
                <span className="field-value field-notes">{shot.notes}</span>
              </div>
            )}
          </div>
        )}

        {/* AI Video Prompt box */}
        <div className="ai-prompt-box">
          <div className="ai-prompt-header">
            <span className="ai-prompt-label">
              <span className="ai-dot" aria-hidden />
              AI Video Prompt
            </span>
            <button
              className={`copy-btn ${copied ? 'copied' : ''}`}
              onClick={copyPrompt}
              id={`copy-prompt-btn-${shot.shotNumber}`}
              aria-label="Copy AI video prompt"
            >
              {copied ? '✓ Copied!' : '⎘ Copy'}
            </button>
          </div>
          <p className="ai-prompt-text">{shot.aiVideoPrompt}</p>
        </div>
      </div>
    </article>
  );
}
