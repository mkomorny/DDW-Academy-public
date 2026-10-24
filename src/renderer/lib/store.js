/**
 * store.js — learner progress.
 *
 * Design rule for this course: progress is a RECORD, never a GATE. The learner
 * asked to be able to skip ahead or go back freely, so nothing here ever
 * prevents navigation. Checkpoints report readiness; they don't lock doors.
 */

const EMPTY = () => ({
  version: 1,
  createdAt: new Date().toISOString(),
  lessons: {},        // lessonId -> { viewed, completedAt }
  stepChecks: {},     // lessonId -> { [stepIndex]: { attempts, ok, lastAt } }
  quizzes: {},        // quizId   -> { attempts, best, lastScore, lastAt }
  drills: {},         // drillId  -> { attempts, best, lastAt, totalTimeMs }
  drillTiers: {},     // drillId  -> { unlocked, selected, winsAtTier, totalAtTier }
  games: {},          // gameId   -> { plays, highScore, lastAt }
  checkpoints: {},    // moduleId -> { [index]: true }
  practice: { totalMs: 0, sessions: [], streak: 0, lastPracticeDay: null },
  tracks: {},         // trackId  -> { lastLessonId, startedAt } — per-track "continue" state
  blockState: {},     // blockId  -> arbitrary — e.g. a learner's edits to an editable drumGrid
  difficultyOverrides: {}, // lessonId -> { [stepIndex]: { level, html } }
  settings: {
    preferFlats: false,
    keyLabels: 'c',
    instrument: 'piano',          // active sound bank id — see lib/instruments.js
    metronomeBpm: 90,
    midiDeviceId: 'all',
    baseOctave: 3,
    theme: 'dark',
    colorTheme: 'conservatory',   // 'conservatory' = the app's original palette
    lessonMode: 'interactive',    // 'interactive' | 'reader'
    activeTrack: 'piano',         // see course/index.js TRACKS — which curriculum track is active
    depth: 'standard',            // 'plain' | 'standard' | 'technical' — baked content register
    drumKit: '909',               // see lib/drums-manifest.js KITS
  },
});

class Store {
  constructor() {
    this.data = EMPTY();
    this._dirty = false;
    this._listeners = new Set();
    this._saveTimer = null;
  }

  async init() {
    try {
      const loaded = await window.conservatory?.loadProgress();
      if (loaded && typeof loaded === 'object') {
        // Merge rather than replace, so a progress file written by an older
        // version doesn't lose keys this version expects.
        this.data = { ...EMPTY(), ...loaded, settings: { ...EMPTY().settings, ...(loaded.settings || {}) } };
      }
    } catch (err) {
      console.error('could not load progress, starting fresh:', err);
    }
    this._emit();
    return this.data;
  }

  subscribe(fn) { this._listeners.add(fn); return () => this._listeners.delete(fn); }
  _emit() { for (const fn of this._listeners) { try { fn(this.data); } catch (e) { console.error(e); } } }

