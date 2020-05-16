import { table } from "./sqliteTable";
import { sqlCommand } from "../sqlCommand";

class AccessLog implements table {
    public id: number;
    public portalName: string;
    public state: boolean;
    public eventtime: Date;

    constructor (portal: string, open: boolean, eventtime: Date) {
        this.portalName = portal;
        this.state = open;
        this.eventtime = eventtime;
    }

    static createTable(): string {
        let seed = `CREATE TABLE AccessLog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            state INTEGER,
            eventtime TEXT)`;

        return seed;
    }

    insert(): sqlCommand {
        return new sqlCommand(`INSERT INTO AccessLog (name, state, eventtime) VALUES (?,?,?)`, [this.portalName, this.state, this.eventtime.toLocaleString()]);
    }
}

export { AccessLog } ;