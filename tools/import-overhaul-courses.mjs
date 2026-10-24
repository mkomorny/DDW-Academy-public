/**
 * Reads the overhaul textbooks and writes app levels for every track that
 * is still missing. Does not modify the overhaul markdown.
 * Does not touch piano or drums.
 *
 *   node tools/import-overhaul-courses.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('C:/Users/<you>/OneDrive/Desktop/brainstorming or work on later/DDW ACADEMY - COURSE MATERIAL OVERHAUL');
const APP = path.resolve('src/renderer/course');

const usedIds = new Set();

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
  return mathPlain(
    s.replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => mathPlain(x)).replace(/\$([^$\n]+)\$/g, (_, x) => mathPlain(x)),
  )
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function inline(s) {
  const withMath = s
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => mathPlain(x))
    .replace(/\$([^$\n]+)\$/g, (_, x) => mathPlain(x))
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1');
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
    if (!line.trim() || line.trim() === '---' || /^[*=_]{3,}$/.test(line.trim())) { i++; continue; }
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
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      const text = plain(heading[2]);
      if (text) blocks.push({ type: 'heading', text, level: heading[1].length });
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
        if (!decorative && cells.some((c) => c)) rows.push(cells.map((c) => inline(c)));
        i++;
      }
      if (rows.length >= 2) {
        const width = Math.max(...rows.map((r) => r.length));
        const headers = rows[0].slice(0, width);
        while (headers.length < width) headers.push('');
        const body = rows.slice(1).map((r) => {
          const row = r.slice(0, width);
          while (row.length < width) row.push('');
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
        while (i < lines.length && /^ {2,}\S/.test(lines[i]) && !/^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i]) && !lines[i].startsWith('#')) {
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
      && !/^[*=_]{3,}$/.test(lines[i].trim())
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
  const levels = new Set(blocks.filter((b) => b.type === 'heading').map((b) => b.level));
  let splitAt = null;
  for (const n of [2, 3, 4]) {
    if (levels.has(n)) { splitAt = n; break; }
  }
  const steps = [];
  let cur = { type: 'step', title: (fallbackTitle || 'Read').slice(0, 90), blocks: [] };
  for (const b of blocks) {
    if (splitAt && b.type === 'heading' && (b.level === splitAt || b.level < splitAt)) {
      if (cur.blocks.length) steps.push(cur);
      cur = { type: 'step', title: b.text.slice(0, 90) || 'Read', blocks: [] };
    } else {
      cur.blocks.push(b);
    }
  }
  if (cur.blocks.length) steps.push(cur);
  return steps.filter((s) => s.blocks.length && s.title);
}

function words(md) {
  return md.split(/\s+/).filter(Boolean).length;
}

function claim(id) {
  let next = id || 'lesson';
  let n = 2;
  while (usedIds.has(next)) next = `${id}-${n++}`;
  usedIds.add(next);
  return next;
}

function isLessonHeading(title) {
  return /^(lessons?|bonus|capstone|gate)\b/i.test(title.trim());
}

function explicitId(chunk) {
  const comment = chunk.match(/<!--\s*id:\s*([a-zA-Z0-9_-]+)\s*-->/);
  if (comment) return comment[1].toLowerCase();
  const ticks = [...chunk.matchAll(/`([a-z][a-z0-9]*(?:-[a-z0-9]+)+)`/g)].map((m) => m[1]);
  return ticks.find((t) => /-l\d/.test(t) || /-gate-/.test(t) || /-b\d/.test(t)) || null;
}

function numbersIn(title) {
  const m = title.match(/^(?:lessons?|bonus|capstone|gate)\s+([a-z]|\d+)(?:\.(\d+))?(?:\.(\d+))?/i);
  if (!m) return [];
  return [m[1], m[2], m[3]].filter(Boolean).map((p) => String(p).toLowerCase());
}

function lessonTitle(heading) {
  let title = heading
    .replace(/^(?:lessons?|bonus|capstone|gate)\s+/i, '')
    .replace(/\*?\([^)]*`[^`]+`[^)]*\)\*?/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\*+/g, '')
    .trim();
  title = plain(title).replace(/\s+/g, ' ').replace(/\s*[—:-]\s*$/, '');
  return title || plain(heading);
}

function scopeId(track, raw) {
  if (!raw) return null;
  let id = String(raw).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!id) return null;
  if (!id.startsWith(`${track}-`)) id = `${track}-${id}`;
  return id.slice(0, 96);
}

function buildLesson(track, heading, body, fallbackId) {
  const chunk = `${heading}\n${body}`;
  const parts = numbersIn(heading);
  const kind = /^(bonus)\b/i.test(heading.trim()) ? 'b' : (/^(gate)\b/i.test(heading.trim()) ? 'gate' : 'l');
  const fromHeading = parts.length
    ? (kind === 'gate' ? `${track}-gate-${parts.join('-')}` : `${track}-${kind}-${parts.join('-')}`)
    : null;
  const id = scopeId(track, explicitId(chunk) || fromHeading || fallbackId);
  const title = lessonTitle(heading).slice(0, 180);
  const steps = toSteps(blocksFrom(body.replace(/<!--[\s\S]*?-->/g, '')), title);
  if (!steps.length) return null;
  const minutes = Math.max(8, Math.min(45, Math.round(words(body) / 160) || 8));
  const group = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : (parts[0] || null);
  return { id: claim(id), title, blocks: steps, minutes, group };
}

function readText(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, (comment) => {
    return /id\s*:/i.test(comment) ? comment : '';
  });
}

function lessonHeadings(lines) {
  const found = [];
  lines.forEach((line, index) => {
    const m = /^(#{1,3})\s+(.+)$/.exec(line);
    if (m && isLessonHeading(m[2])) found.push({ level: m[1].length, title: m[2].trim(), index });
  });
  return found;
}

function extractLessons(text, track, filename) {
  const lines = text.split('\n');
  const found = lessonHeadings(lines);
  const fallback = filename.replace(/\.md$/i, '');
  if (!found.length) {
    const lesson = buildLesson(track, `# ${moduleTitle(text, filename)}`, text, fallback);
    return lesson ? [lesson] : [];
  }
  const h1Only = found.length === 1 && found[0].level === 1 && found[0].index < 8;
  if (h1Only) {
    const body = lines.slice(found[0].index + 1).join('\n');
    const lesson = buildLesson(track, found[0].title, body, fallback);
    return lesson ? [lesson] : [];
  }
  const splitLevel = Math.min(...found.filter((h) => h.level >= 2).map((h) => h.level));
  const usable = found.filter((h) => h.level === splitLevel);
  if (!usable.length) {
    const lesson = buildLesson(track, found[0].title, lines.slice(found[0].index + 1).join('\n'), fallback);
    return lesson ? [lesson] : [];
  }
  const lessons = [];
  const first = usable[0].index;
  const preamble = lines.slice(0, first).join('\n');
  if (plain(preamble).length > 80) {
    const overview = buildLesson(track, `Lesson overview`, preamble, `${fallback}-overview`);
    if (overview) {
      overview.title = 'Section overview';
      lessons.push(overview);
    }
  }
  for (let n = 0; n < usable.length; n++) {
    const start = usable[n].index;
    const end = n + 1 < usable.length ? usable[n + 1].index : lines.length;
    let bodyLines = lines.slice(start + 1, end);
    while (bodyLines.length && /^#\s+/.test(bodyLines[bodyLines.length - 1])) bodyLines = bodyLines.slice(0, -1);
    const nextH1 = bodyLines.findIndex((line, idx) => idx > 0 && /^#\s+/.test(line) && !/^#{2,}/.test(line));
    if (nextH1 > 0) bodyLines = bodyLines.slice(0, nextH1);
    const lesson = buildLesson(track, usable[n].title, bodyLines.join('\n'), `${fallback}-${n + 1}`);
    if (lesson) lessons.push(lesson);
  }
  return lessons;
}

function moduleTitle(text, filename) {
  const h1 = (text.match(/^#\s+(.+)$/m) || [])[1];
  const fromFile = filename
    .replace(/\.md$/i, '')
    .replace(/^(section|module)[-_ ]+/i, '')
    .replace(/^[\d.]+[-_ ]+/, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  if (!h1) return fromFile.slice(0, 90) || 'Lesson';
  const cleaned = plain(h1)
    .replace(/^(module|section|appendix)\s+[a-z0-9.]+(?:\s*[—:-]\s*|\s+)/i, '')
    .trim();
  return (cleaned || plain(h1) || fromFile).slice(0, 90);
}

function blurbFrom(text) {
  const bits = text.split('\n').map((l) => l.trim()).filter((t) => {
    return t && !t.startsWith('#') && !t.startsWith('|') && !t.startsWith('```') && !t.startsWith('>') && t !== '---' && !/^\*\*/.test(t);
  });
  return plain(bits.slice(0, 2).join(' ')).slice(0, 240);
}

