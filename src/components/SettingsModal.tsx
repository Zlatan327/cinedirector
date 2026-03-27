import { useState } from 'react';
import { getApiKey, setApiKey, DEFAULT_API_KEY } from '../lib/gemini';

interface Props {
  onClose: () => void;
}

export function SettingsModal({ onClose }: Props) {
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(key.trim() || DEFAULT_API_KEY);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setApiKey(DEFAULT_API_KEY);
    setKey(DEFAULT_API_KEY);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-icon">⚙️</span>
            <h2 className="modal-title">Settings</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <label className="settings-label" htmlFor="api-key-input">
              Google Gemini API Key
            </label>
            <p className="settings-hint">
              Your key is stored only in your browser. Get a free key at{' '}
              <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">
                aistudio.google.com
              </a>
            </p>
            <div className="api-key-row">
              <input
                id="api-key-input"
                className="settings-input"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                autoComplete="off"
              />
              <button className="btn-secondary" onClick={() => setKey('')} title="Clear">
                ✕
              </button>
            </div>
            <div className="settings-actions">
              <button className="btn-primary btn-sm" onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Save Key'}
              </button>
              <button className="btn-ghost btn-sm" onClick={handleReset}>
                Restore Default
              </button>
            </div>
          </div>

          <div className="settings-section settings-info">
            <h3>About CineDirector</h3>
            <p>Uses <code>gemini-2.0-flash</code> for shot list generation and <code>gemini-2.0-flash-preview-image-generation</code> for on-demand storyboard images.</p>
            <p>Free tier: ~1,500 text requests/day. Image generation uses separate quota — generated only when you click "Generate Image" on a shot card.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
