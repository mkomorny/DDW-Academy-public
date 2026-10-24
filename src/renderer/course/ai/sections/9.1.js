/**
 * Section 9.1 — Give it facts, get a table
 * Module 9 — Claude, Grok, Gemini
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-09-Text-Assistants/
 *     Lesson-9.1.1-Structured-Prompting-For-Production-Checklists.md
 *
 * `sources` cites 'Prompting best practices', 'Structured outputs', and
 * 'Reduce hallucinations' — all three whitelisted in known-sources.json and
 * matching the lesson file's own cited local paths
 * (`Prompting best practices.md`, `Structured outputs.md`,
 * `Reduce hallucinations.md`) exactly, minus extension.
 */
import {
  module_, lesson, step, prose, table, diagram, list, sources, mcq, multi,
} from '../../schema.js';

export default module_({
  id: 'ai-m9-1',
  code: '9.1',
  title: 'Give it facts, get a table',
  outcomes: ['Produce a checklist you can verify in Live.'],
  sources: ['Prompting best practices', 'Structured outputs', 'Reduce hallucinations'],
  practiceFocus: ['One-page mix checklist from a pasted track diagram; three items checked in Live'],
  checkpoints: ['Checklist contains at least one “measure in Live” line'],
  lessons: [
    lesson(
      'ai-tools-music-l9-1-1',
      'Give it facts, get a table',
      [
        step(
          'What an LLM can and cannot do with your session',
          [
            prose(
              `A text assistant such as Claude, Grok, or Gemini operates purely on symbolic text and
          token relationships — it <strong>cannot hear audio signals</strong> or inspect a binary
          DAW session file unless a programmatic API bridge is explicitly built. Never ask a text
          assistant <em>"How does my mix sound?"</em> — it will invent spectral qualities it cannot
          perceive. Instead, ground every fact you give it with an explicit measurement (for example,
          "Lead vocal has a 4dB dynamic resonance spike at 3.2 kHz"), and require the model to return
          its answer only as a Markdown table or a numbered imperative checklist.`,
            ),
            diagram(
              [
                { id: 'audit', label: 'Measure the session' },
                { id: 'prompt', label: 'Structured prompt + facts' },
                { id: 'llm', label: 'LLM generates checklist' },
                { id: 'verify', label: 'Verify items in Live' },
              ],
              [
                { from: 'audit', to: 'prompt' },
                { from: 'prompt', to: 'llm' },
                { from: 'llm', to: 'verify' },
              ],
              { layout: 'chain', caption: 'The LLM production reasoning pipeline: measure, prompt, generate, verify.' },
            ),
            sources(['Prompting best practices', 'Reduce hallucinations']),
          ],
          mcq(
            'Why should you never ask a text assistant "How does my mix sound?"',
            [
              'Because it will give a bad answer',
              'Because it cannot hear audio signals',
              'Because it only understands Markdown',
              'Because it cannot open DAW files',
            ],
            1,
            'The step text explicitly states that a text assistant operates purely on symbolic text and token relationships — it cannot hear audio signals or inspect a binary DAW session file.',
          ),
        ),
        step(
          'Compile the 8-bullet Session Fact Sheet',
          [
            list(
              [
                'Project title.',
                'Master tempo and meter (e.g. 124 BPM, 4/4 time).',
                'Musical key and scale (e.g. F Minor Natural).',
                'Total arrangement duration (minutes/seconds and bars).',
                'Audio stem tracks present in the session.',
                'Native Live instruments in use, by track.',
                'Insert processing applied, by track and device.',
                'Measured master buss level (peak dBFS and integrated LUFS).',
              ],
            ),
            prose(
              `Every one of these eight bullets must come from a real measurement or inspection of the
          active Live session — never a guess. This fact sheet is what grounds the assistant's
          reasoning; skip a bullet or estimate one and the assistant has nothing but a gap to fill
          with invention.`,
            ),
          ],
          multi(
            'Which of these must be included in the project fact sheet according to the listed requirements?',
            [
              'Master tempo and meter (e.g. 124 BPM, 4/4 time)',
              'Guessed musical key based on ear',
              'Total arrangement duration (minutes/seconds and bars)',
              'Native Live instruments in use, by track',
              'Estimated master buss level',
            ],
            [0, 2, 3],
            'The step text explicitly lists these eight items (including master tempo and meter, total arrangement duration, and native Live instruments in use) as mandatory facts that must come from real measurement or inspection of the active Live session.',
          ),
        ),
        step(
          'Formulate the structured prompt and require [UNVERIFIED ASSUMPTION] flags',
          [
            table(
              ['Prompt element', 'Requirement'],
              [
                ['Role framing', 'Tell the assistant it is an expert technical mixing engineer for Ableton Live 12'],
                ['Facts', 'Paste the completed 8-bullet Session Fact Sheet verbatim'],
                ['Output format', 'A 4-stage checklist as a Markdown table: Stage, Target Track, Technical Action in Live 12, Specific Device/Parameter, Verification Criteria'],
                ['Assumption rule', 'Any parameter that cannot be deduced from the facts must be marked [UNVERIFIED ASSUMPTION - MEASURE IN LIVE]'],
                ['No filler rule', 'Output only the table and a one-paragraph summary of potential frequency masking conflicts'],
              ],
              'Required elements of the structured mixing-checklist prompt.',
            ),
            prose(
              `Paste this prompt into Claude, Grok, or Gemini with your fact sheet inserted. The two
          rules that matter most are the assumption rule and the no-filler rule: together they force
          the assistant to hand back a table you can act on, with every unverified figure clearly
          marked instead of silently invented.`,
            ),
          ],
          multi(
            'Which two rules in the structured mixing-checklist prompt are described as mattering most because they force the assistant to produce an actionable table with every unverified figure clearly marked?',
            [
              'Role framing and Facts',
              'Output format and Assumption rule',
              'Assumption rule and No filler rule',
              'Facts and No filler rule',
              'Output format and Role framing',
            ],
            [2],
            'The step text explicitly states that the two rules that matter most are the assumption rule and the no-filler rule because together they force the assistant to hand back a table you can act on, with every unverified figure clearly marked instead of silently invented.',
          ),
        ),
        step(
          'Lab: verify at least three checklist items in Live',
          [
            list(
              [
                'Audit an active Live Set and compile the 8-bullet Fact Sheet.',
                'Run the structured prompt through Claude, Grok, or Gemini.',
                'Save the resulting Markdown table into the Live Project folder as MIX-CHECKLIST.md.',
                'Cross-reference at least three checklist items directly in Live — for example, the low-end high-pass cutoff on non-bass tracks, or frequency masking between a sub-bass and a kick drum fundamental, using Live\'s Spectrum device or an external meter.',
                'Check off the three verified items and record your initials next to those rows.',
              ],
            ),
            prose(
              `The checklist is not the deliverable — the <strong>verified</strong> checklist is. A row
          that was never measured in Live, even if the assistant's language sounds confident, stays
          unchecked.`,
            ),
          ],
          multi(
            'According to the step, which of the following actions must be performed when creating and using the mix checklist?',
            [
              'Audit an active Live Set and compile the 8-bullet Fact Sheet',
              'Run the structured prompt through Claude, Grok, or Gemini',
              'Save the resulting Markdown table into the Live Project folder as MIX-CHECKLIST.md',
              'Cross-reference at least three checklist items directly in Live',
            ],
            [0, 1, 2, 3],
            'The step text explicitly lists auditing the Live Set to compile the Fact Sheet, running the prompt through an LLM, saving the Markdown table as MIX-CHECKLIST.md, and cross-referencing at least three items in Live as the required actions.',
          ),
        ),
      ],
      {
        minutes: 9,
        intro: 'Ground a text assistant in real session measurements, constrain its output to a Markdown checklist, and verify the result in Live.',
      },
    ),
  ],
});
