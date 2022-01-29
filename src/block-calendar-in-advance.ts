import { DateTime } from 'luxon';
import { invertCalendarFreeBusy } from './invert-calendar-free-busy';

const START_OF_WORKDAY = 10;
const END_OF_WORKDAY = 18;
const EVENT_COLOR_ID = '1';
const WEEKEND_DAYS = [6, 7];

/**
 * Blocks Google Calendar three days in advance.
 */
export function blockCalendarInAdvance(): void {
    let dayCounter = 0;
    let daysProcessed = 0;

    while (daysProcessed < 3) {
        dayCounter++;
        if (WEEKEND_DAYS.includes(DateTime.now().plus({ days: dayCounter }).weekday)) {
            continue;
        }
        daysProcessed++;

        const startOfWorkday = DateTime.now()
            .plus({ days: dayCounter })
            .set({ hour: START_OF_WORKDAY })
            .startOf('hour')
            .toISO();
        const endOfWorkday = DateTime.now()
            .plus({ days: dayCounter })
            .set({ hour: END_OF_WORKDAY })
            .startOf('hour')
            .toISO();

        const freeBusy = Calendar.Freebusy?.query({
            timeMin: startOfWorkday,
            timeMax: endOfWorkday,
            timeZone: 'Europe/Berlin',
            items: [{ id: 'primary' }],
        });

        if (!freeBusy || !hasPrimaryFreeBusy(freeBusy?.calendars)) {
            throw new Error('Could not get free/busy information for primary calendar');
        }

        const free = invertCalendarFreeBusy(
            freeBusy.calendars.primary.busy?.filter(isRequiredTimeperiod) || [],
            { start: startOfWorkday, end: endOfWorkday }
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

function isRequiredTimeperiod(period?: GoogleAppsScript.Calendar.Schema.TimePeriod): period is MyTimePeriod {
    return period !== undefined && 'start' in period && 'end' in period;
}

export type MyTimePeriod = Required<GoogleAppsScript.Calendar.Schema.TimePeriod>;
