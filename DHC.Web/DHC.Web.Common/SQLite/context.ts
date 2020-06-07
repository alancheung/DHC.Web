import { nameof } from "../functions";

/** Wrapper object describing a SQL command with optional parameters. */
export class SqlCommand {
    public command: string;
    public parameters: any[];

    constructor(cmd: string, param: any[]) {
        this.command = cmd;
        this.parameters = param;
    }
}

/** A database table in SQLite that represents a unique table key and commands to create and insert the table. */
export interface SqliteTable {
    /** Unique row id */
    ID: number;

    /** Create a SQL command to create this table and return as a string */
    createTable(): SqlCommand;

    /** Create a SqlCommand object that represents the INSERT INTO command for this table object instance. */
    insert(): SqlCommand;

    /** Verify that the table entry can be put into the database */
    validate(): boolean;
}

/** Base implementation of a DHC SQLite database table. Provides default field 'ID' */
export abstract class DatabaseTable implements SqliteTable {
    ID: number;

    constructor(data: any) {
        if (data) {
            this.ID = data.ID;
        }
    }

    abstract createTable(): SqlCommand;
    abstract insert(): SqlCommand;

    public validate(): boolean {
        return true;
    }
}

/** Definition of a DHC SQLite table that implements datetime fields. */
export abstract class DateTable extends DatabaseTable {
    public StartDate: Date;
    public EndDate: Date;

    constructor(data: any) {
        super(data);
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
     * Return the SQLite table definition for a date, defaulted to CURRENT_TIMESTAMP.
     * @param columnName
     */
    protected DefineDateTimeTable(columnName: string): string {
        return `${columnName} TEXT DEFAULT CURRENT_TIMESTAMP`
    }

    /**
     * Convert string dates to TS Date objects.
     * @param start
     * @param end
     */
    public parseDates(start: string, end: string): void {
        if (start) {
            this.StartDate = new Date(start);
        } else {
            this.StartDate = new Date();
        }

        if (end) {
            this.EndDate = new Date(end);
        }
    }
}

