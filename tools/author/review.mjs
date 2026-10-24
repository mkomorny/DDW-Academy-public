#!/usr/bin/env node
/**
 * review.mjs — one self-contained HTML file per lesson: authored prose
 * beside the passages it was supposedly grounded in, plus the verification
 * report. Built because grepping through raw IR JSON to spot-check
 * provenance does not scale to 150 lessons; this does.
 *
 * Run: node tools/author/review.mjs <lessonId>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'out');

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderBlock(b) {
  if (b.type === 'prose') return `<p>${b.html}</p>`;
  if (b.type === 'callout') return `<div class="callout ${esc(b.variant)}"><div class="ct">${esc(b.title)}</div><p>${b.html}</p></div>`;
  if (b.type === 'list') return `<${b.ordered ? 'ol' : 'ul'}>${b.items.map((i) => `<li>${i}</li>`).join('')}</${b.ordered ? 'ol' : 'ul'}>`;
  if (b.type === 'table') return `<table><thead><tr>${b.headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>${b.caption ? `<div class="cap">${esc(b.caption)}</div>` : ''}`;
  if (b.type === 'sources') return `<div class="sources">Sources: ${b.files.map(esc).join(' · ')}</div>`;
  if (b.type === 'gap') return `<div class="gap">⚠ GAP — not written, passages didn't support it: ${esc(b.note)}</div>`;
  if (b.type === 'depth') {
    return `<div class="depth">
      ${b.plain ? `<div class="reg"><div class="reg-label">Plain</div>${b.plain.map(renderBlock).join('')}</div>` : ''}
      <div class="reg standard"><div class="reg-label">Standard</div>${b.standard.map(renderBlock).join('')}</div>
      ${b.technical ? `<div class="reg"><div class="reg-label">Technical</div>${b.technical.map(renderBlock).join('')}</div>` : ''}
    </div>`;
  }
  return `<div class="unrendered">[${esc(b.type)} block — not rendered in review, see raw IR]</div>`;
}

function renderQuestion(q) {
  if (!q) return '';
  let body = '';
  if (q.kind === 'mcq' || q.kind === 'multi') {
    const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
    body = `<ol type="a">${q.options.map((o, i) => `<li class="${answers.includes(i) ? 'correct' : ''}">${esc(o)}</li>`).join('')}</ol>`;
  } else if (q.kind === 'order') {
    body = `<div>Items: ${q.items.map(esc).join(', ')}<br>Correct order: ${q.answer.map(esc).join(' → ')}</div>`;
  } else if (q.kind === 'text') {
    body = `<div>Accepts: ${q.accept.map(esc).join(' / ')}</div>`;
  }
  return `<div class="check"><div class="q">${esc(q.question)}</div>${body}${q.explain ? `<div class="explain">${esc(q.explain)}</div>` : ''}</div>`;
}

function main() {
  const lessonId = process.argv[2];
  if (!lessonId) { console.error('Usage: node tools/author/review.mjs <lessonId>'); process.exit(1); }

  const irPath = path.join(OUT_DIR, 'ir', `${lessonId}.json`);
  const passagesPath = path.join(OUT_DIR, 'ir', `${lessonId}.passages.json`);
  const reportPath = path.join(OUT_DIR, 'ir', `${lessonId}.report.json`);
  if (!fs.existsSync(irPath)) { console.error(`No IR found at ${irPath} — run tools/author/run.mjs first.`); process.exit(1); }

  const lesson = JSON.parse(fs.readFileSync(irPath, 'utf8'));
  const passages = fs.existsSync(passagesPath) ? JSON.parse(fs.readFileSync(passagesPath, 'utf8')) : [];
  const report = fs.existsSync(reportPath) ? JSON.parse(fs.readFileSync(reportPath, 'utf8')) : null;

  const steps = lesson.blocks.filter((b) => b.type === 'step');
  const stepsHtml = steps.map((s, i) => `
    <section class="step">
      <h2>${i + 1}. ${esc(s.title)}</h2>
      ${s.blocks.map(renderBlock).join('\n')}
      ${renderQuestion(s.check)}
      ${s.asserts ? `<div class="asserts"><strong>Assertions:</strong> ${s.asserts.map((a) => `<code>${esc(JSON.stringify(a))}</code>`).join(' ')}</div>` : ''}
    </section>`).join('\n');

  const passagesHtml = passages.map((p, i) => `
    <div class="passage">
      <div class="passage-head">[${i + 1}] ${esc(p.source?.title || 'untitled')} ${p.source?.url ? `— <a href="${esc(p.source.url)}">${esc(p.source.url)}</a>` : ''} <span class="notebook">(${esc(p.notebook || '')})</span></div>
      <div class="passage-text">${esc(p.text)}</div>
    </div>`).join('\n');

  const reportHtml = report ? `
    <div class="report">
      <p><strong>Counts:</strong> ${report.counts.gapCount} gaps · ${report.counts.sourceIssues} source issues ·
        ${report.counts.theoryIssues} theory issues · ${report.counts.numericIssues} numeric issues · ${report.counts.entailIssues} entailment issues</p>
      ${report.lines.length ? `<pre>${esc(report.lines.join('\n'))}</pre>` : '<p>No issues raised.</p>'}
    </div>` : '<p class="muted">No report file found.</p>';

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Review: ${esc(lesson.title)}</title>
<style>
  body { font-family: -apple-system, Segoe UI, sans-serif; max-width: 1400px; margin: 0 auto; padding: 24px; background: #14161c; color: #e8e6e1; }
  h1 { font-size: 22px; } h2 { font-size: 17px; color: #c9a227; margin-top: 28px; }
  .cols { display: flex; gap: 24px; align-items: flex-start; }
  .lesson-col { flex: 1.3; min-width: 0; } .ref-col { flex: 1; min-width: 0; position: sticky; top: 12px; max-height: 95vh; overflow-y: auto; }
  .step { background: #1c2030; border: 1px solid #333; border-radius: 8px; padding: 16px 18px; margin-bottom: 16px; }
  .callout { background: #232838; border-left: 3px solid #c9a227; padding: 8px 12px; margin: 10px 0; border-radius: 4px; }
  .callout .ct { font-weight: 700; font-size: 11px; text-transform: uppercase; color: #c9a227; }
  table { border-collapse: collapse; margin: 10px 0; } td, th { border: 1px solid #444; padding: 4px 8px; font-size: 13px; }
  .cap { font-size: 11px; color: #888; margin-top: 4px; }
  .sources { font-size: 12px; color: #4dd6c1; margin-top: 8px; }
  .gap { background: #402020; color: #e2607a; padding: 8px 12px; border-radius: 4px; margin: 8px 0; font-size: 13px; }
  .depth { border: 1px dashed #666; border-radius: 6px; padding: 8px; margin: 10px 0; }
  .reg { padding: 6px 8px; } .reg-label { font-size: 10px; text-transform: uppercase; color: #888; font-weight: 700; }
  .reg.standard { background: #20263a; border-radius: 4px; }
  .check { background: #1a2e24; border-radius: 6px; padding: 10px 14px; margin-top: 12px; }
  .check .q { font-weight: 600; margin-bottom: 6px; }
  .check li.correct { color: #4dd6c1; font-weight: 700; }
  .explain { font-size: 12px; color: #999; margin-top: 6px; }
  .asserts { font-size: 11px; color: #999; margin-top: 8px; } .asserts code { background: #232838; padding: 1px 4px; border-radius: 3px; }
  .unrendered { font-size: 12px; color: #e2a83d; font-style: italic; }
  .passage { background: #1c2030; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; font-size: 12.5px; }
  .passage-head { font-weight: 700; margin-bottom: 4px; color: #c9a227; }
  .passage-head a { color: #4dd6c1; } .notebook { color: #888; font-weight: 400; }
  .passage-text { color: #ccc; white-space: pre-wrap; max-height: 160px; overflow-y: auto; }
  .report { background: #1c2030; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; }
  .report pre { white-space: pre-wrap; font-size: 12px; color: #e2a83d; }
  .muted { color: #888; }
</style></head>
<body>
  <h1>${esc(lesson.title)} <span class="muted">(${esc(lesson.id)})</span></h1>
  ${reportHtml}
  <div class="cols">
    <div class="lesson-col">${stepsHtml}</div>
    <div class="ref-col"><h2>Reference passages (${passages.length})</h2>${passagesHtml}</div>
  </div>
</body></html>`;

  fs.mkdirSync(path.join(OUT_DIR, 'review'), { recursive: true });
  const outPath = path.join(OUT_DIR, 'review', `${lessonId}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`Wrote review page: ${outPath}`);
}

main();
