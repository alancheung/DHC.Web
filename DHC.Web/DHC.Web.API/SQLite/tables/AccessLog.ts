import { SqlTable } from "./sqliteTable";
import { SqlCommand } from "../sqlCommand";
import { nameof } from '../../common/nameof';
import { isbooleantrue } from "../../common/isbooleantrue";

class AccessLog implements SqlTable {
    public ID: number;
    public Name: string;
    public State: boolean;
    public EventTime: Date;

    constructor(data: any) {
        // Convert string back to TS date
        if (data) {
            this.ID = data.ID;
            this.Name = data.Name;
            this.EventTime = new Date(data.EventTime);
            this.State = isbooleantrue(data.State);
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${AccessLog.name} (
            ${nameof<AccessLog>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<AccessLog>("Name")} TEXT,
            ${nameof<AccessLog>("State")} INTEGER,
            ${nameof<AccessLog>("EventTime")} TEXT)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${AccessLog.name} 
            (${nameof<AccessLog>("Name")}, ${nameof<AccessLog>("State")}, ${nameof<AccessLog>("EventTime")}) 
            VALUES (?,?,?)`,
            [this.Name, this.State, this.EventTime.toLocaleString()]);
    }
}

export { AccessLog } ;