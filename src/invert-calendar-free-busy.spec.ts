import { expect } from 'chai';
import { DateTime } from 'luxon';
import { invertCalendarFreeBusy } from './invert-calendar-free-busy';

describe('Inverting calendar free and busy', () => {
    let busy: Required<GoogleAppsScript.Calendar.Schema.TimePeriod>[] = [];
    const within: Required<GoogleAppsScript.Calendar.Schema.TimePeriod> = {
        start: DateTime.now().startOf('day').toISO(),
        end: DateTime.now().endOf('day').toISO(),
    };

    describe('when given an empty list of busy slots', () => {
        it('returns the entire day', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([within]);
        });
    });

    describe('when given one busy time', () => {
        beforeEach(() => {
            busy = [
                {
                    start: DateTime.now().set({ hour: 10 }).startOf('hour').toISO(),
                    end: DateTime.now().set({ hour: 11 }).startOf('hour').toISO(),
                },
            ];
        });

        it('returns two free slots (one before, one after)', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([
                {
                    start: DateTime.now().startOf('day').toISO(),
                    end: DateTime.now().set({ hour: 10 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().set({ hour: 11 }).startOf('hour').toISO(),
                    end: DateTime.now().endOf('day').toISO(),
                },
            ]);
        });
    });

    describe('when given two busy times', () => {
        beforeEach(() => {
            busy = [
                {
                    start: DateTime.now().set({ hour: 10 }).startOf('hour').toISO(),
                    end: DateTime.now().set({ hour: 11 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().set({ hour: 13 }).startOf('hour').toISO(),
                    end: DateTime.now().set({ hour: 14 }).startOf('hour').toISO(),
                },
            ];
        });

        it('returns three free slots', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([
                {
                    start: DateTime.now().startOf('day').toISO(),
                    end: DateTime.now().set({ hour: 10 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().set({ hour: 11 }).startOf('hour').toISO(),
                    end: DateTime.now().set({ hour: 13 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().set({ hour: 14 }).startOf('hour').toISO(),
                    end: DateTime.now().endOf('day').toISO(),
                },
            ]);
        });
    });

    describe('when busy starts immediately', () => {
        beforeEach(() => {
            busy = [
                {
                    start: DateTime.now().startOf('day').toISO(),
                    end: DateTime.now().set({ hour: 11 }).startOf('hour').toISO(),
                },
            ];
        });

        it('does not return a zero length slot', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([
                {
                    start: DateTime.now().set({ hour: 11 }).startOf('hour').toISO(),
                    end: DateTime.now().endOf('day').toISO(),
                },
            ]);
        });
    });

    describe('when busy end overlaps with end of "within" period', () => {
        beforeEach(() => {
            busy = [
                {
                    start: DateTime.now().set({ hour: 10 }).startOf('hour').toISO(),
                    end: DateTime.now().endOf('day').toISO(),
                },
            ];
        });

        it('does not return a zero length slot', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([
                {
                    start: DateTime.now().startOf('day').toISO(),
                    end: DateTime.now().set({ hour: 10 }).startOf('hour').toISO(),
                },
            ]);
        });
    });

    describe('when busy end extends past end of "within" period', () => {
        beforeEach(() => {
            busy = [
                {
                    start: DateTime.now().set({ hour: 17 }).startOf('hour').toISO(),
                    end: DateTime.now().set({ hour: 18 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().plus({ day: 1 }).set({ hour: 17 }).startOf('hour').toISO(),
                    end: DateTime.now().plus({ day: 1 }).set({ hour: 18 }).startOf('hour').toISO(),
                },
            ];
        });

        it('returns only time periods within "within" period', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([
                {
                    start: DateTime.now().startOf('day').toISO(),
                    end: DateTime.now().set({ hour: 17 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().set({ hour: 18 }).startOf('hour').toISO(),
                    end: DateTime.now().endOf('day').toISO(),
                },
            ]);
        });
    });

    describe('when busy starts before start of "within" period', () => {
        beforeEach(() => {
            busy = [
                {
                    start: DateTime.now().minus({ day: 1 }).set({ hour: 17 }).startOf('hour').toISO(),
                    end: DateTime.now().minus({ day: 1 }).set({ hour: 18 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().set({ hour: 17 }).startOf('hour').toISO(),
                    end: DateTime.now().set({ hour: 18 }).startOf('hour').toISO(),
                },
            ];
        });

        it('returns only time periods within "within" period', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([
                {
                    start: DateTime.now().startOf('day').toISO(),
                    end: DateTime.now().set({ hour: 17 }).startOf('hour').toISO(),
                },
                {
                    start: DateTime.now().set({ hour: 18 }).startOf('hour').toISO(),
                    end: DateTime.now().endOf('day').toISO(),
                },
            ]);
        });
    });

    describe('when busy time fills the entire within time', () => {
        beforeEach(() => {
            busy = [
                {
                    start: DateTime.now().startOf('day').toISO(),
                    end: DateTime.now().endOf('day').toISO(),
                },
            ];
        });

        it('returns no free time', () => {
            expect(invertCalendarFreeBusy(busy, within)).to.deep.equal([]);
        });
    });
});
