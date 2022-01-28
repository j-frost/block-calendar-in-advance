import { blockCalendarInAdvance } from './block-calendar-in-advance';

declare let global: {
    blockCalendarInAdvance: typeof blockCalendarInAdvance;
};

global.blockCalendarInAdvance = blockCalendarInAdvance;
