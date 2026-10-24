/**
 * index.js — combines every curriculum track into one course object and
 * derives the lookup tables the views need.
 *
 * Multi-track model
 * ------------------
 * Each track is `{ id, title, levels, gates }` — the same level/module/lesson
 * shape a single track always had, just namespaced. Lesson, module and level
 * ids stay globally unique across tracks by convention (piano ids are
 * unprefixed and untouched; every other track prefixes its ids, e.g.
 * `drums-l1-1-1`), which is what lets `moduleById`/`lessonById`/`levelById`
 * stay simple global lookups instead of needing a trackId threaded through
 * every call site, and is what makes adding a track a zero-migration change
 * to anyone's saved progress.json.
 *
 * `LEVELS`/`GATES` are kept as a back-compat shim equal to the piano track's
 * data — existing single-track call sites keep working unchanged. New
 * track-aware code should prefer `trackById(id).levels` or `activeTrack()`.
 */

import { LEVELS as PIANO_LEVELS, GATES as PIANO_GATES } from './piano/index.js';
import { LEVELS as DRUMS_LEVELS, GATES as DRUMS_GATES } from './drums/index.js';
import { LEVELS as ABLETON_LEVELS, GATES as ABLETON_GATES } from './ableton/index.js';
import { LEVELS as LAUNCHKEY_LEVELS, GATES as LAUNCHKEY_GATES } from './launchkey/index.js';
import { LEVELS as SOUND_LEVELS, GATES as SOUND_GATES } from './sounddesign/index.js';
import { LEVELS as PRODUCTION_LEVELS, GATES as PRODUCTION_GATES } from './production/index.js';
import { LEVELS as DJING_LEVELS, GATES as DJING_GATES } from './djing/index.js';
import { LEVELS as M4L_LEVELS, GATES as M4L_GATES } from './m4l/index.js';
import { LEVELS as NOTE_LEVELS, GATES as NOTE_GATES } from './note/index.js';
import { LEVELS as BASS_LEVELS, GATES as BASS_GATES } from './bassstation/index.js';
import { LEVELS as KOMPLETE_LEVELS, GATES as KOMPLETE_GATES } from './komplete/index.js';
import { LEVELS as SPATIAL_LEVELS, GATES as SPATIAL_GATES } from './spatial/index.js';
import { LEVELS as DSP_LEVELS, GATES as DSP_GATES } from './dsp/index.js';
import { LEVELS as AI_LEVELS, GATES as AI_GATES } from './ai/index.js';

export const TRACKS = [
  { id: 'piano', title: 'Piano Playing for Beginners', levels: PIANO_LEVELS, gates: PIANO_GATES },
  { id: 'drums', title: 'Drums & Rhythm Programming', levels: DRUMS_LEVELS, gates: DRUMS_GATES },
  { id: 'ableton', title: 'Mastering Ableton Live 12', levels: ABLETON_LEVELS, gates: ABLETON_GATES },
  { id: 'launchkey', title: 'Learning the Launchkey MK4 61', levels: LAUNCHKEY_LEVELS, gates: LAUNCHKEY_GATES },
  { id: 'sounddesign', title: 'Sound Design Foundations', levels: SOUND_LEVELS, gates: SOUND_GATES },
  { id: 'production', title: 'Foundations of Music Production', levels: PRODUCTION_LEVELS, gates: PRODUCTION_GATES },
  { id: 'djing', title: 'Foundations of DJ\'ing', levels: DJING_LEVELS, gates: DJING_GATES },
  // Bonus mini-courses
  { id: 'm4l', title: 'Building Max for Live Devices', levels: M4L_LEVELS, gates: M4L_GATES },
  { id: 'note', title: 'Ableton Note: Mobile Production', levels: NOTE_LEVELS, gates: NOTE_GATES },
  { id: 'bassstation', title: 'Novation Bass Station II', levels: BASS_LEVELS, gates: BASS_GATES },
  { id: 'komplete', title: 'NI Komplete Kontrol', levels: KOMPLETE_LEVELS, gates: KOMPLETE_GATES },
  { id: 'spatial', title: 'Spatial Audio & Dolby Atmos', levels: SPATIAL_LEVELS, gates: SPATIAL_GATES },
  { id: 'dsp', title: 'Audio DSP Fundamentals', levels: DSP_LEVELS, gates: DSP_GATES },
  { id: 'ai', title: 'AI Tools for Music Production', levels: AI_LEVELS, gates: AI_GATES },
  // append here — each just needs { id, title, levels, gates }.
];

export const DEFAULT_TRACK_ID = TRACKS[0].id;
export const trackById = (id) => TRACKS.find((t) => t.id === id) || TRACKS[0];

/** Back-compat shim: existing imports of LEVELS/GATES transparently get the piano track. */
export const LEVELS = PIANO_LEVELS;
export const GATES = PIANO_GATES;

/* Flat lookups spanning every track, built once at load. Every module,
   lesson, quiz and exercise carries a `trackId` alongside its existing
   levelId/moduleId, so per-track filtering is a plain array filter. */
export const ALL_LEVELS = TRACKS.flatMap((t) => t.levels.map((lv) => ({ ...lv, trackId: t.id })));

export const ALL_MODULES = TRACKS.flatMap((t) =>
  t.levels.flatMap((lv) => lv.modules.map((m) => ({ ...m, trackId: t.id, levelId: lv.id, levelNumber: lv.number }))));
export const ALL_LESSONS = ALL_MODULES.flatMap((m) =>
  m.lessons.map((s) => ({ ...s, trackId: m.trackId, moduleId: m.id, moduleCode: m.code, levelId: m.levelId })));
export const ALL_QUIZZES = ALL_MODULES.filter((m) => m.quiz)
  .map((m) => ({ ...m.quiz, trackId: m.trackId, moduleId: m.id, moduleCode: m.code }));
