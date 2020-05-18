export class DateTable {
    public StartDate: Date;
    public EndDate: Date;

    /**
     * Convert string dates to TS Date objects.
     * @param start
     * @param end
     */
    public parseDates(start: string, end: string): void {
        this.StartDate = new Date(start);
        this.EndDate = new Date(end);
    }
}