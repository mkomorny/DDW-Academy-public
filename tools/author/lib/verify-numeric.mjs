/**
 * verify-numeric.mjs — deterministic, no AI call. Extracts every number+unit
 * and notable proper-noun-ish term from a step's prose/callout text and
 * checks each appears (loosely) in the passages that step actually cites.
 * This is what catches the signature failure of a generated production
 * course: an invented BPM range or frequency value that reads perfectly
 * plausibly and is simply wrong.
 */

const NUMERIC_RE = /\b\d+(?:\.\d+)?\s?(?:bpm|hz|khz|db|ms|sec|s\b|semitones?|octaves?|bars?|beats?|steps?|%|percent)\b/gi;
const PROPER_NOUN_RE = /\b[A-Z][a-z]{2,}(?:\s[A-Z][a-z]{2,}){0,2}\b/g;
const STOPWORDS = new Set(['The', 'This', 'That', 'These', 'Those', 'Section', 'Module', 'Level',
  'Note', 'Notes', 'Play', 'Try', 'Listen', 'Chapter', 'Lesson']);

/**
 * A single capitalized word at the START of a sentence is capitalized
 * because it's a sentence, not because it's a proper noun — "Combined with
 * the kick..." isn't a claim about an entity called "Combined". Caught
 * live: the pipeline's first real run flagged "Combined", "Everything",
 * "Finally" and "Building" as unsupported claims purely because each opened
 * a sentence. A multi-word capitalized phrase ("New York", "Drum Rack") is
 * kept regardless of position — that pattern is a genuine proper noun far
 * more often than a coincidence of sentence-initial capitalization.
 */
function extractProperNouns(text) {
  const out = [];
  for (const m of text.matchAll(PROPER_NOUN_RE)) {
    const word = m[0];
    if (STOPWORDS.has(word)) continue;
    const isMultiWord = word.includes(' ');
    const before = text.slice(0, m.index);
    const atSentenceStart = m.index === 0 || /[.!?]\s*$/.test(before) || /\n\s*$/.test(before);
    if (!isMultiWord && atSentenceStart) continue;
    out.push(word);
  }
  return [...new Set(out)];
}

function extractClaims(text) {
  const numeric = [...(text.matchAll(NUMERIC_RE))].map((m) => m[0].toLowerCase().replace(/\s+/g, ''));
  return { numeric: [...new Set(numeric)], proper: extractProperNouns(text) };
}

function normalize(s) {
  return s.toLowerCase().replace(/\s+/g, '');
}

/**
 * @param {string} text a step's combined prose/callout text
 * @param {{text:string}[]} passages the passages cited for this step
 * @returns {{ claim: string, kind: 'numeric'|'proper', supported: boolean }[]}
 */
export function verifyNumeric(text, passages) {
  const haystack = normalize(passages.map((p) => p.text).join(' '));
  const { numeric, proper } = extractClaims(text);
  const results = [];
  for (const n of numeric) {
    results.push({ claim: n, kind: 'numeric', supported: haystack.includes(normalize(n)) });
  }
  for (const p of proper) {
    results.push({ claim: p, kind: 'proper', supported: haystack.includes(normalize(p)) });
  }
  return results;
}
