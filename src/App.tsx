import { useState, useCallback } from 'react';
import type { Genre, Style, ShotListResult, HistoryEntry } from './types';
import { useGemini } from './hooks/useGemini';
import { useHistory } from './hooks/useHistory';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShotList } from './components/ShotList';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsModal } from './components/SettingsModal';

function App() {
  // Input state
  const [story, setStory] = useState('');
  const [intent, setIntent] = useState('');
  const [genre, setGenre] = useState<Genre>('Ad / Commercial');
  const [style, setStyle] = useState<Style>('Cinematic');
  const [numShots, setNumShots] = useState(8);

  // UI state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // AI + history hooks
  const { status, result, error, generate, reset, setResult } = useGemini();
  const { history, loading: historyLoading, save, remove, clear } = useHistory();

  const handleGenerate = useCallback(async () => {
    const parsed = await generate(story, intent, genre, style, numShots);
    if (parsed) {
      const entry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
        storyInput: story,
        genre,
        style,
        result: parsed,
      };
      await save(entry);
      setTimeout(() => {
        document.getElementById('shot-list-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [generate, story, intent, genre, style, numShots, save]);

  const handleHistorySelect = (entry: HistoryEntry) => {
    setStory(entry.storyInput);
    setGenre(entry.genre as Genre);
    setStyle(entry.style as Style);
    setResult(entry.result);
    setHistoryOpen(false);
    setTimeout(() => {
      document.getElementById('shot-list-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleImageUpdate = useCallback(
    (shotNumber: number, url: string) => {
      if (!result) return;
      const updated: ShotListResult = {
        ...result,
        shots: result.shots.map((s) =>
          s.shotNumber === shotNumber ? { ...s, imageUrl: url } : s
        ),
      };
      setResult(updated);
    },
    [result, setResult]
  );

  const handleReset = () => {
    reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Navbar
        historyOpen={historyOpen}
        onHistoryToggle={() => setHistoryOpen((v) => !v)}
        onSettingsOpen={() => setSettingsOpen(true)}
      />

      <main className="main-content">
        <Hero
          story={story}
          intent={intent}
          genre={genre}
          style={style}
          numShots={numShots}
          status={status}
          onStoryChange={setStory}
          onIntentChange={setIntent}
          onGenreChange={setGenre}
          onStyleChange={setStyle}
          onNumShotsChange={setNumShots}
          onGenerate={handleGenerate}
          onReset={handleReset}
        />

        {/* Error state */}
        {status === 'error' && error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
            <button className="btn-ghost btn-sm" onClick={handleReset}>Try Again</button>
          </div>
        )}

        {/* Loading skeleton */}
        {status === 'generating' && (
          <div className="generating-state" aria-live="polite" aria-label="Generating shot list">
            <div className="generating-inner">
              <div className="film-roll-anim" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="film-frame" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <p className="generating-text">Directing your scenes…</p>
              <p className="generating-hint">Crafting camera angles, lighting setups & AI prompts</p>
            </div>
          </div>
        )}

        {/* Results */}
        {status === 'done' && result && (
          <ShotList
            result={result}
            style={style}
            onImageUpdate={handleImageUpdate}
          />
        )}
      </main>

      <HistoryPanel
        isOpen={historyOpen}
        history={history}
        loading={historyLoading}
        onSelect={handleHistorySelect}
        onDelete={remove}
        onClear={clear}
        onClose={() => setHistoryOpen(false)}
      />

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      <footer className="footer">
        <p>
          CineDirector — Powered by{' '}
          <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer">
            Google Gemini
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
