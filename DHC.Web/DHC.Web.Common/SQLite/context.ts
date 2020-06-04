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

export abstract class DatabaseTable implements SqliteTable {
    ID: number;

    constructor(data: any) {
        if (data) {
            this.ID = data.ID;
        }
    }

    abstract createTable(): SqlCommand;
    abstract insert(): SqlCommand;

    /** TODO Add for all tables */
    public validate(): boolean {
        return true;
    }
}

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

