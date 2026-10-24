/**
 * Section 1.2 — Source rule before any split or generate
 * Module 1 — Open the toolbox
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-01-Open-The-Toolbox/
 *     Lesson-1.2.1-Source-Authorization-And-Legal-Grounding.md
 *
 * The lesson file's permissible/non-permissible decision-tree ASCII diagram
 * is promoted to diagram({layout:'stack'}) with the two branches feeding a
 * shared decision node. `sources` stays empty for the same reason as 1.1 —
 * Deezer's Spleeter README, Suno's Terms, Moises's Terms, and the USCO
 * policy statement are all named IN the lesson prose (quoted directly, not
 * paraphrased) but none of those exact titles are in
 * tools/reference/known-sources.json, so no sources() call is made rather
 * than citing an unwhitelisted title.
 *
 * Check for this lesson's one step was AI-drafted (tools/author/
 * draft-step-checks.mjs), grounded only in the step's own prose plus this
 * module's outcomes, and entailment-verified before being accepted.
 */
import {
  module_, lesson, step, prose, list, callout, diagram, mcq,
} from '../../schema.js';

export default module_({
  id: 'ai-m1-2',
  code: '1.2',
  title: 'Source rule before any split or generate',
  outcomes: [
    'Accept only files the learner has a stated right to process. Refuse a commercial master with no license.',
  ],
  sources: [],
  practiceFocus: ['Accept or refuse three named files with one sentence each'],
  checkpoints: ['Learner refuses an unauthorized commercial master'],
  lessons: [
    lesson(
      'ai-tools-music-l1-2-1',
      'Source Authorization and Legal Grounding',
      [
        step(
          'Permissible vs. non-permissible inputs',
          [
            prose(
              `Before Moises, SpleeterGUI, Live Separate Stems, or Suno Upload ever touches a file,
          the file itself has to clear a source check. Course-legal sources are the learner's own
          recordings, Live instruments the learner plays or programs, and files the learner has a
          written license or explicit authorization to process. Commercial record masters,
          streaming-audio captures, and unlicensed samples are not.`,
            ),
            diagram(
              [
                { id: 'perm', label: 'Permissible input', sub: 'original audio · authorized multitrack · licensed WAV' },
                { id: 'nonperm', label: 'Non-permissible input', sub: 'commercial master · streaming capture · unlicensed sample' },
                { id: 'proceed', label: 'Proceed to DAW' },
                { id: 'reject', label: 'Reject / abort' },
              ],
              [
                { from: 'perm', to: 'proceed' },
                { from: 'nonperm', to: 'reject' },
              ],
              { layout: 'stack', caption: 'The source-verification decision every file must clear before any split or generate job.' },
            ),
            callout(
              'warning',
              'Splitting a file never transfers ownership',
              `Running separation software on a commercial master creates a derivative technical
           representation — it does not grant any new rights. Processing audio through Moises
           grants output rights only to the extent the learner already owns or licenses the
           underlying source.`,
            ),
          ],
          mcq(
            'According to the source check, which of the following is a course-legal input file?',
            [
              'A commercial record master',
              'A streaming-audio capture',
              "The learner's own recording",
              'An unlicensed sample',
            ],
            2,
            'The step text explicitly lists the learner\'s own recordings as one of the course-legal sources that clear the source check before any split or generate job.',
          ),
        ),
        step(
          'Quote the terms, do not paraphrase from memory',
          [
            list(
              [
                `<strong>Deezer Spleeter's own disclaimer:</strong> "If you plan to use Spleeter on copyrighted material, you must obtain prior authorization from the respective rights holders."`,
                `<strong>Suno tiers:</strong> free-tier generations remain Suno's property under a non-commercial, revocable personal-evaluation license; Pro/Premier generations made during an active paid cycle assign commercial rights to the user — but that contract assignment never overrides statutory copyright law.`,
                `<strong>U.S. Copyright Office human-authorship doctrine:</strong> copyright protects only material resulting from human creativity. A text prompt alone is an instruction to a machine, not composition — registration needs sufficient human authorship such as a human-composed melody, human-recorded instrumentation, or substantive human editing.`,
              ],
            ),
            callout(
              'key',
              'Zero tolerance on voice cloning',
              `Neural voice-cloning trained on a specific artist's timbre without explicit written
           consent violates rights of publicity. Prompts naming a specific artist's vocal style, or
           uploading an un-isolated vocal rip of a commercial artist for timbre replacement, are
           both prohibited in this course. Process the learner's own voice, or a consenting
           collaborator's, only.`,
            ),
            prose(
              `Write one line before any split or generate job: source name, who owns it, why this lab
          may use it. That one line is the entire source-verification protocol — origin, whether
          the processing creates an unauthorized derivative, and whether any vocal track belongs to
          the producer or a consenting collaborator.`,
            ),
          ],
          mcq(
            'According to the step text, what must a learner write before any split or generate job?',
            [
              'The name of the source file only',
              'Source name, who owns it, and why this lab may use it',
              'A full legal disclaimer from the rights holder',
              'The Suno tier and license type only',
            ],
            1,
            'The step text states that the learner must write one line before any split or generate job containing source name, who owns it, why this lab may use it, and that this one line is the entire source-verification protocol.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'What counts as a legal input file before any split or generate job, and the exact terms each tool actually promises.',
      },
    ),
  ],
});
