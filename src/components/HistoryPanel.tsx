import type { HistoryEntry } from '../types';


interface Props {
  isOpen: boolean;
  history: HistoryEntry[];
  loading: boolean;
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function HistoryPanel({ isOpen, history, loading, onSelect, onDelete, onClear, onClose }: Props) {
  return (
    <>
      <div className={`history-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} aria-hidden={!isOpen} />
      <aside className={`history-panel ${isOpen ? 'open' : ''}`} aria-label="History panel" aria-hidden={!isOpen}>
        <div className="history-header">
          <h2 className="history-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            History
          </h2>
          <div className="history-header-actions">
            {history.length > 0 && (
              <button className="btn-ghost btn-xs" onClick={onClear} aria-label="Clear all history">
                Clear All
              </button>
            )}
            <button className="btn-ghost btn-xs" onClick={onClose} aria-label="Close history">✕</button>
          </div>
        </div>

        <div className="history-list">
          {loading && (
            <div className="history-empty">
              <div className="spinner" aria-label="Loading..." />
            </div>
          )}

          {!loading && history.length === 0 && (
            <div className="history-empty">
              <div className="history-empty-icon" aria-hidden>📂</div>
              <p>No history yet.</p>
              <p className="history-empty-hint">Generated shot lists will appear here.</p>
            </div>
          )}

          {!loading && history.map((entry) => (
            <div
              key={entry.id}
              className="history-item"
              id={`history-item-${entry.id}`}
            >
              <button
                className="history-item-main"
                onClick={() => onSelect(entry)}
                aria-label={`Load ${entry.result.title}`}
              >
                <span className="history-item-title">{entry.result.title}</span>
                <div className="history-item-meta">
                  <span className="history-item-tag">{entry.genre}</span>
                  <span className="history-item-tag">{entry.result.totalShots} shots</span>
                  <span className="history-item-time">{timeAgo(entry.createdAt)}</span>
                </div>
                <p className="history-item-preview">
                  {entry.storyInput.slice(0, 80)}…
                </p>
              </button>
              <button
                className="history-delete-btn"
                onClick={() => onDelete(entry.id)}
                aria-label={`Delete ${entry.result.title}`}
                title="Delete"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
