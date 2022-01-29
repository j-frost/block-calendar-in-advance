import { DateTime } from 'luxon';
import { MyTimePeriod } from './block-calendar-in-advance';

/**
 * Inverts a list of given busy slots. Will generate a list of free time slots within a given time period.
 *
 * @param {MyTimePeriod[]} busy list of time periods that are to be considered busy
 * @param {MyTimePeriod} within time period within which to fit all found free slots
 * @returns {MyTimePeriod[]} list of time slots that are not yet filled
 */
export function invertCalendarFreeBusy(busy: MyTimePeriod[], within: MyTimePeriod): MyTimePeriod[] {
    if (busy.length === 0) {
        return [within];
    }

    busy = [
        { start: within.start, end: within.start },
        ...busy.sort(byStart),
        { start: within.end, end: within.end },
    ];
    const free: MyTimePeriod[] = [];

    for (let i = 0; i < busy.length - 1; i++) {
        free.push({
            start: fitToBounds(busy[i].end, within),
            end: fitToBounds(busy[i + 1].start, within),
        });
    }

    return free.filter((period) => !DateTime.fromISO(period.start).equals(DateTime.fromISO(period.end)));
}

function byStart(a: MyTimePeriod, b: MyTimePeriod): number {
    return DateTime.fromISO(a.start).toMillis() - DateTime.fromISO(b.start).toMillis();
}

function fitToBounds(isoDate: string, within: MyTimePeriod): string {
    if (millis(isoDate) < millis(within.start)) {
        return within.start;
    }
    if (millis(isoDate) > millis(within.end)) {
        return within.end;
    }
    return isoDate;
}

function millis(isoDate: string): number {
    return DateTime.fromISO(isoDate).toMillis();
}