export const ALL_EXERCISES = ALL_MODULES.flatMap((m) =>
  (m.exercises || []).map((e) => ({ ...e, trackId: m.trackId, moduleId: m.id, moduleCode: m.code })));

/* Global lookups. Safe across tracks because ids are unique by convention
   (see the file header) — a track-scoped lookup would need the same
   uniqueness check anyway, so there is nothing a trackId parameter would add
   here except call-site noise. */
export const moduleById = (id) => ALL_MODULES.find((m) => m.id === id) || null;
export const levelById = (id) => ALL_LEVELS.find((l) => l.id === id) || null;
export const lessonById = (id) => ALL_LESSONS.find((l) => l.id === id) || null;

/** Back-compat: the full cross-track lesson order. Prefer adjacentLessons(), which is per-track. */
export const LESSON_ORDER = ALL_LESSONS.map((l) => l.id);

const LESSON_ORDER_BY_TRACK = new Map(
  TRACKS.map((t) => [t.id, ALL_LESSONS.filter((l) => l.trackId === t.id).map((l) => l.id)])
);

/**
 * Previous/next lesson within the SAME track. Deliberately does not fall
 * through to a cross-track order — without this, "next lesson" after the
 * last lesson of one track would silently continue into another track's
 * first lesson, which is not a sequence a learner ever asked to follow.
 */
export function adjacentLessons(lessonId) {
  const lsn = lessonById(lessonId);
  const order = lsn ? LESSON_ORDER_BY_TRACK.get(lsn.trackId) || [] : [];
  const i = order.indexOf(lessonId);
  return {
    prev: i > 0 ? lessonById(order[i - 1]) : null,
    next: i >= 0 && i < order.length - 1 ? lessonById(order[i + 1]) : null,
  };
}

/**
 * Resolve `depth` wrapper blocks — `{ type:'depth', plain?, standard, technical? }`
 * — into a plain block array for one register. A block list with no `depth`
 * wrappers passes through unchanged, so this is always safe to call.
 *
 * `register: 'all'` concatenates every branch present instead of picking one
 * — used by flatBlocks()/sourceIndex() so a citation that only appears in the
 * Technical branch of a step still shows up in the course-wide source index.
 */
export function resolveDepth(blocks, register = 'standard') {
  const out = [];
  for (const b of blocks) {
    if (!b || b.type !== 'depth') { out.push(b); continue; }
    if (register === 'all') {
      out.push(...(b.plain || []), ...(b.standard || []), ...(b.technical || []));
    } else {
      out.push(...(b[register] || b.standard || []));
    }
  }
  return out;
}

/**
 * A lesson's blocks with any `step` wrappers flattened away.
 *
 * Lessons are authored as steps, so a `sources` (or any other) block usually
 * lives one level down inside a step rather than directly on the lesson. Any
 * code that scans a lesson for block types must go through this, or it will
 * silently find nothing — which is exactly what happened to the source index
 * when steps were introduced. `depth` wrappers (which by rule only ever
 * appear inside a step, never at lesson top level) are resolved with
 * register 'all' for the same reason: a scan must never miss a citation just
 * because it lives in a register the reader isn't currently viewing.
 */
export function flatBlocks(lesson) {
  return (lesson.blocks || []).flatMap((b) => (b.type === 'step' ? resolveDepth(b.blocks, 'all') : [b]));
}

/** The step sections of a lesson, or [] if it is not authored as steps. */
export const lessonSteps = (lesson) => (lesson.blocks || []).filter((b) => b.type === 'step');

/**
 * Every source PDF referenced anywhere in the course, with its modules.
 * Pass a trackId to scope the index to one track (e.g. for a per-track
 * document count on that track's dashboard); omit it for the course-wide
 * index.
 */
export function sourceIndex(trackId) {
  const map = new Map();
  for (const m of ALL_MODULES) {
    if (trackId && m.trackId !== trackId) continue;
    for (const f of m.sources || []) {
      if (!map.has(f)) map.set(f, new Set());
      map.get(f).add(m.code);
    }
    for (const lsn of m.lessons) {
      for (const b of flatBlocks(lsn)) {
        if (b.type === 'sources') {
          for (const f of b.files) {
            if (!map.has(f)) map.set(f, new Set());
            map.get(f).add(m.code);
          }
        }
      }
    }
  }
  return [...map.entries()]
    .map(([file, mods]) => ({ file, modules: [...mods].sort() }))
    .sort((a, b) => a.file.localeCompare(b.file));
}

function statsFor(lessons, modules, quizzes, exercises, levels) {
  const steps = lessons.flatMap((l) => lessonSteps(l));
  return {
    levels: levels.length,
    modules: modules.length,
    lessons: lessons.length,
    sections: steps.length,
    checks: steps.filter((s) => s.check).length,
    quizzes: quizzes.length,
    questions: quizzes.reduce((n, q) => n + q.questions.length, 0),
    exercises: exercises.length,
    minutes: lessons.reduce((n, l) => n + (l.minutes || 10), 0),
  };
}

/** Course-wide totals across every track. */
export const COURSE_STATS = statsFor(ALL_LESSONS, ALL_MODULES, ALL_QUIZZES, ALL_EXERCISES, TRACKS.flatMap((t) => t.levels));

/** Stats scoped to a single track, e.g. for a per-track dashboard card. */
export const trackStats = (trackId) => statsFor(
  ALL_LESSONS.filter((l) => l.trackId === trackId),
  ALL_MODULES.filter((m) => m.trackId === trackId),
  ALL_QUIZZES.filter((q) => q.trackId === trackId),
  ALL_EXERCISES.filter((e) => e.trackId === trackId),
  trackById(trackId).levels
);
