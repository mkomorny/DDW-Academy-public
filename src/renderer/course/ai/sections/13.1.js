/**
 * Section 13.1 — The Project log
 * Module 13 — Usage log and current Terms
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-13-Usage-Log-And-Terms/
 *     Lesson-13.1.1-Production-Provenance-And-Usage-Logging.md
 *
 * No sources() block: the lesson cites the course syllabus itself and
 * ISO/IEC 19790 metadata standards, neither of which resolves against
 * known-sources.json.
 */
import {
  module_, lesson, step, prose, diagram, table, list, mcq, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m13-1',
  code: '13.1',
  title: 'The Project log',
  outcomes: ['A `USAGE-LOG.md` (or `PROVENANCE.md`) that matches filenames.'],
  sources: [],
  practiceFocus: ['Retrofit the log onto the Module 8 or 10 Set'],
  checkpoints: ['Log opens beside the Set and matches disk names'],
  lessons: [
    lesson(
      'ai-tools-music-l13-1-1',
      'The Project log',
      [
        step(
          'Why record labels and distributors ask for this now',
          [
            prose(
              `In modern commercial production, record labels, sync libraries, and digital distribution
          aggregators increasingly require explicit disclosure of AI tool utilization. A
          <code>USAGE-LOG.md</code> is the single document that carries this disclosure: it lives in
          the root folder of every Live Project and pairs every AI or DSP operation with its exact
          settings, its output file paths, and the human DAW actions taken afterward.`,
            ),
            diagram(
              [
                { id: 'header', label: 'Project header' },
                { id: 'runs', label: 'Tool run log, per operation' },
                { id: 'terms', label: 'Statutory citations' },
              ],
              [
                { from: 'header', to: 'runs' },
                { from: 'runs', to: 'terms' },
              ],
              { layout: 'chain', caption: 'The three-part structure of USAGE-LOG.md.' },
            ),
          ],
          mcq(
            'What is the single document that carries disclosure of AI tool utilization in a Live Project?',
            [
              'A README.md file',
              'A USAGE-LOG.md file',
              'An AI_DISCLOSURE.txt file',
              'A PROVENANCE.json file',
            ],
            1,
            'The step text states that a USAGE-LOG.md is the single document that carries this disclosure and lives in the root folder of every Live Project.',
          ),
        ),
        step(
          'The six required fields of a Tool Run entry',
          [
            list(
              [
                'Timestamp (YYYY-MM-DD HH:MM).',
                'Source audio origin and right-to-use authorization.',
                'Tool name, software version, and account tier.',
                'Exact input settings, prompts, or model configurations.',
                'Output filename(s) and disk location in Samples/.',
                'Human DAW actions (arrangement, synthesis, EQ, mixing).',
              ],
            ),
            table(
              ['Run type example', 'What its entry must show'],
              [
                ['Source Separation', 'Tool + tier, source audio origin, four output stem paths, human DAW action taken on each stem'],
                ['Generative Composition Seed', 'Tool, tier, Style/Exclude/Lyrics prompt text, output file path, human DAW action taken'],
                ['Assistive Mastering', 'Tool + tier, target profile, intensity setting, analysis scope, human adjustments, output master path'],
              ],
              'Every Run entry — regardless of which tool produced it — follows the same six-field template.',
            ),
          ],
          mcq(
            'According to the six-field template that every Run entry must follow, which of the following is one of the required fields?',
            [
              'Timestamp (YYYY-MM-DD HH:MM)',
              'DAW plugin used',
              'Number of stems generated',
              'Target BPM of the track',
            ],
            0,
            'The step text explicitly lists "Timestamp (YYYY-MM-DD HH:MM)." as the first of the six required fields in the template that every Run entry must follow.',
          ),
        ),
        step(
          'Lab: retrofit a complete log onto an existing Set',
          [
            prose(
              `Open your hybrid production session from Module 11 or 12. Compile a complete
          <code>USAGE-LOG.md</code> containing all three tool runs — Separation, Generation, and
          Mastering — that actually happened in that session. Then verify that every file path listed
          in the log exists on your local drive in the exact folder specified: a log entry that
          disagrees with the disk is worse than no log at all.`,
            ),
          ],
          text(
            'What is the exact filename you must create for the usage log in this step?',
            ['USAGE-LOG.md', 'usage-log.md'],
            'The step text explicitly directs the learner to compile a complete USAGE-LOG.md containing all three tool runs.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'Build a USAGE-LOG.md that documents every AI or DSP tool run against a real Live Project, with file paths that match the disk.',
      },
    ),
  ],
});