function codeFrom(filename, index) {
  const gate = filename.match(/\bgate[-_ ]+([a-g])\b/i);
  if (gate) return `G${gate[1].toUpperCase()}`;
  const pair = filename.match(/(\d+)\s*[.-]\s*(\d+)/);
  if (pair) return `${Number(pair[1])}.${Number(pair[2])}`;
  const one = filename.match(/(\d+)/);
  if (one) return String(Number(one[1]));
  return String(index + 1);
}

function makeModule(track, filename, text, lessons, index) {
  const code = codeFrom(filename, index);
  const kept = lessons.filter(Boolean);
  if (!kept.length) return null;
  return {
    id: claim(`${track}-m-${code.replace(/\./g, '-')}-${index + 1}`),
    code,
    title: moduleTitle(text, filename),
    blurb: blurbFrom(text) || moduleTitle(text, filename),
    outcomes: [],
    sources: [],
    practiceFocus: [],
    checkpoints: [],
    lessons: kept,
    exercises: [],
  };
}

function levelShell(track, number, title, modules, summary) {
  const kept = modules.filter((m) => m && m.lessons.length);
  if (!kept.length) return null;
  return {
    id: claim(`${track}-level-${number}`),
    number,
    title: title.slice(0, 90),
    skillBand: 'Textbook',
    duration: 'From the course textbook',
    summary: (summary || kept[0].blurb || title).slice(0, 240),
    modules: kept,
  };
}

