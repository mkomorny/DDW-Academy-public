/**
 * End-to-end smoke test against the PACKAGED app over the Chrome DevTools
 * Protocol. Verifies the things that can only be checked inside Electron:
 * the preload bridge, progress persistence via IPC, and the MIDI permission
 * grant.
 *
 * This test writes and deletes real progress records (lessons, quizzes,
 * drills, tiers) as part of its run, so it must NOT be pointed at your real
 * profile. Launch the app with an isolated, throwaway userData dir:
 *
 *   electron . --remote-debugging-port=9333 --user-data-dir=<some temp dir>
 *   node tools/smoke-electron.mjs
 *
 * The script refuses to run against the default userData directory unless
 * SMOKE_ALLOW_REAL_USERDATA=1 is set, as a backstop in case the app was
 * launched without --user-data-dir.
 */

const PORT = process.argv[2] || 9333;

const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page = targets.find((t) => t.type === 'page');
if (!page) { console.error('No page target found — is the app running?'); process.exit(1); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();

ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});

const send = (method, params = {}) => new Promise((resolve) => {
  const myId = ++id;
  pending.set(myId, resolve);
  ws.send(JSON.stringify({ id: myId, method, params }));
});

/** Evaluate an async expression in the page and return its resolved value. */
async function evaluate(expression) {
  const res = await send('Runtime.evaluate', {
    expression, awaitPromise: true, returnByValue: true,
  });
  if (res.result?.exceptionDetails) {
    throw new Error(res.result.exceptionDetails.exception?.description || 'eval threw');
  }
  return res.result?.result?.value;
}

await new Promise((r) => ws.addEventListener('open', r));

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
};

