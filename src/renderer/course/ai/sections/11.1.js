/**
 * Section 11.1 — Insert and open Assistant
 * Module 11 — Ozone Master Assistant
 *
 * Hand-authored from the textbook file:
 *   Desktop/DDW ACADEMY - COURSE MATERIAL OVERHAUL/AI Tools for Music
 *     Production Course/Module-11-Ozone-Master-Assistant/
 *     Lesson-11.1.1-Ozone-12-Architecture-And-Master-Assistant.md
 *
 * `sources` cites 'Ozone 12 user guide' — whitelisted in known-sources.json,
 * matching the lesson file's own "iZotope Ozone 12 User Guide" citation.
 */
import {
  module_, lesson, step, prose, callout, table, sources, mcq, order, text,
} from '../../schema.js';

export default module_({
  id: 'ai-m11-1',
  code: '11.1',
  title: 'Insert and open Assistant',
  outcomes: [
    'Master Assistant is running on the master channel of a finished mix (not a raw generate dump).',
  ],
  sources: ['Ozone 12 user guide'],
  practiceFocus: ['Assistant screen open on a bounced mix'],
  checkpoints: ['Learner can find the Assistant control without the page'],
  lessons: [
    lesson(
      'ai-tools-music-l11-1-1',
      'Insert and open Assistant',
      [
        step(
          'The mothership requirement',
          [
            prose(
              `<strong>Master Assistant</strong> is an intelligent psychoacoustic analysis engine embedded
          exclusively within the header of the primary <strong>Ozone 12</strong> mothership plug-in. It
          is not a separate tool, and it is not available from any individual component plug-in.`,
            ),
            callout(
              'warning',
              'Mothership requirement',
              'Master Assistant is <strong>only</strong> accessible from the primary Ozone 12 container plug-in. If you insert an individual component plug-in (e.g. Ozone 12 Maximizer or Ozone 12 Dynamic EQ), the Master Assistant header button will not exist.',
            ),
            sources(['Ozone 12 user guide']),
          ],
          mcq(
            'Where is Master Assistant exclusively embedded?',
            [
              'In every individual Ozone 12 component plug-in',
              'Only within the header of the primary Ozone 12 mothership plug-in',
              'As a separate standalone tool',
              'Inside the Ozone 12 Maximizer component',
            ],
            1,
            'The step text states that Master Assistant is an intelligent psychoacoustic analysis engine embedded exclusively within the header of the primary Ozone 12 mothership plug-in and is not a separate tool or available from any individual component plug-in.',
          ),
        ),
        step(
          'Prepare the master track, load Ozone, launch the Assistant',
          [
            table(
              ['Step', 'What to do'],
              [
                ['1. Master buss ingestion', 'Set Master fader to unity (0.0 dB); ensure master peaks sit between -6 dBFS and -3 dBFS with no clipping before Ozone'],
                ['2. Load Ozone 12', "In Live's Browser, navigate to Plug-ins → VST3 → iZotope → Ozone 12 (or Audio Units on macOS) and drag it onto the Master Track"],
                ['3. Launch Master Assistant', 'Open the Ozone 12 window and click the circular Master Assistant icon in the top-center header'],
              ],
              'The three-step sequence for getting Master Assistant open on a finished mix.',
            ),
            prose(
              `Once open, verify your interface mode: <strong>Ozone 12 Elements</strong> loads straight
          into Assistant View with macros for Tonal Balance, Vocal Balance, Loudness, and Extras;
          <strong>Ozone 12 Standard / Advanced</strong> instead shows Assistant View and Module View as
          separate tabs in the top header.`,
            ),
          ],
          order(
            'What is the correct three-step sequence for getting Master Assistant open on a finished mix?',
            [
              'Launch Master Assistant',
              'Load Ozone 12',
              'Master buss ingestion',
            ],
            [
              'Master buss ingestion',
              'Load Ozone 12',
              'Launch Master Assistant',
            ],
            'The step text explicitly lists the sequence as 1. Master buss ingestion, 2. Load Ozone 12, 3. Launch Master Assistant.',
          ),
        ),
        step(
          'Lab: audit the interface and record the edition',
          [
            prose(
              `Load Ozone 12 onto the master channel of a completed production, open the Master
          Assistant setup window, and record the exact version and edition string displayed in the
          Ozone settings panel into <code>STUDIO-SHEET.md</code>. Knowing whether you are running
          Elements, Standard, or Advanced determines which of the next two sections' features are
          available to you.`,
            ),
          ],
          text(
            'What are the three possible editions of Ozone 12 that might be displayed in the settings panel?',
            ['elements, standard, advanced', 'elements standard advanced', 'elements, standard or advanced'],
            'The step text explicitly states that knowing whether you are running Elements, Standard, or Advanced determines which features are available.',
          ),
        ),
      ],
      {
        minutes: 8,
        intro: 'Load the Ozone 12 mothership onto the Master Track of a finished mix and open Master Assistant.',
      },
    ),
  ],
});
