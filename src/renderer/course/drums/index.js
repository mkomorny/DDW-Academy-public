/**
 * Drums track. The lessons are the textbook in
 * Drum-Rhythm-&-Programming-Course, imported by tools/import-drums-textbook.mjs.
 * Lessons 3.1.1 and 3.1.2 stay the shipped house pilots. The textbook marks
 * those two files frozen.
 */
import { LEVELS as TEXTBOOK } from './textbook/levels.js';
import kick from './2-1.js';
import hats from './2-2.js';

export const LEVELS = TEXTBOOK.map((level) => {
  if (level.number !== 3) return level;
  return {
    ...level,
    modules: level.modules.map((mod) => {
      if (mod.code !== '3.1') return mod;
      return {
        ...mod,
        lessons: [
          { ...kick, id: 'drums-l3-1-1' },
          { ...hats, id: 'drums-l3-1-2' },
          ...mod.lessons,
        ],
      };
    }),
  };
});

/** Readiness records, not locks. Letters follow the textbook. */
export const GATES = [
  { id: 'drums-A', afterLevel: 3, title: 'Gate A', requires: 'A house beat: kick on every beat, then snare and hats, and you can say why that is not dubstep or drum and bass' },
  { id: 'drums-B', afterLevel: 4, title: 'Gate B', requires: 'An 8-pad Drum Rack on stock devices, with the open hat choked by the closed hat' },
  { id: 'drums-C', afterLevel: 6, title: 'Gate C', requires: 'A tuned long 808 kept off the drum bus, and Drum Buss on the kit only' },
  { id: 'drums-D', afterLevel: 7, title: 'Gate D', requires: 'Launchkey MK4 pads in Drum mode, notes 36–51 on channel 10, polyphonic aftertouch, not MPE' },
  { id: 'drums-E', afterLevel: 8, title: 'Gate E', requires: 'A dubstep drum sketch at about 140 whose snare stays on beat 3' },
  { id: 'drums-F', afterLevel: 9, title: 'Gate F', requires: 'A drum-and-bass sketch at about 174, two-step, from a kit or a licensed break' },
  { id: 'drums-G', afterLevel: 11, title: 'Gate G', requires: 'An 8-bar drum loop recorded into the Arrangement, with a locator on each section' },
  { id: 'drums-H', afterLevel: 12, title: 'Gate H', requires: 'One finished dubstep or drum-and-bass drum track, exported as a WAV' },
];
