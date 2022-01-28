import { DateTime } from 'luxon';
import { invertCalendarFreeBusy } from './invert-calendar-free-busy';

const START_OF_WORKDAY = 8;
const END_OF_WORKDAY = 18;
const EVENT_COLOR_ID = '1';

/**
 * Blocks Google Calendar three days in advance.
 */
export function blockCalendarInAdvance(): void {
    for (let i = 0; i < 3; i++) {
        if ([6, 7].includes(DateTime.now().plus({ days: i }).weekday)) {
            continue;
        }

        const freeBusy = Calendar.Freebusy?.query({
            timeMin: DateTime.now().plus({ days: i }).set({ hour: START_OF_WORKDAY }).startOf('hour').toISO(),
            timeMax: DateTime.now().plus({ days: i }).set({ hour: END_OF_WORKDAY }).startOf('hour').toISO(),
            timeZone: 'Europe/Berlin',
            items: [{ id: 'primary' }],
        });

        if (!freeBusy || !hasPrimaryFreeBusy(freeBusy?.calendars)) {
            throw new Error('Could not get free/busy information for primary calendar');
        }

        const free = invertCalendarFreeBusy(
            freeBusy.calendars.primary.busy?.filter(isRequiredTimeperiod) || [],
            {
                start: DateTime.now()
                    .plus({ days: i })
                    .set({ hour: START_OF_WORKDAY })
                    .startOf('hour')
                    .toISO(),
                end: DateTime.now().plus({ days: i }).set({ hour: END_OF_WORKDAY }).startOf('hour').toISO(),
            }
        );

        for (const slot of free) {
            Calendar.Events?.insert(
                {
                    start: { dateTime: slot.start },
                    end: { dateTime: slot.end },
                    summary: 'Do not book',
                    description: "Please don't book this time slot unless absolutely necessary.",
                    colorId: EVENT_COLOR_ID,
                },
                'primary'
            );
        }
    }
}

function hasPrimaryFreeBusy(
    calendars: object | undefined
): calendars is { primary: GoogleAppsScript.Calendar.Schema.FreeBusyCalendar } {
    return calendars !== undefined && 'primary' in calendars;
}

function isRequiredTimeperiod(
    period?: GoogleAppsScript.Calendar.Schema.TimePeriod
): period is Required<GoogleAppsScript.Calendar.Schema.TimePeriod> {
    return period !== undefined && 'start' in period && 'end' in period;
}