function isSkippedFile(name) {
  return /syllabus|lesson-index|four-track|unapproved|^readme\.md$|^00-readme\.md$/i.test(name);
}

function orderKey(name) {
  if (/overview/i.test(name)) return -1;
  const num = name.match(/(\d+)/);
  let n = num ? Number(num[1]) : 800;
  if (/appendix/i.test(name)) {
    const letter = name.match(/appendix[-_ ]*([a-z])/i);
    n = 900 + (letter ? letter[1].toUpperCase().charCodeAt(0) - 64 : 0);
  } else if (/bonus/i.test(name)) n += 400;
  else if (/capstone/i.test(name) && !/module/i.test(name)) n += 500;
  else if (/parameter|encyclopedia/i.test(name)) n += 550;
  return n;
}

function readMd(file) {
  return readText(file);
}

function modulesInDir(track, dir) {
  const files = fs.readdirSync(dir)
    .filter((name) => name.endsWith('.md') && !isSkippedFile(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const sectionModules = [];
  const loose = [];
  files.forEach((name, index) => {
    const text = readMd(path.join(dir, name));
    const lessons = extractLessons(text, track, name);
    const fileIsOneLesson = /^(lesson|bonus|capstone)\b/i.test(name);
    if (fileIsOneLesson && lessons.length === 1) loose.push(lessons[0]);
    else sectionModules.push(makeModule(track, name, text, lessons, index));
  });
  if (loose.length) {
    const groups = new Map();
    for (const lesson of loose) {
      const key = lesson.group || '1';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(lesson);
    }
    let i = 0;
    for (const [code, list] of groups) {
      sectionModules.push(makeModule(track, `Section ${code}.md`, '', list, 100 + i));
      i++;
    }
  }
  return sectionModules.filter(Boolean);
}

function titleFromName(name) {
  return name
    .replace(/\.md$/i, '')
    .replace(/^(module|level|appendix)[-_ ]+/i, '')
    .replace(/^\d+\s*[-_.:]?\s*/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function levelsFromFolders(track, courseDir) {
  const entries = fs.readdirSync(courseDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort((a, b) => orderKey(a) - orderKey(b) || a.localeCompare(b));
  const looseFiles = entries
    .filter((e) => e.isFile() && e.name.endsWith('.md') && !isSkippedFile(e.name) && /overview/i.test(e.name))
    .map((e) => e.name);
  const levels = [];
  let number = 0;
  for (const name of looseFiles) {
    const text = readMd(path.join(courseDir, name));
    const lessons = extractLessons(text, track, name);
    const mod = makeModule(track, name, text, lessons, 0);
    const level = levelShell(track, number, titleFromName(name) || 'Overview', [mod], blurbFrom(text));
    if (level) levels.push(level);
    number += 1;
  }
  if (!looseFiles.length) number = 1;
  else number = Math.max(1, number);
  for (const name of dirs) {
    const modules = modulesInDir(track, path.join(courseDir, name));
    const nMatch = name.match(/(\d+)/);
    const preferred = nMatch && !/appendix|bonus|capstone|parameter|encyclopedia/i.test(name) ? Number(nMatch[1]) : null;
    let n = preferred != null && !levels.some((lv) => lv.number === preferred) ? preferred : number;
    if (levels.some((lv) => lv.number === n)) n = Math.max(...levels.map((lv) => lv.number)) + 1;
    const level = levelShell(track, n, titleFromName(name), modules, modules[0]?.blurb);
    if (level) levels.push(level);
    number = Math.max(number, n) + 1;
  }
  return levels.sort((a, b) => a.number - b.number);
}

function levelsFromModuleFiles(track, courseDir, grouped) {
  const levels = [];
  if (grouped) {
    grouped.forEach((group, index) => {
      const modules = group.files.map((name, i) => {
        const text = readMd(path.join(courseDir, name));
        return makeModule(track, name, text, extractLessons(text, track, name), i);
      }).filter(Boolean);
      const level = levelShell(track, index + 1, group.title, modules, modules[0]?.blurb);
      if (level) levels.push(level);
    });
    return levels;
  }
  const files = fs.readdirSync(courseDir)
    .filter((name) => name.endsWith('.md') && !isSkippedFile(name))
    .sort((a, b) => orderKey(a) - orderKey(b) || a.localeCompare(b, undefined, { numeric: true }));
  files.forEach((name, index) => {
    const text = readMd(path.join(courseDir, name));
    const mod = makeModule(track, name, text, extractLessons(text, track, name), 0);
    const level = levelShell(track, index + 1, moduleTitle(text, name), [mod].filter(Boolean), blurbFrom(text));
    if (level) levels.push(level);
  });
  return levels;
}

function levelsFromFlatLessons(track, courseDir) {
  const files = fs.readdirSync(courseDir).filter((name) => name.endsWith('.md') && !isSkippedFile(name));
  const buckets = new Map();
  for (const name of files) {
    const lesson = name.match(/^(Lesson|Bonus)\s+(\d+)/i);
    const cap = /^capstone/i.test(name);
    let key;
    let title;
    if (lesson && /^lesson/i.test(lesson[1])) {
      key = `L${Number(lesson[2])}`;
      title = `Module ${Number(lesson[2])}`;
    } else if (lesson) {
      key = 'B';
      title = 'Bonus references';
    } else if (cap) {
      key = 'C';
      title = 'Capstone';
    } else {
      key = 'X';
      title = titleFromName(name);
    }
    if (!buckets.has(key)) buckets.set(key, { title, files: [] });
    buckets.get(key).files.push(name);
  }
  const keys = [...buckets.keys()].sort((a, b) => {
    const rank = (k) => (k === 'C' ? 3000 : k === 'B' ? 2000 : k === 'X' ? 2500 : Number(k.slice(1)));
    return rank(a) - rank(b);
  });
  return keys.map((key, index) => {
    const bucket = buckets.get(key);
    const lessons = bucket.files
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .flatMap((name) => extractLessons(readMd(path.join(courseDir, name)), track, name));
    const groups = new Map();
    for (const lesson of lessons) {
      const code = lesson.group || String(index + 1);
      if (!groups.has(code)) groups.set(code, []);
      groups.get(code).push(lesson);
    }
    const modules = [...groups.entries()].map(([code, list], i) => makeModule(track, `Section ${code}.md`, '', list, i));
    return levelShell(track, index + 1, bucket.title, modules, modules[0]?.title);
  }).filter(Boolean);
}

function stripImportBanner(text) {
  const lines = text.split('\n');
  if (!lines[0] || !lines[0].includes('UNAPPROVED')) return text;
  let i = 0;
  while (i < lines.length && (lines[i].startsWith('>') || !lines[i].trim() || lines[i].trim() === '---')) i++;
  return lines.slice(i).join('\n');
}

function syllabusNumber(title) {
  const match = title.match(/\blevel\s+(\d+)/i);
  return match ? Number(match[1]) : null;
}

function cleanSyllabusTitle(title) {
  return plain(title)
    .replace(/^\d+\.\s+/, '')
    .replace(/^(level|appendix|bonus|module)\s+[a-z0-9.]+(?:\s*[—:-]\s*|\s+)/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function takeNumber(used, preferred) {
  let n = preferred == null ? (used.size ? Math.max(...used) + 1 : 1) : preferred;
  while (used.has(n)) n = (used.size ? Math.max(...used) + 1 : 0);
  used.add(n);
  return n;
}

function modulesFromSyllabusBody(track, body, fallbackTitle, key) {
  const bodyLines = body.split('\n');
  const headings = [];
  bodyLines.forEach((line, index) => {
    const match = /^(#{2,4})\s+(.+)$/.exec(line);
    if (match) headings.push({ level: match[1].length, title: match[2].trim(), index });
  });
  let cuts = headings.filter((h) => /^(module|appendix)\s+[a-z0-9]/i.test(h.title));
  if (!cuts.length && headings.length) {
    const min = Math.min(...headings.map((h) => h.level));
    cuts = headings.filter((h) => h.level === min);
  }
  if (!cuts.length) {
    const lesson = buildLesson(track, fallbackTitle, body, `${key}-body`);
    if (!lesson) return [];
    lesson.title = cleanSyllabusTitle(fallbackTitle).slice(0, 180) || lesson.title;
    return [makeModule(track, `${fallbackTitle}.md`, body, [lesson], 0)].filter(Boolean);
  }
  const modules = [];
  const lead = bodyLines.slice(0, cuts[0].index).join('\n');
  if (plain(lead).length > 40) {
    const lesson = buildLesson(track, `${fallbackTitle} overview`, lead, `${key}-overview`);
    if (lesson) {
      lesson.title = 'Overview';
      const mod = makeModule(track, `overview-${key}.md`, lead, [lesson], 0);
      if (mod) modules.push(mod);
    }
  }
  cuts.forEach((cut, index) => {
    const end = index + 1 < cuts.length ? cuts[index + 1].index : bodyLines.length;
    const chunk = bodyLines.slice(cut.index + 1, end).join('\n');
    const lesson = buildLesson(track, cut.title, chunk, `${key}-${index + 1}`);
    if (!lesson) return;
    lesson.title = cleanSyllabusTitle(cut.title).slice(0, 180) || lesson.title;
    const mod = makeModule(track, `${cut.title}.md`, chunk, [lesson], index + 1);
    if (mod) modules.push(mod);
  });
  return modules;
}

function levelsFromSyllabus(track, file) {
  const text = stripImportBanner(readMd(file));
  const lines = text.split('\n');
  const heads = [];
  lines.forEach((line, index) => {
    const match = /^(#{1,3})\s+(.+)$/.exec(line);
    if (match) heads.push({ level: match[1].length, title: match[2].trim(), index });
  });
  const firstH1 = heads.find((h) => h.level === 1);
  const isModuleHeading = (title) => /^(module|appendix)\s+[a-z0-9]/i.test(title);
  const isLevelHeading = (heading) => {
    if (firstH1 && heading.index === firstH1.index) return false;
    if (heading.level === 1) return true;
    if (heading.level !== 2 || isModuleHeading(heading.title)) return false;
    return /\blevel\s+\d+/i.test(heading.title) || /\bappendi/i.test(heading.title) || /\bbonus\b/i.test(heading.title) || /\bcapstone\b/i.test(heading.title);
  };
  const starts = [];
  let seenLevel = false;
  for (const heading of heads) {
    if (isLevelHeading(heading)) {
      starts.push(heading);
      seenLevel = true;
      continue;
    }
    if (seenLevel && heading.level === 2 && !isModuleHeading(heading.title)) starts.push(heading);
  }
  if (!starts.length) {
    const only = levelShell(track, 1, cleanSyllabusTitle(firstH1?.title || file), modulesFromSyllabusBody(track, text, firstH1?.title || 'Syllabus', `${track}-all`), blurbFrom(text));
    return only ? [only] : [];
  }
  const preamble = lines.slice(0, starts[0].index).join('\n');
  const preModules = plain(preamble).length > 80
    ? modulesFromSyllabusBody(track, preamble, 'How to read this syllabus', `${track}-guide`)
    : [];
  const usedNumbers = new Set();
  const levels = [];
  starts.forEach((heading, index) => {
    const end = index + 1 < starts.length ? starts[index + 1].index : lines.length;
    const body = lines.slice(heading.index + 1, end).join('\n');
    let modules = modulesFromSyllabusBody(track, body, heading.title, `${track}-part-${index + 1}`);
    if (index === 0 && preModules.length) modules = [...preModules, ...modules];
    const level = levelShell(
      track,
      takeNumber(usedNumbers, syllabusNumber(heading.title)),
      cleanSyllabusTitle(heading.title) || plain(heading.title),
      modules,
      blurbFrom(body),
    );
    if (level) levels.push(level);
  });
  return levels;
}

function writeTrack(track, levels) {
  const out = path.join(APP, track, 'textbook');
  fs.mkdirSync(out, { recursive: true });
  for (const name of fs.readdirSync(out)) {
    if (name.endsWith('.js')) fs.unlinkSync(path.join(out, name));
  }
  const ordered = [...levels].sort((a, b) => a.number - b.number);
  for (const level of ordered) {
    for (const mod of level.modules) {
      for (const lesson of mod.lessons) delete lesson.group;
    }
    const file = path.join(out, `level${String(level.number).padStart(2, '0')}.js`);
    const body = `/** Generated from the overhaul textbook. Re-run tools/import-overhaul-courses.mjs. Do not edit by hand. */\nexport default ${JSON.stringify(level)};\n`;
    fs.writeFileSync(file, body);
  }
  const index = `/** Generated from the overhaul textbook. Re-run tools/import-overhaul-courses.mjs. */\n${ordered.map((l) => `import level${l.number} from './level${String(l.number).padStart(2, '0')}.js';`).join('\n')}\n\nexport const LEVELS = [${ordered.map((l) => `level${l.number}`).join(', ')}];\n`;
  fs.writeFileSync(path.join(out, 'levels.js'), index);
  const trackIndex = `/**\n * ${track} track. Lessons are the overhaul textbook, imported by tools/import-overhaul-courses.mjs.\n */\nimport { LEVELS } from './textbook/levels.js';\n\nexport { LEVELS };\n\n/** Readiness records, not locks. Gate drills are lessons inside the textbook. */\nexport const GATES = [];\n`;
  fs.writeFileSync(path.join(APP, track, 'index.js'), trackIndex);
  const lessonCount = ordered.reduce((n, lv) => n + lv.modules.reduce((m, mod) => m + mod.lessons.length, 0), 0);
  console.log(track, 'levels', ordered.length, 'lessons', lessonCount);
  return lessonCount;
}

const PRODUCTION = [
  { title: 'Module 1 — Job, Form, and Hygiene', files: ['Module-01-Job-Stages-Loop-Trap.md', 'Module-01-Pop-Form.md', 'Module-01-Club-Form-and-Hygiene.md'] },
  { title: 'Module 2 — Warp, Chop, and MIDI Law', files: ['Module-02-Warping.md', 'Module-02-Chop-MIDI-Law.md'] },
  { title: 'Module 3 — Session', files: ['Module-03-Session.md'] },
  { title: 'Module 4 — Session Labs: Pop and R&B', files: ['Module-04-Session-Labs-Pop-RnB.md'] },
  { title: 'Module 5 — Session Labs: Hip-Hop and Trap', files: ['Module-05-Session-Labs-HipHop-Trap.md'] },
  { title: 'Module 6 — Session Labs: House and Techno', files: ['Module-06-Session-Labs-House-Techno.md'] },
  { title: 'Module 7 — Session Labs: 140, DnB, and Melodic', files: ['Module-07A-Session-Labs-140-DnB.md', 'Module-07B-Session-Labs-Melodic-Lofi-Reggae-Ambient.md'] },
  { title: 'Module 8 — Capstone C', files: ['Module-08-Capstone-C.md'] },
  { title: 'Module 9 — Arrangement Ruler', files: ['Module-09-Arrangement-Ruler-Write-Energy.md'] },
  { title: 'Module 10 — Arrangement Labs: Rock, Pop, Country', files: ['Module-10-Arrangement-Labs-Rock-Pop-Country.md'] },
  { title: 'Module 11 — Arrangement Labs: R&B, Reggae, Club', files: ['Module-11-Arrangement-Labs-RnB-Reggae-Club.md'] },
  { title: 'Module 12 — Capstone E', files: ['Module-12-Capstone-E.md'] },
  { title: 'Module 13 — Remix and Flip', files: ['Module-13A-Remix-Craft.md', 'Module-13B-Flip-Craft.md'] },
  { title: 'Module 14 — Capstones F and G', files: ['Module-14-Capstones-F-and-G.md'] },
  { title: 'Module 15 — Finishing and Export', files: ['Module-15-Finishing-Export-Sidebars.md'] },
];

const jobs = [
  ['ableton', 'Mastering-Ableton-Live-12-Course', 'folders'],
  ['launchkey', 'Launchkey MK4 61 Course', 'folders'],
  ['sounddesign', 'Foundations-of-Sound-Design-Course', 'folders'],
  ['production', 'Music-Production-Course', 'production'],
  ['djing', 'Foundations-of-DJing-Course', 'files'],
  ['m4l', 'Building Max for Live Devices Course', 'flat'],
  ['note', 'Ableton Note Mobile Production - Lessons', 'folders'],
  ['bassstation', 'Learning the Novation Bass Station II Course', 'files'],
  ['ai', 'AI Tools for Music Production Course', 'folders'],
];

const syllabi = [
  ['dsp', 'Audio-DSP-Fundamentals-Course-Syllabus.md'],
  ['komplete', 'NI-Komplete-Kontrol-Course-Syllabus.md'],
  ['spatial', 'Spatial Audio & Dolby Atmos — Course Syllabus.md'],
];

let total = 0;
const onlySyllabi = process.argv.includes('--syllabi-only');
if (!onlySyllabi) {
  for (const [track, folder, kind] of jobs) {
    const dir = path.join(ROOT, folder);
    let levels;
    if (kind === 'folders') levels = levelsFromFolders(track, dir);
    else if (kind === 'files') levels = levelsFromModuleFiles(track, dir);
    else if (kind === 'production') levels = levelsFromModuleFiles(track, dir, PRODUCTION);
    else levels = levelsFromFlatLessons(track, dir);
    total += writeTrack(track, levels);
  }
}
for (const [track, name] of syllabi) {
  total += writeTrack(track, levelsFromSyllabus(track, path.join(ROOT, name)));
}
console.log('imported lessons', total, 'ids', usedIds.size);
