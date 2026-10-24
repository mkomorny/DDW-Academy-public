/**
 * Section 9.2 — Draft a Suno prompt, then edit it
 * Module 9 — Claude, Grok, Gemini
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-09-Text-Assistants/
 *     Lesson-9.2.1-Generative-Music-Prompt-Engineering.md
 *
 * No sources() block: the lesson file cites Suno's own Help documentation
 * ("Make a song in Custom Mode", "How to use Style and Lyric fields") and
 * generic "Claude / Grok Prompting Guides" — neither Suno nor a specific
 * local prompting-guide path, so none resolve against
 * tools/reference/known-sources.json. Same treatment as Moises/SpleeterGUI
 * content in Modules 5 and 6: no official Suno docs exist locally.
 */
import {
  module_, lesson, step, prose, table, list, callout, mcq, order, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m9-2',
  code: '9.2',
  title: 'Draft a Suno prompt, then edit it',
  outcomes: ['Save a learner-edited prompt. The draft is not the deliverable.'],
  sources: [],
  practiceFocus: ['Draft → edit → save'],
  checkpoints: ['Saved prompt is the learner’s text'],
  lessons: [
    lesson(
      'ai-tools-music-l9-2-1',
      'Draft a Suno prompt, then edit it',
      [
        step(
          'Suno Custom Mode\'s two fields',
          [
            prose(
              `Generative text-to-audio engines like Suno split their input into two functional fields.
          The <strong>Style of Music</strong> field (roughly 120-200 characters) carries acoustic
          descriptors — sub-genre, BPM, key, instrumentation — and production descriptors like analog
          warmth, dry vocals, or sidechain. It must never name an artist ("in the style of [Artist]").
          The <strong>Lyrics / Structure</strong> field carries structural metatags
          (<code>[Verse 1]</code>, <code>[Pre-Chorus]</code>, <code>[Chorus]</code>,
          <code>[Outro]</code>), instrumental cues (<code>[Guitar Solo]</code>,
          <code>[Instrumental Drop]</code>), and a metered rhyme scheme. It must be 100% original —
          no copyrighted third-party lyrics.`,
            ),
            table(
              ['Field', 'Carries', 'Strict rule'],
              [
                ['Style of Music', 'Sub-genre, BPM, key, instrumentation, production qualities', 'No artist names'],
                ['Lyrics / Structure', 'Structural metatags, instrumental cues, metered lyrics', '100% original lyrics — no copyrighted text'],
              ],
              'Suno Custom Mode\'s two data fields and their strict rules.',
            ),
            callout(
              'warning',
              'Two hard limits, no exceptions',
              'Never request "in the style of [Artist]" in the Style field, and never paste copyrighted or trademarked lyrics into the Lyrics field — both fields must stay free of third-party material.',
            ),
          ],
          mcq(
            'What must the Style of Music field in Suno never contain?',
            [
              'Sub-genre and BPM',
              'Artist names',
              'Structural metatags',
              'Metered rhyme scheme',
            ],
            1,
            'The step text explicitly states that the Style of Music field must never name an artist ("in the style of [Artist]").',
          ),
        ),
        step(
          'Prompt the LLM for a construction kit, then curate it by hand',
          [
            list(
              [
                'Prompt Claude, Grok, or Gemini for a complete Suno Custom Mode construction kit: a Style Field Prompt, an Exclude Styles string, and Lyrics & Structural Tags — stating the genre, tempo, mood, and topic.',
                'Audit the returned Style string: remove generic adjectives like "epic" or "amazing" and replace them with concrete acoustic descriptors naming real gear and qualities.',
                'Audit the returned structural metatags and lyrics: check syllable counts per line for natural rhythmic delivery, and insert specific performance cues.',
                'Verify no third-party lyrics or trademarked phrases exist anywhere in the draft.',
                'Save the finalized, curated prompt into the project folder as SUNO-PROMPT-DRAFT.md.',
              ],
            ),
            prose(
              `The model's first draft is a starting point, not the deliverable — the curation pass is
          where you replace generic language with specific, concrete choices and make the lyrics
          genuinely your own.`,
            ),
          ],
          order(
            'What is the correct sequence of steps for creating and finalizing a Suno Custom Mode prompt?',
            [
              'Audit the returned Style string: remove generic adjectives like "epic" or "amazing" and replace them with concrete acoustic descriptors naming real gear and qualities.',
              'Prompt Claude, Grok, or Gemini for a complete Suno Custom Mode construction kit: a Style Field Prompt, an Exclude Styles string, and Lyrics & Structural Tags — stating the genre, tempo, mood, and topic.',
              'Audit the returned structural metatags and lyrics: check syllable counts per line for natural rhythmic delivery, and insert specific performance cues.',
              'Verify no third-party lyrics or trademarked phrases exist anywhere in the draft.',
              'Save the finalized, curated prompt into the project folder as SUNO-PROMPT-DRAFT.md.',
            ],
            [
              'Prompt Claude, Grok, or Gemini for a complete Suno Custom Mode construction kit: a Style Field Prompt, an Exclude Styles string, and Lyrics & Structural Tags — stating the genre, tempo, mood, and topic.',
              'Audit the returned Style string: remove generic adjectives like "epic" or "amazing" and replace them with concrete acoustic descriptors naming real gear and qualities.',
              'Audit the returned structural metatags and lyrics: check syllable counts per line for natural rhythmic delivery, and insert specific performance cues.',
              'Verify no third-party lyrics or trademarked phrases exist anywhere in the draft.',
              'Save the finalized, curated prompt into the project folder as SUNO-PROMPT-DRAFT.md.',
            ],
            'The step text explicitly lists the actions in this exact order, beginning with prompting an AI for the initial kit and ending with saving the curated prompt as SUNO-PROMPT-DRAFT.md after all auditing and verification passes.',
          ),
        ),
        step(
          'Lab: two prompt kits, hand-edited and saved for Module 10',
          [
            list(
              [
                'Use an LLM to generate two alternative prompt kits: one electronic dance track, one ambient cinematic piece.',
                'Edit both prompt packages by hand — rewrite at least 50% of the lyrics and refine the style descriptors with specific synthesizer models and tempo designations.',
                'Save the curated results in the project container for execution in Module 10.',
              ],
            ),
            prose(
              `Gate G — Text Assistant checkpoint: an 8-bullet Session Fact Sheet was converted into an
          actionable Markdown checklist and at least three of its items were verified directly in
          Live 12; a curated Suno Custom Mode prompt kit (Style String, Exclude String, Structured
          Lyrics) was produced with zero artist names and 100% original lyrics; and every prompt
          asset was saved in the active Live Project folder.`,
            ),
          ],
          multi(
            'According to the step text, which actions must be completed for the Gate G checkpoint?',
            [
              'Convert an 8-bullet Session Fact Sheet into an actionable Markdown checklist',
              'Verify at least three checklist items directly in Live 12',
              'Include artist names in the Suno Custom Mode prompt kit',
              'Produce a curated Suno Custom Mode prompt kit with 100% original lyrics',
              'Save every prompt asset in the active Live Project folder',
            ],
            [0, 1, 3, 4],
            'The step text explicitly states that the Gate G checkpoint requires converting an 8-bullet Session Fact Sheet into an actionable Markdown checklist, verifying at least three items in Live 12, producing a curated Suno Custom Mode prompt kit with zero artist names and 100% original lyrics, and saving every prompt asset in the active Live Project folder.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'Draft a Suno Custom Mode prompt kit with an LLM, then hand-edit and curate it before saving it for Module 10.',
      },
    ),
  ],
});
