'use strict';

const { app, BrowserWindow, ipcMain, session, shell } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const { detectAndListModels, providerById, pickAuto } = require('./ai-providers.js');

const PROGRESS_FILE = () => path.join(app.getPath('userData'), 'progress.json');

// Deliberately separate from progress.json: that file is user-visible via
// Settings' "reveal" button, wiped by store.reset(), and dumped whole by
// tools/smoke-electron.mjs. An API key has no business in any of those paths.
const AI_CONFIG_FILE = () => path.join(app.getPath('userData'), 'ai-config.json');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#0f1117',
    show: false,
    title: 'DDW Academy',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Renderer runs only local files; no remote content is ever loaded.
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  win.once('ready-to-show', () => win.show());

  // Any attempt to open an external link goes to the system browser, never
  // into an Electron window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

/**
 * The app was renamed from "Keyboard Conservatory" to "DDW Academy". Electron
 * derives userData from productName, so this rename alone would silently
 * strand every existing learner's progress.json in the old profile folder.
 * One-time, non-destructive copy (never a move — the legacy file is left
 * untouched) into the new profile the first time the renamed build runs.
 */
async function migrateLegacyProgress() {
  const newFile = PROGRESS_FILE();
  try {
    await fs.access(newFile);
    return; // this profile already has its own progress; nothing to do
  } catch { /* fall through to migration */ }

  const legacyFile = path.join(path.dirname(app.getPath('userData')), 'Keyboard Conservatory', 'progress.json');
  try {
    await fs.mkdir(path.dirname(newFile), { recursive: true });
    await fs.copyFile(legacyFile, newFile);
    console.log('migrated progress from legacy "Keyboard Conservatory" profile');
  } catch { /* no legacy profile found — fresh install, nothing to migrate */ }
}

