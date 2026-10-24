/**
 * Section 10.1 — Create
 * Module 10 — Suno
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-10-Suno/
 *     Lesson-10.1.1-Suno-Interface-And-Modes-Of-Generation.md
 *
 * No sources() block: the lesson cites Suno's own Help Documentation and
 * suno.com/create, neither of which resolves against known-sources.json —
 * same no-official-docs-locally treatment as Section 9.2.
 */
import {
  module_, lesson, step, prose, diagram, table, list, mcq, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m10-1',
  code: '10.1',
  title: 'Create',
  outcomes: ['Produce two generations from a learner-written prompt and pick one.'],
  sources: [],
  practiceFocus: ['One instrumental or owned-lyric song; keep one of the two generations'],
  checkpoints: ['Library contains the kept clip'],
  lessons: [
    lesson(
      'ai-tools-music-l10-1-1',
      'Create',
      [
        step(
          'Simple Mode vs Custom Mode',
          [
            prose(
              `At <strong>suno.com/create</strong>, every generation starts from one of two modes.
          <strong>Simple Mode</strong> takes a single natural-language description box — genre, mood,
          concept — and lets Suno's own random prompt generator fill gaps. <strong>Custom Mode</strong>
          splits the same job into three discrete fields: a dedicated Style of Music field, an Advanced
          Options Exclude Styles field, and a separate Lyrics & Metatags box. Custom Mode is what lets
          you paste the curated Style String and Exclude String you built in Lesson 9.2.1 instead of
          leaving word choice to the model.`,
            ),
            diagram(
              [
                { id: 'mode', label: 'Choose mode' },
                { id: 'simple', label: 'Simple: one text box' },
                { id: 'custom', label: 'Custom: 3 fields' },
                { id: 'create', label: 'Click Create' },
              ],
              [
                { from: 'mode', to: 'simple' },
                { from: 'mode', to: 'custom' },
                { from: 'simple', to: 'create' },
                { from: 'custom', to: 'create' },
              ],
              { layout: 'chain', caption: 'Both modes converge on the same Create step once configured.' },
            ),
          ],
          mcq(
            'What does Custom Mode on suno.com/create allow you to do with the Style String and Exclude String from Lesson 9.2.1?',
            [
              'Leave word choice entirely to the model',
              'Paste them directly into dedicated fields',
              'Use only the single natural-language description box',
              'Generate random prompts automatically',
            ],
            1,
            'The step text states that Custom Mode lets you paste the curated Style String and Exclude String you built in Lesson 9.2.1 instead of leaving word choice to the model.',
          ),
        ),
        step(
          'Configure Custom Mode and generate',
          [
            table(
              ['Custom Mode field', 'What goes in it'],
              [
                ['Style of Music', 'Your curated Style String from Lesson 9.2.1'],
                ['Advanced Options → Exclude Styles', 'Unwanted timbres, e.g. distorted guitars, harsh vocals'],
                ['Lyrics box', 'Toggle Instrumental ON, or paste curated lyrics with [Verse 1]/[Chorus] metatags'],
              ],
              'Custom Mode field configuration before clicking Create.',
            ),
            prose(
              `Click <strong>Create</strong>. Suno spawns two parallel generations — typically labeled with
          identical titles but unique wave hashes. This dual-candidate output is the same every time,
          regardless of mode, so auditioning both clips is always part of the workflow.`,
            ),
          ],
          mcq(
            'What does Suno produce immediately after you click Create in Custom Mode?',
            [
              'One generation with a unique wave hash',
              'Two parallel generations with identical titles but unique wave hashes',
              'A single clip that changes each time you click Create',
              'Two generations only when using Instrumental mode',
            ],
            1,
            'The step text states that clicking Create makes Suno spawn two parallel generations — typically labeled with identical titles but unique wave hashes.',
          ),
        ),
        step(
          'Lab: audition both candidates and pick one',
          [
            list(
              [
                'Generate a song using your curated prompt in Custom Mode.',
                'Listen to Candidate 1 and Candidate 2 in their entirety.',
                'Check rhythmic stability, vocal phrasing, and harmonic clarity on each.',
                'Select the superior candidate; archive or discard the other.',
                'Write a 2-sentence rationale in USAGE-LOG.md citing specific musical qualities such as groove stability or harmonic richness.',
              ],
            ),
            prose(
              `The checkpoint for this section is not "a song exists" — it is that you can name, in
          writing, why you kept the candidate you kept. Never use copyrighted artist names anywhere in
          the Style, Exclude, or Lyrics fields.`,
            ),
          ],
          text(
            'What is the checkpoint for this section?',
            [
              'you can name in writing why you kept the candidate you kept',
              'name in writing why you kept the candidate',
              'name why you kept the candidate you kept',
              'can name why you kept the candidate',
            ],
            'The step text explicitly states that the checkpoint for this section is not "a song exists" — it is that you can name, in writing, why you kept the candidate you kept.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'Configure Suno Custom Mode from your curated prompt kit, generate, and choose between two candidates on technical grounds.',
      },
    ),
  ],
});
