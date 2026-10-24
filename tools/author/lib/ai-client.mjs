/**
 * ai-client.mjs — Node-side AI access for the authoring pipeline.
 *
 * tools/author/ runs as a standalone Node script, outside Electron, so it
 * has no window.ai bridge and no access to app.getPath('userData'). It
 * reuses the exact same provider adapters as the running app
 * (src/main/ai-providers.js — plain CommonJS using only Node's built-in
 * fetch, no Electron API, so it works unmodified here) and reads the same
 * ai-config.json Settings writes, at Electron's default Windows userData
 * path for this app. One key, one place it's configured, both paths to it.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { providerById, pickAuto } = require('../../../src/main/ai-providers.js');

function aiConfigPath() {
  const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
  return path.join(appData, 'DDW Academy', 'ai-config.json');
}

let _cfg = null;
export function loadAiConfig({ force = false } = {}) {
  if (_cfg && !force) return _cfg;
  const file = aiConfigPath();
  if (!fs.existsSync(file)) {
    throw new Error(`No AI key configured. Open the app, add a key in Settings > AI Assistant, then re-run. (looked for ${file})`);
  }
  _cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  return _cfg;
}

/**
 * @param {object} opts
 * @param {string} [opts.system]
 * @param {{role:string, content:string}[]} opts.messages
 * @param {'fast'|'deep'} [opts.task='fast']
 * @param {number} [opts.maxTokens=2000]
 * @returns {Promise<{ok:boolean, text?:string, error?:string, provider?:string, model?:string}>}
 */
export async function complete({ system, messages, task = 'fast', maxTokens = 2000 } = {}) {
  const cfg = loadAiConfig();
  const provider = providerById(cfg.provider);
  if (!provider) return { ok: false, error: `Unknown provider "${cfg.provider}"` };
  const model = !cfg.model || cfg.model === 'auto' ? pickAuto(cfg.models || [], task) : cfg.model;
  if (!model) return { ok: false, error: 'No usable model available for this key' };
  try {
    const { text } = await provider.complete(cfg.key, model, { system, messages, maxTokens });
    return { ok: true, text, provider: cfg.provider, model };
  } catch (err) {
    return { ok: false, error: err.message, provider: cfg.provider, model };
  }
}

/**
 * Ask for JSON back. No provider-specific structured-output mode is used —
 * that would mean three different code paths to keep in sync (Anthropic
 * tool-use, Google responseSchema, OpenAI-shape json_object) for a pipeline
 * that already retries. Instead: instruct plainly, parse, and on a parse
 * failure retry once with the parser's own error message appended — a
 * portable pattern that works identically across every provider.
 */
export async function completeJson(opts) {
  const jsonInstruction = '\n\nRespond with ONLY a single JSON object — no markdown code fences, no prose before or after, no trailing commas.';
  let system = (opts.system || '') + jsonInstruction;
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await complete({ ...opts, system: attempt === 0 ? system : `${system}\n\nYour previous reply failed to parse as JSON: ${lastErr}. Fix it and reply again.` });
    if (!res.ok) return res;
    const cleaned = res.text.trim().replace(/^```(?:json)?\n?/, '').replace(/```$/, '').trim();
    try {
      return { ok: true, json: JSON.parse(cleaned), provider: res.provider, model: res.model, raw: res.text };
    } catch (err) {
      lastErr = err.message;
    }
  }
  return { ok: false, error: `Model did not return parseable JSON after 2 attempts: ${lastErr}` };
}
