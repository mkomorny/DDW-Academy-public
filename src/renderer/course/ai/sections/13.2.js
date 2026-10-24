/**
 * Section 13.2 — Quote the Terms you are relying on
 * Module 13 — Usage log and current Terms
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-13-Usage-Log-And-Terms/
 *     Lesson-13.2.1-Legal-Frameworks-And-Commercial-Terms-Compliance.md
 *
 * No sources() block: the lesson cites vendor Terms of Service (Suno,
 * Moises, Deezer) and the U.S. Copyright Office Policy Statement, none of
 * which resolve against known-sources.json.
 *
 * Closes Module 13 with Gate J's own self-assessment checklist text.
 */
import {
  module_, lesson, step, prose, diagram, callout, table, mcq, order,
} from '../../schema.js';

export default module_({
  id: 'ai-m13-2',
  code: '13.2',
  title: 'Quote the Terms you are relying on',
  outcomes: ['The log contains quotations, not paraphrases.'],
  sources: [],
  practiceFocus: ['Paste the quotes into the log'],
  checkpoints: ['Every generative or separation tool in the Set has a quote or a “not used” line'],
  lessons: [
    lesson(
      'ai-tools-music-l13-2-1',
      'Quote the Terms you are relying on',
      [
        step(
          'Two distinct legal layers',
          [
            prose(
              `Producers must navigate two distinct legal layers when utilizing AI music production
          tools. <strong>Contractual Terms of Service</strong> govern your commercial rights between you
          and the software vendor — Suno, Moises, and so on. <strong>Statutory intellectual property
          law</strong>, administered by the U.S. Copyright Office, governs whether the resulting work is
          recognized as a copyrightable musical composition or sound recording under federal law.
          Satisfying one layer never satisfies the other.`,
            ),
            diagram(
              [
                { id: 'contract', label: 'Vendor Terms compliance' },
                { id: 'statutory', label: 'Human authorship doctrine' },
                { id: 'audit', label: 'Commercial audit passed' },
              ],
              [
                { from: 'contract', to: 'statutory' },
                { from: 'statutory', to: 'audit' },
              ],
              { layout: 'chain', caption: 'Both compliance tiers must be satisfied in sequence.' },
            ),
            callout(
              'warning',
              'Not legal advice',
              'This course material provides technical and procedural documentation regarding software terms and public administrative guidance. It does not constitute formal legal advice. For commercial distribution and synchronization licensing, consult qualified entertainment legal counsel.',
            ),
          ],
          order(
            'What is the required sequence of compliance tiers when using AI music production tools?',
            [
              'Vendor Terms compliance',
              'Human authorship doctrine',
              'Commercial audit passed',
            ],
            [
              'Vendor Terms compliance',
              'Human authorship doctrine',
              'Commercial audit passed',
            ],
            'The step text explicitly states the sequence as Vendor Terms compliance -> Human authorship doctrine -> Commercial audit passed, which must both be satisfied in sequence.',
          ),
        ),
        step(
          'Quote, never paraphrase',
          [
            table(
              ['Source', 'What the quote must establish'],
              [
                ['Suno Terms of Service', 'Paid-tier ownership of Output, subject to compliance — but generation alone does not guarantee statutory copyright ownership'],
                ['Moises Terms of Use', 'You retain rights in uploaded original audio; Moises grants no rights to underlying third-party copyrighted works'],
                ['Deezer Spleeter (MIT License)', 'Source separation models are for research/personal use; copyrighted material requires prior rights-holder authorization'],
                ['U.S. Copyright Office Policy Statement', 'AI contributions beyond de minimis must be disclosed in registration applications'],
              ],
              'The four mandatory statutory/contractual citation blocks, quoted un-paraphrased.',
            ),
            prose(
              `Add these citations to <code>USAGE-LOG.md</code> exactly as published — un-paraphrased. If
          a specific tool was not used in a given session (for example, Spleeter was never run), mark
          that entry as <code>"NOT APPLICABLE — TOOL NOT UTILIZED"</code> rather than deleting the row.`,
            ),
          ],
          mcq(
            'According to the instructions, what must be done with the four citation blocks in USAGE-LOG.md?',
            [
              "Paraphrase them to fit the project's style",
              'Quote them exactly as published without any changes',
              'Delete any block for a tool that was not used in the session',
              'Summarize each one in your own words',
            ],
            1,
            'The step text states to add these citations to USAGE-LOG.md exactly as published — un-paraphrased.',
          ),
        ),
        step(
          'Lab: verify Gate J',
          [
            table(
              ['Gate J requirement', 'Evidence'],
              [
                ['Complete USAGE-LOG.md exists in the Live Project root', 'File present and openable beside the Set'],
                ['Every separation, generative, conversion, and mastering run documented', 'Dates, settings, and file paths per run'],
                ['All four contractual/statutory quotations embedded, un-paraphrased', 'Exact vendor and USCO text'],
                ['Filenames and directories strictly match documented entries', 'Verified against disk'],
              ],
              'Gate J — Usage Log & Terms Self-Assessment Checkpoint.',
            ),
            prose(
              `Review the <code>USAGE-LOG.md</code> file in your active project, paste the exact citation
          block into its bottom section, and confirm every physical filename and disk directory matches
          the documented entries with 100% accuracy before considering Gate J satisfied.`,
            ),
          ],
          mcq(
            'According to the Gate J checkpoint, what must be true about the contractual/statutory quotations in USAGE-LOG.md?',
            [
              'They must be paraphrased in your own words',
              'They must be embedded un-paraphrased',
              'They must be summarized by the vendor',
              'They must appear only in the filenames',
            ],
            1,
            'The step text explicitly states that all four contractual/statutory quotations must be embedded, un-paraphrased with exact vendor and USCO text.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'Separate contractual vendor compliance from statutory copyright compliance, and embed the four mandatory citation blocks un-paraphrased.',
      },
    ),
  ],
});