try {
  // 1. Preload bridge exists and is narrow.
  const bridge = await evaluate(`JSON.stringify(Object.keys(window.conservatory || {}))`);
  check('preload bridge exposed', bridge && JSON.parse(bridge).length === 4, bridge);

  // 2. Node globals must NOT be reachable from the renderer.
  const leaked = await evaluate(`typeof require + '/' + typeof process + '/' + typeof module`);
  check('no node leakage into renderer', leaked === 'undefined/undefined/undefined', leaked);

  // 3. App info over IPC.
  const info = await evaluate(`window.conservatory.appInfo().then(i => JSON.stringify(i))`);
  check('IPC appInfo round-trip', Boolean(info), info);
  const dataPath = JSON.parse(info || '{}').dataPath;

  // Refuse to run destructive steps against the app's real userData folder.
  // Default userData is "<...>/DDW Academy"; --user-data-dir overrides
  // it to something else entirely, so this only trips when isolation was skipped.
  const looksLikeRealProfile = /[\\/]DDW Academy$/i.test((dataPath || '').replace(/[\\/]+$/, ''));
  if (looksLikeRealProfile && process.env.SMOKE_ALLOW_REAL_USERDATA !== '1') {
    throw new Error(
      `refusing to run: this looks like the real userData profile (${dataPath}). ` +
      `Relaunch the app with --user-data-dir=<temp dir> for smoke testing, or set ` +
      `SMOKE_ALLOW_REAL_USERDATA=1 if you are certain this is intentional.`);
  }

  // 4. Course + scale data loaded.
  const stats = await evaluate(
    `import('./course/index.js').then(m => JSON.stringify(m.COURSE_STATS))`);
  check('course data loaded', Boolean(stats), stats);
  const nScales = await evaluate(
    `import('./lib/theory.js').then(m => m.loadScales()).then(s => s.length)`);
  check('scale library loaded', nScales >= 60, `${nScales} scales`);

  // 5. Progress persistence: write, flush, read back.
  await evaluate(`import('./lib/store.js').then(async ({store}) => {
    store.markLessonComplete('l0-1-1');
    store.recordQuiz('smoke-test', 8, 10);
    store.recordDrill('smoke-drill', { score: 5, total: 5, elapsedMs: 30000 });
    await store.flush();
  })`);
  const readBack = await evaluate(
    `window.conservatory.loadProgress().then(p => JSON.stringify({
       lesson: Boolean(p?.lessons?.['l0-1-1']?.completedAt),
       quiz: p?.quizzes?.['smoke-test']?.best,
       drill: p?.drills?.['smoke-drill']?.best,
       practiceMs: p?.practice?.totalMs
     }))`);
  const rb = JSON.parse(readBack || '{}');
  check('progress persisted to disk via IPC',
    rb.lesson === true && rb.quiz === 80 && rb.drill === 100 && rb.practiceMs >= 30000, readBack);

  // 6. MIDI permission is actually granted by the main process.
  const midi = await evaluate(
    `navigator.requestMIDIAccess({sysex:false}).then(a => 'granted:' + a.inputs.size)
      .catch(e => 'denied:' + e.name)`);
  check('Web MIDI permission granted', String(midi).startsWith('granted'), String(midi));

  // 7. Audio engine initialises.
  const audio = await evaluate(
    `import('./lib/audio.js').then(({instrument}) => { instrument.ensure(); return instrument.ctx.state; })`);
  check('AudioContext created', ['running', 'suspended'].includes(audio), audio);

  // 7b. Instrument switching: a switch preserves the AudioContext/master
  // identity the Metronome depends on, persists via the store, and LRU
  // eviction keeps at most 3 decoded banks resident with the pinned piano
  // always among them.
  const instTest = await evaluate(`(async () => {
    const { instrument } = await import('./lib/audio.js');
    const ctxBefore = instrument.ctx;
    const masterBefore = instrument.master;
    const ok1 = await instrument.setInstrument('violin');
    const ctxSame = instrument.ctx === ctxBefore;
    const masterSame = instrument.master === masterBefore;
    const violinReady = instrument.banks.get('violin')?.ready === true;

    const { store } = await import('./lib/store.js');
    store.set('instrument', 'violin');
    await store.flush();
    const saved = (await window.conservatory.loadProgress())?.settings?.instrument;

    for (const id of ['cello', 'flute', 'trumpet', 'organ', 'harp', 'xylophone']) {
      await instrument.setInstrument(id);
    }
    const resident = [...instrument.banks.entries()].filter(([, b]) => b.ready).map(([id]) => id);

    await instrument.setInstrument('piano');
    store.set('instrument', 'piano');
    await store.flush();

    return JSON.stringify({
      ok1, ctxSame, masterSame, violinReady, saved,
      residentCount: resident.length, pianoStillResident: resident.includes('piano'),
    });
  })()`);
  const it = JSON.parse(instTest || '{}');
  check('instrument switch: violin loads, ctx/master identity preserved',
    it.ok1 === true && it.ctxSame === true && it.masterSame === true && it.violinReady === true, instTest);
  check('instrument choice persists via store', it.saved === 'violin', instTest);
  check('bank eviction: at most 3 resident, piano stays resident',
    it.residentCount <= 3 && it.pianoStillResident === true, instTest);

  // 8. Navigate every top-level route in the real app.
  const nav = await evaluate(`(async () => {
    const m = await import('./app.js');
    const errs = [];
    const oe = console.error; console.error = (...a) => { errs.push(a.map(String).join(' ')); oe(...a); };
    for (const r of ['home','learn','practice','games','reference','settings']) {
      m.go(r); await new Promise(r2 => setTimeout(r2, 80));
    }
    m.go('home');
    console.error = oe;
    return JSON.stringify({ errors: errs.length, detail: errs.slice(0,3) });
  })()`);
  const navR = JSON.parse(nav || '{}');
  check('all routes render without errors', navR.errors === 0, nav);

  // 9. Theme system: all themes load, applying one is a single attribute
  //    write, and the choice survives a flush to disk.
  const themes = await evaluate(`(async () => {
    const t = await import('./lib/themes.js');
    const list = await t.loadThemes();
    t.applyTheme('synthwave');
    const applied = document.documentElement.getAttribute('data-theme');
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    const line = getComputedStyle(document.documentElement).getPropertyValue('--line').trim();
    const { store } = await import('./lib/store.js');
    await store.flush();
    const saved = (await window.conservatory.loadProgress())?.settings?.colorTheme;
    t.applyTheme('conservatory');
    const cleared = document.documentElement.getAttribute('data-theme');
    await store.flush();
    return JSON.stringify({ count: list.length, applied, bg, lineResolved: /^(rgb|color|#)/i.test(line), saved, cleared });
  })()`);
  const th = JSON.parse(themes || '{}');
  check('theme system: load, apply, persist',
    th.count === 148 && th.applied === 'synthwave' && th.bg === '#0c0a18'
    && th.lineResolved && th.saved === 'synthwave' && th.cleared === null, themes);

  // 10. Drill tiers: advancement, unlock retention and manual reset.
  const tiers = await evaluate(`(async () => {
    const { store } = await import('./lib/store.js');
    store.resetTiers('smoke-tier');
    for (let i = 0; i < 10; i++) store.recordTierAnswer('smoke-tier', true);
    const afterTen = { ...store.tier('smoke-tier') };
    store.selectTier('smoke-tier', 1);
    const afterPick = { ...store.tier('smoke-tier') };
    await store.flush();
    const saved = (await window.conservatory.loadProgress())?.drillTiers?.['smoke-tier'];
    store.resetTiers('smoke-tier');
    await store.flush();
    return JSON.stringify({ afterTen, afterPick, savedUnlocked: saved?.unlocked, afterReset: store.tier('smoke-tier') });
  })()`);
  const ti = JSON.parse(tiers || '{}');
  check('drill tiers: advance, retain unlock, reset',
    ti.afterTen?.selected === 2 && ti.afterTen?.unlocked === 2
    && ti.afterPick?.selected === 1 && ti.afterPick?.unlocked === 2
    && ti.savedUnlocked === 2 && ti.afterReset?.unlocked === 1, tiers);

  // 11. Clean up the smoke-test records so the user starts fresh.
  //    Note: flush() is a no-op unless the store is marked dirty, and mutating
  //    store.data directly bypasses the setters that do that — so call save()
  //    to mark it, then flush.
  await evaluate(`import('./lib/store.js').then(async ({store}) => {
    delete store.data.quizzes['smoke-test'];
    delete store.data.drills['smoke-drill'];
    delete store.data.lessons['l0-1-1'];
    store.data.practice.totalMs = 0;
    store.data.practice.streak = 0;
    store.data.practice.lastPracticeDay = null;
    delete store.data.drillTiers['smoke-tier'];
    store.data.settings.colorTheme = 'conservatory';
    store.save();
    await store.flush();
  })`);
  const cleaned = await evaluate(
    `window.conservatory.loadProgress().then(p => JSON.stringify({
      lessons: Object.keys(p.lessons||{}).length,
      quizzes: Object.keys(p.quizzes||{}).length,
      drills: Object.keys(p.drills||{}).length,
      ms: p.practice?.totalMs }))`);
  check('smoke-test records cleaned up', JSON.parse(cleaned).lessons === 0, cleaned);

  console.log(`\nuserData: ${dataPath}`);
} catch (err) {
  console.error('smoke test error:', err.message);
  results.push({ name: 'harness', ok: false });
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
ws.close();
process.exit(failed ? 1 : 0);
