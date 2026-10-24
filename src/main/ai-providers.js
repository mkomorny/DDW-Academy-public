'use strict';

/**
 * ai-providers.js — one adapter per AI provider: detect, list real models,
 * complete. Runs entirely in the MAIN process. This is the point of the
 * whole design: the renderer's CSP stays `connect-src 'self'` untouched (see
 * index.html) because network calls never originate there — the renderer
 * only ever sends a prompt over IPC and gets text back; the API key never
 * crosses into the renderer at all.
 *
 * "Detect the provider" is implemented as "try it against the provider's own
 * models endpoint and see if it authenticates" — prefix hints only decide
 * try-order, never the final answer. That's what makes "the options listed
 * really work" true: a model never appears in the list unless this exact key
 * just successfully listed it from the provider's own API.
 */

// Model-list calls and a Settings "Test" probe are quick — 15s is generous
// for those. A real completion is not: caught live, a full multi-step
// lesson draft (deep-tier model, thousands of output tokens) legitimately
// takes 30-90s, and the default timeout aborted it mid-generation every
// time. complete() accepts its own timeoutMs per call; listModels() keeps
// the short default since it's always a quick, bounded request.
// 120s was still too short for at least one real deep-tier model (xAI's
// grok-4.6 measured at 177s for an 8000-token structured draft) — caught
// live authoring the drums-l1-1-1 pilot lesson.
const DEFAULT_TIMEOUT_MS = 15000;
const COMPLETE_TIMEOUT_MS = 240000;

async function fetchJson(url, opts = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOpts } = opts;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...fetchOpts, signal: controller.signal });
    const text = await res.text();
    let body;
    try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
    if (!res.ok) {
      const msg = body?.error?.message || body?.error || body?.raw || `HTTP ${res.status}`;
      const err = new Error(typeof msg === 'string' ? msg : JSON.stringify(msg));
      err.status = res.status;
      throw err;
    }
    return body;
  } finally {
    clearTimeout(timer);
  }
}

/** Name patterns that mean "not a general text/chat model" — image/video/
 *  audio/embedding/moderation generators use the same API surface but
 *  aren't useful for the app's text features and would just clutter the list. */
const NON_TEXT_PATTERN = /imagine|voice|tts|transcribe|embed|imagen|veo\d|lyria|dall-e|whisper|moderation|realtime|image-gen|-image$|-image-/i;

/** Rough size tier from a model id/name, for "Auto" routing — smallest match
 *  wins for a 'fast' task hint, largest for 'deep'. Deliberately coarse:
 *  exact model choice varies per account, this only needs to pick a
 *  reasonable relative ordering among whatever this key actually has access to. */
function sizeTier(idOrName) {
  const s = idOrName.toLowerCase();
  // Every pattern is \b-wrapped deliberately: an early version used bare
  // /mini/, which silently matched inside "ge-MINI" — every single Gemini
  // model id contains the substring "mini", so every Gemini model scored as
  // the smallest tier regardless of its real size. Caught live: a real
  // Google key's Auto pick came back as gemini-2.5-computer-use-preview
  // (a zero-quota specialist model) instead of a flash-lite model.
  if (/\b(haiku|flash-lite|mini|nano|lite)\b/.test(s)) return 0;
  if (/\b(flash|small)\b/.test(s)) return 1;
  if (/\b(sonnet|pro|standard)\b/.test(s)) return 2;
  if (/\b(opus|ultra|large|fable|mythos)\b/.test(s)) return 3;
  return 1.5; // unknown — middling default so it doesn't always win or lose
}

// Real, general-purpose chat models that NON_TEXT_PATTERN doesn't (and
// shouldn't) exclude from the visible list, but that Auto should never pick
// for a general text task — a coding-specialist or agentic/tool-use model
// has no size-tier keyword to sort by and would otherwise win by default
// (caught live: xAI's naming has no haiku/flash/opus-style hints at all, so
// every model tied at the default tier and grok-build-0.1, a coding model,
// won 'deep' purely by sorting alphabetically last).
const NARROW_PURPOSE_PATTERN = /\b(build|code|computer-use|robotics|agent)\b/i;

function pickAuto(models, task) {
  if (!models.length) return null;
  const general = models.filter((m) => !NARROW_PURPOSE_PATTERN.test(m.id));
  const pool = general.length ? general : models; // never return null just because every match was narrow-purpose
  const sorted = [...pool].sort((a, b) => sizeTier(a.id) - sizeTier(b.id));
  return task === 'deep' ? sorted[sorted.length - 1].id : sorted[0].id;
}

/* ------------------------------------------------------------ anthropic -- */

