import { SqliteTable } from "./SqliteTable";
import { SqlCommand } from "./SqlCommand";

export abstract class DateTable implements SqliteTable {
    ID: number;
    public StartDate: Date;
    public EndDate: Date;

    constructor(data: any) {
        if (data) {
            this.parseDates(data.StartDate, data.EndDate);
        }
    }

    createTable(): SqlCommand {
        throw new Error("Method should be implemented by child.");
    }
    insert(): SqlCommand {
        throw new Error("Method should be implemented by child.");
    }

    /**
     * Convert string dates to TS Date objects.
     * @param start
     * @param end
     */
    public parseDates(start: string, end: string): void {
        if (start) {
            this.StartDate = new Date(start);
        }
        if (end) {
            this.EndDate = new Date(end);
        }
    }
}