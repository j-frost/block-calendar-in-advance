import { blockCalendarInAdvance } from './block-calendar-in-advance';
import { BlockCalendarInAdvanceOptions } from './typings';

declare let global: {
    runDefault: () => void;
    runWithConfig: (options: BlockCalendarInAdvanceOptions) => void;
};

const DEFAULTS: BlockCalendarInAdvanceOptions = {
    numberOfDaysToBlock: 4,
    startOfWorkday: 9,
    endOfWorkday: 17,
    skipDays: [6, 7],
    event: {
        summary: 'Do not book',
        description: "Please don't book this time slot unless absolutely necessary.",
        colorId: undefined,
        useDefaultReminders: false,
    },
};

/**
 * Blocks Google Calendar from 9 to 17h every day for 4 days in the future, skipping Saturday and Sunday.
 */
global.runDefault = () => {
    blockCalendarInAdvance(DEFAULTS);
};

/**
 * Blocks Google Calendar for some time in the future.
 *
 * @param {BlockCalendarInAdvanceOptions} options how to create blocker events
 * @param {number} options.numberOfDaysToBlock number of days in future to create blocker events for, detaults to 4
 * @param {number} options.startOfWorkday from when (= which hour of the day) to create blocker events on each day, defaults to 9
 * @param {number} options.endOfWorkday until when (= which hour of the day) to create blocker events on each day, defaults to 17
 * @param {number[]} options.skipDays list of days to skip when creating blocker events, f.i. weekends (Monday = 1, Sunday = 7), defaults to [6, 7] (Saturday and Sunday)
 * @param {{summary: string, description: string, colorId: string}}} options.event what blocker events should look like
 * @param {string} options.event.summary the "title" of the event (shows up on Google Calendar UI immediately), defaults to 'Do not book'
 * @param {string} options.event.description the description of the Calendar event; use this to add hints on when this blocker may be ignored, defaults to "Please don't book this time slot unless absolutely necessary."
 * @param {string} options.event.colorId the ID of the (custom) color you'd like the events to be created as (usually 1-9, but can differ depending on Calendar settings), defaults to the default color
 * @param {boolean} options.event.useDefaultReminders whether to use default Calendar event reminders or not, defaults to false
 */
global.runWithConfig = (options: BlockCalendarInAdvanceOptions) => {
    blockCalendarInAdvance(Object.assign(DEFAULTS, options));
};