const anthropic = {
  id: 'anthropic',
  label: 'Anthropic (Claude)',
  matchesPrefix: (key) => key.startsWith('sk-ant-'),

  async listModels(key) {
    const body = await fetchJson('https://api.anthropic.com/v1/models?limit=1000', {
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    });
    return (body.data || [])
      .map((m) => ({ id: m.id, label: m.display_name || m.id }))
      .sort((a, b) => a.id.localeCompare(b.id));
  },

  async complete(key, model, { system, messages, maxTokens = 400 }) {
    const body = await fetchJson('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      timeoutMs: COMPLETE_TIMEOUT_MS,
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model, max_tokens: maxTokens,
        ...(system ? { system } : {}),
        messages: messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      }),
    });
    const text = (body.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    return { text, raw: body };
  },
};

/* --------------------------------------------------------------- xai ----- */

const xai = {
  id: 'xai',
  label: 'xAI (Grok)',
  matchesPrefix: (key) => key.startsWith('xai-'),

  async listModels(key) {
    const body = await fetchJson('https://api.x.ai/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    return (body.data || [])
      .filter((m) => !NON_TEXT_PATTERN.test(m.id))
      .map((m) => ({ id: m.id, label: m.id }))
      .sort((a, b) => a.id.localeCompare(b.id));
  },

  async complete(key, model, { system, messages, maxTokens = 400 }) {
    const body = await fetchJson('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      timeoutMs: COMPLETE_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model, max_tokens: maxTokens,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          ...messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        ],
      }),
    });
    return { text: body.choices?.[0]?.message?.content || '', raw: body };
  },
};

/* ----------------------------------------------------------- openai ------ */
/* Headroom — no OpenAI key was supplied, but the adapter is real and complete. */

const openai = {
  id: 'openai',
  label: 'OpenAI',
  matchesPrefix: (key) => key.startsWith('sk-') && !key.startsWith('sk-ant-'),

  async listModels(key) {
    const body = await fetchJson('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    return (body.data || [])
      .filter((m) => /^(gpt-|o1|o3|o4|chatgpt)/i.test(m.id) && !NON_TEXT_PATTERN.test(m.id))
      .map((m) => ({ id: m.id, label: m.id }))
      .sort((a, b) => a.id.localeCompare(b.id));
  },

  async complete(key, model, { system, messages, maxTokens = 400 }) {
    const body = await fetchJson('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      timeoutMs: COMPLETE_TIMEOUT_MS,
      headers: { Authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model, max_tokens: maxTokens,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          ...messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        ],
      }),
    });
    return { text: body.choices?.[0]?.message?.content || '', raw: body };
  },
};

/* ------------------------------------------------------------- google ---- */

const google = {
  id: 'google',
  label: 'Google (Gemini)',
  // AI Studio keys are usually 'AIza...'; some accounts issue an 'AQ.'-prefixed
  // token instead (see tools/reference — flagged as possibly a different,
  // maybe shorter-lived credential type). Hint on either; the real test is
  // still the live models-list call below, so a wrong guess just costs one
  // failed probe, never a wrong answer.
  matchesPrefix: (key) => key.startsWith('AIza') || key.startsWith('AQ.'),

  async listModels(key) {
    const body = await fetchJson(
      `https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000&key=${encodeURIComponent(key)}`,
    );
    return (body.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
      .filter((m) => !NON_TEXT_PATTERN.test(m.name))
      .map((m) => ({ id: m.name.replace(/^models\//, ''), label: m.displayName || m.name }))
      .sort((a, b) => a.id.localeCompare(b.id));
  },

  async complete(key, model, { system, messages, maxTokens = 400 }) {
    const modelPath = model.startsWith('models/') ? model : `models/${model}`;
    const body = await fetchJson(
      `https://generativelanguage.googleapis.com/v1beta/${modelPath}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        timeoutMs: COMPLETE_TIMEOUT_MS,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
          contents: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: maxTokens },
        }),
      },
    );
    const text = (body.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
    return { text, raw: body };
  },
};

const PROVIDERS = [anthropic, xai, google, openai];

/**
 * Try to identify which provider a key belongs to by actually calling each
 * provider's models endpoint, prefix-hinted provider first. Returns
 * { provider, models } on the first successful auth, or throws with the
 * per-provider errors attached if every provider rejected the key.
 */
async function detectAndListModels(key) {
  const hinted = PROVIDERS.filter((p) => p.matchesPrefix(key));
  const rest = PROVIDERS.filter((p) => !hinted.includes(p));
  const order = [...hinted, ...rest];

  const attempts = [];
  for (const provider of order) {
    try {
      const models = await provider.listModels(key);
      if (models.length) return { provider: provider.id, label: provider.label, models };
      attempts.push(`${provider.label}: authenticated but returned no usable text models`);
    } catch (err) {
      attempts.push(`${provider.label}: ${err.message}`);
    }
  }
  const err = new Error(`Key didn't work against any known provider.\n${attempts.join('\n')}`);
  err.attempts = attempts;
  throw err;
}

function providerById(id) {
  return PROVIDERS.find((p) => p.id === id) || null;
}

module.exports = { PROVIDERS, detectAndListModels, providerById, pickAuto };
