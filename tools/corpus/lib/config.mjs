// Shared paths for the corpus pipeline. Build-time only — nothing here ships in the app.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..'); // .../DDW ACADEMY/CODE

// Where the raw NotebookLM bulk exports and training-docs corpus live.
// Override with CORPUS_SOURCE_DIR if this ever runs on a different machine.
export const CORPUS_SOURCE_DIR =
  process.env.CORPUS_SOURCE_DIR || 'B:\\Documents\\TRAINING DOCS';

export const NOTEBOOKLM_EXPORTS_DIR = path.join(
  CORPUS_SOURCE_DIR,
  'NotebookLMs - Source Exports'
);

export const BUILD_DIR = path.join(PROJECT_ROOT, 'build', 'corpus');
export const DB_PATH = path.join(BUILD_DIR, 'corpus.db');
export const NOTEBOOKS_TRIAGE_PATH = path.join(PROJECT_ROOT, 'tools', 'corpus', 'notebooks.json');
export const CLEAN_REVIEW_PATH = path.join(BUILD_DIR, 'clean-review.txt');
export const SNIPPETS_OUT_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'snippets.json');
