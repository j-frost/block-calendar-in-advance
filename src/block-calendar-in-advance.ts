import { DateTime } from 'luxon';
import { invertCalendarFreeBusy } from './invert-calendar-free-busy';
import { BlockCalendarInAdvanceOptions } from './typings';

/**
 * Blocks Google Calendar three days in advance.
 *
 * @param {BlockCalendarInAdvanceOptions} options how to create blocker events
 */
export function blockCalendarInAdvance(options: BlockCalendarInAdvanceOptions): void {
    let dayPointer = -1;
    let daysProcessed = 0;

    while (daysProcessed < options.numberOfDaysToBlock) {
        dayPointer++;
        if (options.skipDays.includes(DateTime.now().plus({ days: dayPointer }).weekday)) {
            continue;
        }
        daysProcessed++;
        console.log(
            `Processing day number ${String(daysProcessed)}, today + ${String(dayPointer)} (${DateTime.now()
                .plus({ days: dayPointer })
                .toISODate()})`
        );

        const startOfWorkday = DateTime.now()
            .plus({ days: dayPointer })
            .set({ hour: options.startOfWorkday })
            .startOf('hour')
            .toISO();
        const endOfWorkday = DateTime.now()
            .plus({ days: dayPointer })
            .set({ hour: options.endOfWorkday })
            .startOf('hour')
            .toISO();

        const freeBusy = Calendar.Freebusy?.query({
            timeMin: startOfWorkday,
            timeMax: endOfWorkday,
            timeZone: Calendar.Settings?.get('timezone').value,
            items: [{ id: 'primary' }],
        });

        if (!freeBusy || !hasPrimaryFreeBusy(freeBusy.calendars)) {
            throw new Error('Could not get free/busy information for primary calendar');
        }
        const busy = freeBusy.calendars.primary.busy?.filter(isRequiredTimeperiod) ?? [];
        console.log('Got busy periods:', busy);

        const free = invertCalendarFreeBusy(busy, { start: startOfWorkday, end: endOfWorkday }).filter(
            (free) =>
                DateTime.fromISO(free.end).diff(DateTime.fromISO(free.start)).as('minutes') >=
                options.minimumMinutesToBlock
        );
        console.log('Calculated free periods:', free);

        for (const slot of free) {
            Calendar.Events?.insert(
                {
                    start: { dateTime: slot.start },
                    end: { dateTime: slot.end },
                    summary: options.event.summary,
                    description: options.event.description,
                    colorId: options.event.colorId,
                    reminders: {
                        overrides: options.event.useDefaultReminders ? undefined : [],
                        useDefault: options.event.useDefaultReminders,
                    },
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