  /** Debounced — a drill can call this on every keystroke without thrashing disk. */
  save() {
    this._dirty = true;
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this.flush(), 600);
  }

  async flush() {
    if (!this._dirty) return;
    this._dirty = false;
    try {
      await window.conservatory?.saveProgress(this.data);
    } catch (err) {
      console.error('progress save failed:', err);
      this._dirty = true;      // keep it dirty so the next flush retries
    }
  }

  /* ---------------------------------------------------------------- lessons */

  markLessonViewed(lessonId) {
    const l = this.data.lessons[lessonId] || { viewed: 0, completedAt: null };
    l.viewed += 1;
    l.lastAt = Date.now();
    this.data.lessons[lessonId] = l;
    this.save(); this._emit();
  }

  markLessonComplete(lessonId) {
    const l = this.data.lessons[lessonId] || { viewed: 1, completedAt: null };
    l.completedAt = l.completedAt || Date.now();
    this.data.lessons[lessonId] = l;
    this.save(); this._emit();
  }

  isLessonComplete(lessonId) { return Boolean(this.data.lessons[lessonId]?.completedAt); }

  /* ------------------------------------------------------- step checks ---- */
  /* The inline check at the end of each lesson section. Recorded so the
     learner can see which sections they have actually drilled, and so a
     revisited lesson remembers it. Never used to gate anything.            */

  stepChecks(lessonId) {
    if (!this.data.stepChecks) this.data.stepChecks = {};
    if (!this.data.stepChecks[lessonId]) this.data.stepChecks[lessonId] = {};
    return this.data.stepChecks[lessonId];
  }

  recordStepCheck(lessonId, index, ok) {
    const rec = this.stepChecks(lessonId);
    const prev = rec[index] || { attempts: 0, ok: false };
    prev.attempts += 1;
    prev.ok = prev.ok || Boolean(ok);   // once passed, stays passed
    prev.lastAt = Date.now();
    rec[index] = prev;
    this.save(); this._emit();
    return prev;
  }

  /** Fraction of a lesson's checks passed, 0..1, given how many it has. */
  lessonCheckProgress(lessonId, totalChecks) {
    if (!totalChecks) return null;
    const rec = this.stepChecks(lessonId);
    const passed = Object.values(rec).filter((r) => r.ok).length;
    return Math.min(1, passed / totalChecks);
  }

  /* ---------------------------------------------------------------- quizzes */

  recordQuiz(quizId, score, total) {
    const pct = total ? Math.round((score / total) * 100) : 0;
    const q = this.data.quizzes[quizId] || { attempts: 0, best: 0 };
    q.attempts += 1;
    q.lastScore = pct;
    q.best = Math.max(q.best, pct);
    q.lastAt = Date.now();
    this.data.quizzes[quizId] = q;
    this.save(); this._emit();
    return q;
  }

  quizBest(quizId) { return this.data.quizzes[quizId]?.best ?? null; }

  /* ----------------------------------------------------------------- drills */

  recordDrill(drillId, { score = 0, total = 0, elapsedMs = 0 } = {}) {
    const pct = total ? Math.round((score / total) * 100) : score;
    const d = this.data.drills[drillId] || { attempts: 0, best: 0, totalTimeMs: 0 };
    d.attempts += 1;
    d.best = Math.max(d.best, pct);
    d.lastScore = pct;
    d.totalTimeMs += elapsedMs;
    d.lastAt = Date.now();
    this.data.drills[drillId] = d;
    this.addPracticeTime(elapsedMs);
    this.save(); this._emit();
    return d;
  }

  /* ------------------------------------------------------- drill tiers ----- */
  /* Difficulty tiers are unbounded: every drill starts at tier 1 and can be
     advanced forever. `unlocked` is the highest tier ever reached; `selected`
     is where the user chose to practice. Only a manual reset lowers them.    */

  tier(drillId) {
    if (!this.data.drillTiers) this.data.drillTiers = {};
    let t = this.data.drillTiers[drillId];
    if (!t) {
      t = { unlocked: 1, selected: 1, winsAtTier: 0, totalAtTier: 0 };
      this.data.drillTiers[drillId] = t;
    }
    return t;
  }

  selectTier(drillId, tier) {
    const t = this.tier(drillId);
    t.selected = Math.max(1, Math.min(t.unlocked, tier));
    t.winsAtTier = 0;
    t.totalAtTier = 0;
    this.save();
    return t;
  }

  /** Record one answer at the current tier; returns { advanced, tier }. */
  recordTierAnswer(drillId, correct, { winsNeeded = 10, minAccuracy = 0.8 } = {}) {
    const t = this.tier(drillId);
    t.totalAtTier += 1;
    if (correct) t.winsAtTier += 1;

    let advanced = false;
    const accuracy = t.winsAtTier / t.totalAtTier;
    if (t.winsAtTier >= winsNeeded && accuracy >= minAccuracy) {
      t.selected += 1;
      t.unlocked = Math.max(t.unlocked, t.selected);
      t.winsAtTier = 0;
      t.totalAtTier = 0;
      advanced = true;
    }
    this.save();
    return { advanced, tier: t };
  }

  resetTiers(drillId) {
    if (this.data.drillTiers) delete this.data.drillTiers[drillId];
    if (this.data.drills) delete this.data.drills[drillId];
    this.save(); this._emit();
  }

  /* ------------------------------------------------------------------ games */

  recordGame(gameId, score) {
    const g = this.data.games[gameId] || { plays: 0, highScore: 0 };
    g.plays += 1;
    g.highScore = Math.max(g.highScore, score);
    g.lastScore = score;
    g.lastAt = Date.now();
    this.data.games[gameId] = g;
    this.save(); this._emit();
    return g;
  }

  /* ------------------------------------------------------------ checkpoints */

  toggleCheckpoint(moduleId, index, value) {
    const m = this.data.checkpoints[moduleId] || {};
    m[index] = value ?? !m[index];
    this.data.checkpoints[moduleId] = m;
    this.save(); this._emit();
  }

  checkpointsFor(moduleId) { return this.data.checkpoints[moduleId] || {}; }

  /* -------------------------------------------------------------- practice  */

  addPracticeTime(ms) {
    if (!ms || ms < 0) return;
    this.data.practice.totalMs += ms;

    const today = new Date().toISOString().slice(0, 10);
    const last = this.data.practice.lastPracticeDay;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      this.data.practice.streak = last === yesterday ? (this.data.practice.streak || 0) + 1 : 1;
      this.data.practice.lastPracticeDay = today;
    }
    this.save();
  }

  /* -------------------------------------------------------------- settings  */

  set(key, value) {
    this.data.settings[key] = value;
    this.save(); this._emit();
  }

  get(key) { return this.data.settings[key]; }

  getDifficultyOverride(lessonId, stepIndex) {
    return this.data.difficultyOverrides[lessonId]?.[stepIndex] || null;
  }

  setDifficultyOverride(lessonId, stepIndex, level, html) {
    if (!this.data.difficultyOverrides[lessonId]) this.data.difficultyOverrides[lessonId] = {};
    this.data.difficultyOverrides[lessonId][stepIndex] = { level, html };
    this.save();
  }

  /* ------------------------------------------------------------- reporting  */

  /** Fraction of a module's lessons marked complete, 0..1. */
  moduleProgress(module) {
    const ids = module.lessons.map((l) => l.id);
    if (!ids.length) return 0;
    const done = ids.filter((id) => this.isLessonComplete(id)).length;
    return done / ids.length;
  }

  levelProgress(level) {
    const mods = level.modules;
    if (!mods.length) return 0;
    return mods.reduce((sum, m) => sum + this.moduleProgress(m), 0) / mods.length;
  }

  /** Erases progress records only — display/audio/MIDI preferences survive a reset. */
  reset() {
    this.data = { ...EMPTY(), createdAt: this.data.createdAt, settings: this.data.settings };
    this.save(); this._emit();
  }
}

export const store = new Store();