app.whenReady().then(async () => {
  // Web MIDI in Electron requires an explicit permission grant. We only ever
  // grant 'midi'/'midiSysex' — everything else (camera, geolocation, ...) is
  // denied outright.
  session.defaultSession.setPermissionRequestHandler((_wc, permission, cb) => {
    cb(permission === 'midi' || permission === 'midiSysex');
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission) => {
    return permission === 'midi' || permission === 'midiSysex';
  });

  await migrateLegacyProgress();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* ---------------------------------------------------------------- progress */
/* Progress lives in userData, not next to the app, so reinstalling or
   rebuilding the app never wipes the learner's history.                     */

ipcMain.handle('progress:load', async () => {
  try {
    return JSON.parse(await fs.readFile(PROGRESS_FILE(), 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('progress load failed:', err);
    return null;
  }
});

ipcMain.handle('progress:save', async (_evt, data) => {
  const file = PROGRESS_FILE();
  const tmp = `${file}.tmp`;
  try {
    await fs.mkdir(path.dirname(file), { recursive: true });
    // Write-then-rename: a crash mid-write can never truncate existing progress.
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tmp, file);
    return { ok: true };
  } catch (err) {
    console.error('progress save failed:', err);
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('progress:reveal', async () => {
  shell.showItemInFolder(PROGRESS_FILE());
});

ipcMain.handle('app:info', () => ({
  version: app.getVersion(),
  electron: process.versions.electron,
  chrome: process.versions.chrome,
  dataPath: app.getPath('userData'),
}));

/* -------------------------------------------------------------------- ai -- */
/* Every network call for AI features happens HERE, in the main process, never
   in the renderer — that's what lets index.html's CSP stay `connect-src
   'self'` completely untouched. The renderer sends a prompt over IPC and
   gets text back; it never sees the API key. See src/main/ai-providers.js
   for the actual provider adapters (detect/list/complete). */

function maskKey(key) {
  if (!key || key.length < 8) return '••••';
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

async function loadAiConfig() {
  try {
    return JSON.parse(await fs.readFile(AI_CONFIG_FILE(), 'utf8'));
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('ai-config load failed:', err);
    return null;
  }
}

async function saveAiConfig(cfg) {
  const file = AI_CONFIG_FILE();
  const tmp = `${file}.tmp`;
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(tmp, JSON.stringify(cfg, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

ipcMain.handle('ai:status', async () => {
  const cfg = await loadAiConfig();
  if (!cfg) return { configured: false };
  return {
    configured: true,
    provider: cfg.provider,
    label: cfg.label,
    maskedKey: maskKey(cfg.key),
    model: cfg.model || 'auto',
    models: cfg.models || [],
    updatedAt: cfg.updatedAt,
  };
});

ipcMain.handle('ai:setKey', async (_evt, key) => {
  const trimmed = String(key || '').trim();
  if (!trimmed) return { ok: false, error: 'Empty key' };
  try {
    const { provider, label, models } = await detectAndListModels(trimmed);
    const cfg = { provider, label, key: trimmed, model: 'auto', models, updatedAt: new Date().toISOString() };
    await saveAiConfig(cfg);
    return { ok: true, provider, label, model: 'auto', models };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('ai:setModel', async (_evt, modelId) => {
  const cfg = await loadAiConfig();
  if (!cfg) return { ok: false, error: 'No key configured' };
  if (modelId !== 'auto' && !(cfg.models || []).some((m) => m.id === modelId)) {
    return { ok: false, error: `"${modelId}" is not in this key's verified model list` };
  }
  cfg.model = modelId;
  await saveAiConfig(cfg);
  return { ok: true };
});

ipcMain.handle('ai:testModel', async (_evt, modelId) => {
  const cfg = await loadAiConfig();
  if (!cfg) return { ok: false, error: 'No key configured' };
  const provider = providerById(cfg.provider);
  if (!provider) return { ok: false, error: `Unknown provider "${cfg.provider}"` };
  const target = modelId === 'auto' || !modelId ? pickAuto(cfg.models || [], 'fast') : modelId;
  if (!target) return { ok: false, error: 'No model to test' };
  try {
    const { text } = await provider.complete(cfg.key, target, {
      messages: [{ role: 'user', content: 'Reply with exactly one word: OK' }],
      maxTokens: 8,
    });
    return { ok: true, model: target, text };
  } catch (err) {
    return { ok: false, model: target, error: err.message };
  }
});

ipcMain.handle('ai:clear', async () => {
  try {
    await fs.unlink(AI_CONFIG_FILE());
  } catch (err) {
    if (err.code !== 'ENOENT') return { ok: false, error: String(err) };
  }
  return { ok: true };
});

/**
 * The general-purpose completion call every AI feature (depth escape hatch,
 * future drill generation, etc) routes through.
 *   task  'fast' | 'deep' — only consulted when the saved model is 'auto',
 *         to pick a size tier from within THIS key's own verified model list
 */
ipcMain.handle('ai:complete', async (_evt, { system, messages, task = 'fast', maxTokens } = {}) => {
  const cfg = await loadAiConfig();
  if (!cfg) return { ok: false, error: 'No AI provider configured — add a key in Settings' };
  const provider = providerById(cfg.provider);
  if (!provider) return { ok: false, error: `Unknown provider "${cfg.provider}"` };
  if (!Array.isArray(messages) || !messages.length) return { ok: false, error: 'No messages provided' };

  const model = !cfg.model || cfg.model === 'auto' ? pickAuto(cfg.models || [], task) : cfg.model;
  if (!model) return { ok: false, error: 'No usable model available for this key' };

  try {
    const { text } = await provider.complete(cfg.key, model, { system, messages, maxTokens });
    return { ok: true, text, provider: cfg.provider, model };
  } catch (err) {
    return { ok: false, error: err.message, provider: cfg.provider, model };
  }
});

ipcMain.handle('ai:rewriteSection', async (_evt, text, level) => {
  const cfg = await loadAiConfig();
  if (!cfg) return { ok: false, error: 'No AI provider configured' };
  const provider = providerById(cfg.provider);
  if (!provider) return { ok: false, error: `Unknown provider "${cfg.provider}"` };
  
  const model = !cfg.model || cfg.model === 'auto' ? pickAuto(cfg.models || [], 'deep') : cfg.model;
  if (!model) return { ok: false, error: 'No usable model available' };

  const system = `You are an expert music production and piano instructor. 
Your task is to rewrite the provided lesson content to perfectly suit a student at the [${level}] level.
- Keep all core facts, terminology, and instructional goals from the original text.
- Adjust vocabulary, pacing, analogies, and depth for the target audience.
- For "Layman" or "Beginner", use highly relatable analogies, simpler sentences, and avoid unexplained jargon.
- For "Advanced", "Professional", or "Expert", use precise technical terminology, theoretical depth, and professional context.
- Output ONLY the raw HTML string representing the rewritten content. Do not include markdown formatting, backticks, or any conversational text. Keep the same HTML tags as the input (<p>, <strong>, etc) as much as possible.`;

  const messages = [{ role: 'user', content: text }];

  try {
    const response = await provider.complete(cfg.key, model, { system, messages, maxTokens: 2000 });
    let rewritten = response.text.trim();
    if (rewritten.startsWith('\`\`\`html')) rewritten = rewritten.replace(/^\`\`\`html\s*/, '').replace(/\s*\`\`\`$/, '');
    if (rewritten.startsWith('\`\`\`')) rewritten = rewritten.replace(/^\`\`\`\s*/, '').replace(/\s*\`\`\`$/, '');
    return { ok: true, text: rewritten };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});
