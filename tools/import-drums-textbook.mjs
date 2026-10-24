/**
 * Reads the drums textbook and writes one app level per module.
 * Does not modify the overhaul markdown.
 *
 *   node tools/import-drums-textbook.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve('C:/Users/<you>/OneDrive/Desktop/brainstorming or work on later/DDW ACADEMY - COURSE MATERIAL OVERHAUL/Drum-Rhythm-&-Programming-Course');
const OUT = path.resolve('src/renderer/course/drums/textbook');

const TITLES = {
  1: 'Foundations of Electronic Drumming',
  2: 'The Rhythmic Grid',
  3: 'Four on the Floor',
  4: 'Ableton Live Drum Devices',
  5: 'Groove, Dynamics, and Time',
  6: 'Drum Sound and the Bus',
  7: 'Launchkey MK4 Performance',
  8: 'Dubstep Drum Engineering',
  9: 'Drum and Bass Engineering',
  10: 'Survey of Contemporary Rhythms',
  11: 'Arrangement and Track Development',
  12: 'Capstone Production',
  13: 'Plugin Reference Manuals',
};

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function mathPlain(raw) {
  return raw
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^}]*)\}/g, '$1')
    .replace(/\\textbf\{([^}]*)\}/g, '$1')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\times/g, '×')
    .replace(/\\neq/g, '≠')
    .replace(/\\pm/g, '±')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\approx/g, '≈')
    .replace(/\\ldots/g, '…')
    .replace(/\\cdot/g, '·')
    .replace(/\\%/g, '%')
    .replace(/\\&/g, '&')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function plain(s) {
  return mathPlain(s.replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => mathPlain(x)).replace(/\$([^$\n]+)\$/g, (_, x) => mathPlain(x)))
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function inline(s) {
  const withMath = s
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => mathPlain(x))
    .replace(/\$([^$\n]+)\$/g, (_, x) => mathPlain(x));
  let html = escapeHtml(withMath);
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  return html;
}

function blocksFrom(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim() === '---' || /^=+$/.test(line.trim())) { i++; continue; }
    if (line.startsWith('```')) {
      const buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
      if (i < lines.length) i++;
      const text = buf.join('\n').replace(/\s+$/, '');
      if (text.trim()) {
        blocks.push({
          type: 'prose',
          html: `<pre style="white-space:pre-wrap;font-family:ui-monospace,monospace">${escapeHtml(text)}</pre>`,
        });
      }
      continue;
    }
    if (line.startsWith('#### ')) {
      const text = plain(line.slice(5));
      if (text) blocks.push({ type: 'heading', text, level: 4 });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      const text = plain(line.slice(4));
      if (text) blocks.push({ type: 'heading', text, level: 3 });
      i++;
      continue;
    }
    if (line.startsWith('>')) {
      const buf = [];
      while (i < lines.length && (lines[i].startsWith('>') || (buf.length && !lines[i].trim()))) {
        if (lines[i].startsWith('>')) buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      const html = inline(buf.join(' '));
      if (html.trim()) blocks.push({ type: 'callout', variant: 'key', title: 'Note', html });
      continue;
    }
    if (line.trim().startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
        const decorative = cells.every((c) => /^:?-+:?$/.test(c));
        if (!decorative) rows.push(cells.map((c) => inline(c)));
        i++;
      }
      if (rows.length >= 2) {
        const headers = rows[0];
        const body = rows.slice(1).map((r) => {
          const row = r.slice(0, headers.length);
          while (row.length < headers.length) row.push('');
          return row;
        });
        blocks.push({ type: 'table', headers, rows: body, caption: null });
      } else if (rows.length === 1) {
        blocks.push({ type: 'prose', html: rows[0].join(' · ') });
      }
      continue;
    }
    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i])) {
        const item = inline(lines[i].replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''));
        if (item.trim()) items.push(item);
        i++;
        while (i < lines.length && /^ {2,}\S/.test(lines[i]) && !/^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i])) {
          if (items.length) items[items.length - 1] += ` ${inline(lines[i].trim())}`;
          i++;
        }
      }
      if (items.length) blocks.push({ type: 'list', items, ordered });
      continue;
    }
    const buf = [line];
    i++;
    while (
      i < lines.length && lines[i].trim()
      && !lines[i].startsWith('#')
      && !lines[i].startsWith('```')
      && !lines[i].startsWith('>')
      && !lines[i].trim().startsWith('|')
      && !/^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i])
      && lines[i].trim() !== '---'
    ) {
      buf.push(lines[i]);
      i++;
    }
    const html = inline(buf.join(' '));
    if (html.trim()) blocks.push({ type: 'prose', html });
  }
  return blocks;
}

function toSteps(blocks, fallbackTitle) {
  const steps = [];
  let cur = { type: 'step', title: fallbackTitle, blocks: [] };
  for (const b of blocks) {
    if (b.type === 'heading' && b.level === 3) {
      if (cur.blocks.length) steps.push(cur);
      cur = { type: 'step', title: b.text.slice(0, 90), blocks: [] };
    } else {
      cur.blocks.push(b);
    }
  }
  if (cur.blocks.length) steps.push(cur);
  return steps.filter((s) => s.blocks.length);
}

function words(md) {
  return md.split(/\s+/).filter(Boolean).length;
}

function lessonFrom(heading, body, fallbackId) {
  const frozen = /FROZEN\/shipped/i.test(heading);
  const slugs = [...heading.matchAll(/drums-l[0-9]+(?:-[0-9]+)+/g)].map((m) => m[0]);
  let title = heading
    .replace(/^Lesson[s]?\s+/i, '')
    .replace(/\*?\([^)]*drums-[lb][^)]*\)\*?/g, '')
    .replace(/\*+/g, '')
    .trim();
  title = plain(title).replace(/\s+/g, ' ').replace(/\s*\([^)]*\)\s*$/, '');
  const id = slugs[0] || fallbackId;
  if (frozen) return null;
  const steps = toSteps(blocksFrom(body), title.slice(0, 90) || 'Read');
  if (!steps.length) return null;
  const minutes = Math.max(8, Math.min(45, Math.round(words(body) / 160)));
  return { id, title, blocks: steps, minutes };
}

function sectionFile(file, modNum) {
  const base = path.basename(file);
  const codeMatch = base.match(/^Section_(\d+)\.(\d+)_/);
  if (!codeMatch) return null;
  const code = `${codeMatch[1]}.${codeMatch[2]}`;
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
  const h1 = (raw.match(/^#\s+(.+)$/m) || [, base])[1];
  const parts = raw.split(/^## /m).slice(1);
  const lessons = [];
  const overviewChunks = [];
  let seenLesson = false;
  let lastLesson = null;
  parts.forEach((part, index) => {
    const nl = part.indexOf('\n');
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const body = nl === -1 ? '' : part.slice(nl + 1);
    if (/^Lesson\b/i.test(heading) || /drums-[lb][0-9a-z-]+/.test(heading)) {
      seenLesson = true;
      const built = lessonFrom(heading, body, `drums-l${codeMatch[1]}-${codeMatch[2]}-${index + 1}`);
      if (built) {
        lessons.push(built);
        lastLesson = built;
      }
    } else if (!seenLesson) {
      overviewChunks.push(`### ${heading}\n${body}`);
    } else if (lastLesson) {
      const extra = toSteps(blocksFrom(`### ${heading}\n${body}`), plain(heading).slice(0, 90));
      lastLesson.blocks.push(...extra);
      lastLesson.minutes = Math.min(45, lastLesson.minutes + 4);
    }
  });
  if (overviewChunks.length) {
    const overview = lessonFrom(
      `Lesson ${code}.0: Section overview`,
      overviewChunks.join('\n\n'),
      `drums-ov-${codeMatch[1]}-${codeMatch[2]}`,
    );
    if (overview) {
      overview.id = `drums-ov-${codeMatch[1]}-${codeMatch[2]}`;
      overview.title = `Section ${code} overview`;
      lessons.unshift(overview);
    }
  }
  const blurb = plain((raw.split(/^## /m)[1] || '').split('\n').filter((l) => {
    const t = l.trim();
    return t && !t.startsWith('#') && !t.startsWith('**') && t !== '---' && !t.startsWith('|') && !t.startsWith('```');
  }).slice(0, 2).join(' ')).slice(0, 240);
  return {
    id: `drums-m${codeMatch[1]}-${codeMatch[2]}`,
    code,
    title: plain(h1).replace(/^Section\s+\d+\.\d+:\s*/i, '').slice(0, 80),
    blurb: blurb || plain(h1),
    outcomes: [],
    sources: [],
    practiceFocus: [],
    checkpoints: [],
    lessons,
    exercises: [],
  };
}

