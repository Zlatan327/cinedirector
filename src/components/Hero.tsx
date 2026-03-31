import type { GenerationStatus, Genre, Style, TargetModel } from '../types';

const TARGET_MODELS: TargetModel[] = ['Universal', 'Grok', 'Veo', 'Kling', 'Sora'];

const GENRES: Genre[] = [
  'Ad / Commercial', 'Reels / Short', 'Drama', 'Action', 'Romance', 'Horror', 'Comedy',
  'Documentary', 'Thriller', 'Sci-Fi',
];

const STYLES: Style[] = [
  'Cinematic', 'Social Media', 'Music Video', 'Indie Film', 'Noir', 'Documentary',
  'Anime / Animation', 'Horror',
];

const SAMPLE_STORIES = [
  { label: '📱 Product Launch', text: 'A next-gen smartwatch that monitors stress in real time. Open on a frantic executive in a meeting — heart racing, hands sweaty. He glances at his watch: it flashes a calm signal. He takes one breath. The room slows down. Tagline: "Feel every second."' },
  { label: '🏆 Contest Entry', text: 'A 30-second Grok video contest ad. An everyday person types a question into an AI and gets an answer so unexpected it changes their whole day. Fast cuts, quick reactions, energetic music. Show the magic of AI in everyday life.' },
  { label: '🎵 Music Promo', text: 'A rising artist drops her first single. Quick cuts of her writing lyrics at 3am, performing for an empty room, then one night — sold out. The song plays throughout. End on her face: disbelief becoming joy. 60 seconds.' },
  { label: '🛒 Brand Ad', text: 'A minimalist sneaker brand targeting Gen Z. No narration — just a pair of shoes moving through a city: subway, rooftop, park, concert. Each environment is a different color grade. 45 seconds. The shoes do all the talking.' },
];

interface Props {
  story: string;
  intent: string;
  genre: Genre;
  style: Style;
  targetModel: TargetModel;
  numShots: number;
  status: GenerationStatus;
  onStoryChange: (v: string) => void;
  onIntentChange: (v: string) => void;
  onGenreChange: (v: Genre) => void;
  onStyleChange: (v: Style) => void;
  onTargetModelChange: (v: TargetModel) => void;
  onNumShotsChange: (v: number) => void;
  onGenerate: () => void;
  onReset: () => void;
}

