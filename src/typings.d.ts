export interface BlockCalendarInAdvanceOptions {
    numberOfDaysToBlock: number;
    startOfWorkday: number;
    endOfWorkday: number;
    skipDays: number[];
    event: {
        summary: string;
        description: string;
        colorId: string;
    };
}