fs.mkdirSync(OUT, { recursive: true });
const dirs = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{2}_/.test(d.name))
  .sort((a, b) => a.name.localeCompare(b.name));

const used = new Set();
const levels = [];

for (const dir of dirs) {
  const modNum = Number(dir.name.slice(0, 2));
  const files = fs.readdirSync(path.join(ROOT, dir.name))
    .filter((f) => f.startsWith('Section_') && f.endsWith('.md'))
    .sort();
  const modules = files.map((f) => sectionFile(path.join(ROOT, dir.name, f), modNum)).filter(Boolean);
  for (const mod of modules) {
    mod.lessons = mod.lessons.filter((lesson) => {
      if (used.has(lesson.id)) {
        console.warn('duplicate id skipped', lesson.id, lesson.title);
        return false;
      }
      used.add(lesson.id);
      return true;
    });
  }
  const level = {
    id: `drums-level-${modNum}`,
    number: modNum,
    title: TITLES[modNum] || dir.name,
    skillBand: 'Textbook',
    duration: 'From the drums textbook',
    summary: modules[0]?.blurb || TITLES[modNum],
    modules: modules.filter((m) => m.lessons.length),
  };
  levels.push(level);
  const file = path.join(OUT, `level${String(modNum).padStart(2, '0')}.js`);
  const body = `/** Generated from the drums textbook. Re-run tools/import-drums-textbook.mjs. Do not edit by hand. */\nexport default ${JSON.stringify(level)};\n`;
  fs.writeFileSync(file, body);
  console.log(dir.name, 'lessons', modules.reduce((n, m) => n + m.lessons.length, 0));
}

const index = `/** Generated from the drums textbook. Re-run tools/import-drums-textbook.mjs. */\n${levels.map((l) => `import level${l.number} from './level${String(l.number).padStart(2, '0')}.js';`).join('\n')}\n\nexport const LEVELS = [${levels.map((l) => `level${l.number}`).join(', ')}];\n`;
fs.writeFileSync(path.join(OUT, 'levels.js'), index);
console.log('levels', levels.length, 'ids', used.size);