export function Hero({
  story, intent, genre, style, targetModel, numShots, status,
  onStoryChange, onIntentChange, onGenreChange, onStyleChange, onTargetModelChange, onNumShotsChange,
  onGenerate, onReset,
}: Props) {
  const isGenerating = status === 'generating';
  const isDone = status === 'done';

  const scrollToInput = () => {
    document.getElementById('input-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="hero" id="hero-section">
        {/* Subtle grid lines */}
        <div className="hero-grid" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="hero-grid-line" />
          ))}
        </div>

        <div className="hero-layout">
          {/* LEFT: Headline */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-counter">[1 / 1]</span>
              <span className="hero-eyebrow-dot" aria-hidden />
              AI-Powered Director
            </div>

            <h1 className="hero-headline">
              Win Video<br />
              Contests With<br />
              <span className="hero-headline-accent">Your Idea</span>
            </h1>

            <p className="hero-sub">
              Built for Grok &amp; Gemini Veo creators. Drop your ad or promo concept
              and get a ready-to-shoot plan — camera angles, lighting &amp; AI video
              prompts optimised for clips under 2 minutes.
            </p>

            <div className="hero-cta-row">
              <button
                className="btn-primary btn-generate"
                onClick={isDone ? onReset : scrollToInput}
                id="hero-cta-btn"
              >
                {isDone ? '← New Concept' : 'Start Creating →'}
              </button>
              <button className="btn-outline-dark" onClick={scrollToInput} id="hero-example-btn">
                Try a Sample
              </button>
            </div>
          </div>

          {/* CENTER: 3D Camera */}
          <div className="hero-center">
            <div className="hero-camera-wrap">
              <div className="hero-glow" aria-hidden />

              {/* Floating chips */}
              <div className="float-chip chip-1">
                <span className="float-chip-emoji">🎬</span>Shot List
              </div>
              <div className="float-chip chip-2">
                <span className="float-chip-emoji">🎥</span>Camera
              </div>
              <div className="float-chip chip-3">
                <span className="float-chip-emoji">💡</span>Lighting
              </div>
              <div className="float-chip chip-4">
                <span className="float-chip-emoji">✂️</span>Transition
              </div>
              <div className="float-chip chip-5">
                <span className="float-chip-emoji">🌊</span>Mood
              </div>

              <img
                src="/camera-hero.png"
                alt="3D Cinema Camera"
                className="hero-camera-img"
              />
            </div>
          </div>

          {/* RIGHT: Stat + social */}
          <div className="hero-right">
            <div className="hero-stat">
              <div className="hero-stat-arrow">↑</div>
              <div className="hero-stat-number">&lt;2min</div>
              <div className="hero-stat-label">Ad &amp; Promo Ready</div>
              <p className="hero-stat-sub">
                Optimised for Grok, Veo &amp; Kling — every prompt contest-ready.
              </p>
            </div>

            <div className="hero-social" aria-label="Links">
              <a
                className="hero-social-icon"
                href="https://aistudio.google.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Google AI Studio"
                aria-label="Google AI Studio"
              >
                G
              </a>
              <a
                className="hero-social-icon"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                aria-label="GitHub"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* BOTTOM ROW: desc + watermark */}
          <div className="hero-bottom">
            <p className="hero-bottom-desc">
              Drop your ad or promo idea — we build the shot list &amp; AI prompts
              ready for Grok, Gemini Veo, Sora, or Kling in seconds.
            </p>
            <div className="hero-watermark" aria-hidden>
              CineDirector
            </div>
          </div>
        </div>
      </section>

      {/* ── INPUT SECTION ──────────────────────────────── */}
      <section className="input-section" id="input-section">
        <div className="input-section-inner">
          <div className="section-eyebrow">
            <span className="section-eyebrow-line" aria-hidden />
            Step 01
            <span className="section-eyebrow-line" aria-hidden />
          </div>

          <h2 className="section-title">
            Describe Your <span>Ad Concept</span>
          </h2>

          {/* Sample story pills */}
          <div className="sample-pills" role="group" aria-label="Sample concepts">
            <span className="sample-pill-label">Try:</span>
            {SAMPLE_STORIES.map((s) => (
              <button
                key={s.label}
                className="sample-pill"
                onClick={() => onStoryChange(s.text)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="input-card">
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="input-label" htmlFor="intent-input">
                Video Intent / Contest Target (Optional)
              </label>
              <input
                id="intent-input"
                className="story-textarea"
                style={{ minHeight: "auto", padding: "0.75rem 1.25rem" }}
                value={intent}
                onChange={(e) => onIntentChange(e.target.value)}
                placeholder="e.g. Grok Aurora contest — 30s smartwatch product launch..."
                type="text"
              />
            </div>

            <label className="input-label" htmlFor="story-input">
              Your Ad / Promo Concept (keep it under 2 minutes)
            </label>
            <textarea
              id="story-input"
              className="story-textarea"
              value={story}
              onChange={(e) => onStoryChange(e.target.value)}
              placeholder="Describe your ad or promo idea — product, brand, emotion, hook, ending. No need to write a script — just your concept. Grok / Veo / Kling ready."
              rows={7}
            />

            <div className="controls-grid">
              <div className="control-group">
                <label className="control-label" htmlFor="genre-select">Genre</label>
                <select
                  id="genre-select"
                  className="control-select"
                  value={genre}
                  onChange={(e) => onGenreChange(e.target.value as Genre)}
                >
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="control-group">
                <label className="control-label" htmlFor="style-select">Visual Style</label>
                <select
                  id="style-select"
                  className="control-select"
                  value={style}
                  onChange={(e) => onStyleChange(e.target.value as Style)}
                >
                  {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="control-group">
                <label className="control-label" htmlFor="model-select">Target AI Model</label>
                <select
                  id="model-select"
                  className="control-select"
                  value={targetModel}
                  onChange={(e) => onTargetModelChange(e.target.value as TargetModel)}
                >
                  {TARGET_MODELS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="control-group" style={{ gridColumn: '1 / -1' }}>
                <label className="control-label" htmlFor="shots-slider" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Shots: <strong style={{ color: 'var(--accent-light)' }}>{numShots}</strong></span>
                  <span style={{ color: 'rgba(253,252,250,0.3)', textTransform: 'none', letterSpacing: 'normal', fontWeight: 500 }}>
                    (≈ {numShots * 10}s total generated media)
                  </span>
                </label>
                <input
                  id="shots-slider"
                  className="control-slider"
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={numShots}
                  onChange={(e) => onNumShotsChange(parseInt(e.target.value))}
                />
                <div className="slider-labels">
                  <span>5</span><span>30</span>
                </div>
              </div>
            </div>

            <div className="action-row">
              {isDone && (
                <button className="btn-ghost-dark" onClick={onReset} id="reset-btn">
                  ← New
                </button>
              )}
              <button
                id="generate-btn"
                className={`btn-primary btn-generate ${isGenerating ? 'loading' : ''}`}
                onClick={onGenerate}
                disabled={isGenerating || !story.trim()}
              >
                {isGenerating ? (
                  <><span className="spinner" aria-hidden /> Directing…</>
                ) : (
                  <>🎬 Generate Shot List</>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
