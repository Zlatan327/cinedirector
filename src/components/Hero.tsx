import type { GenerationStatus, Genre, Style } from '../types';


const GENRES: Genre[] = [
  'Drama', 'Action', 'Romance', 'Horror', 'Comedy',
  'Documentary', 'Thriller', 'Sci-Fi', 'Ad / Commercial', 'Reels / Short',
];

const STYLES: Style[] = [
  'Cinematic', 'Indie Film', 'Noir', 'Documentary',
  'Music Video', 'Social Media', 'Anime / Animation', 'Horror',
];

const SAMPLE_STORIES = [
  {
    label: '🎬 Action Chase',
    text: 'A detective chases a thief through a rainy downtown. The thief ducks into a crowded market, weaving between stalls. The detective loses sight, then spots a flash of red jacket on a rooftop. Heart pounding, he climbs a fire escape as thunder rumbles above.',
  },
  {
    label: '💔 Romance Moment',
    text: 'Two old friends reunite at a seaside cafe after 10 years apart. She\'s changed—confident now, sunburned, laughing easily. He hasn\'t. They order the same coffee they always did. Neither mentions the letter he never sent.',
  },
  {
    label: '📱 Product Ad',
    text: 'A new noise-canceling headphone brand. Show a busy mom commuting, chaos all around her. She puts on the headphones. Instantly: silence, calm, a small smile. The world keeps going—she just found her pocket of peace.',
  },
  {
    label: '🌌 Sci-Fi Reveal',
    text: 'An astronaut on a solo deep-space mission receives a signal from Earth — but Earth has been silent for 200 years. She plays it back. It\'s her own voice, reading coordinates she doesn\'t recognize. She sets course.',
  },
];

interface Props {
  story: string;
  genre: Genre;
  style: Style;
  numShots: number;
  status: GenerationStatus;
  onStoryChange: (v: string) => void;
  onGenreChange: (v: Genre) => void;
  onStyleChange: (v: Style) => void;
  onNumShotsChange: (v: number) => void;
  onGenerate: () => void;
  onReset: () => void;
}

export function Hero({
  story, genre, style, numShots, status,
  onStoryChange, onGenreChange, onStyleChange, onNumShotsChange,
  onGenerate, onReset,
}: Props) {
  const isGenerating = status === 'generating';
  const isDone = status === 'done';

  return (
    <section className="hero" id="hero-section">
      <div className="hero-bg" aria-hidden />

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" aria-hidden />
          AI-Powered Director
        </div>

        <h1 className="hero-title">
          Turn Any Story Into a
          <span className="hero-title-accent"> Shot List</span>
        </h1>
        <p className="hero-subtitle">
          Paste your story, script, Reels idea, or novel excerpt — CineDirector builds a
          professional shot list with camera directions, lighting, and ready-to-use AI video prompts.
        </p>

        {/* Sample story buttons */}
        <div className="sample-stories" role="group" aria-label="Sample stories">
          <span className="sample-label">Try a sample:</span>
          {SAMPLE_STORIES.map((s) => (
            <button
              key={s.label}
              className="sample-btn"
              onClick={() => onStoryChange(s.text)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Story textarea */}
        <div className="input-card">
          <label className="input-label" htmlFor="story-input">
            Your Story or Script
          </label>
          <textarea
            id="story-input"
            className="story-textarea"
            value={story}
            onChange={(e) => onStoryChange(e.target.value)}
            placeholder="Paste your story, script excerpt, ad concept, or Reels idea here…"
            rows={7}
          />

          {/* Controls row */}
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
              <label className="control-label" htmlFor="shots-slider">
                Shots: <strong>{numShots}</strong>
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
              <button className="btn-ghost" onClick={onReset} id="reset-btn">
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
                <>
                  <span className="spinner" aria-hidden />
                  Directing…
                </>
              ) : (
                <>
                  🎬 Generate Shot List
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
