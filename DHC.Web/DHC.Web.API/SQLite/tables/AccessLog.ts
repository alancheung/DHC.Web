import { SqlTable } from "./sqliteTable";
import { SqlCommand } from "../sqlCommand";
import { nameof } from '../../common/nameof';

class AccessLog implements SqlTable {
    public ID: number;
    public Name: string;
    public State: boolean;
    public EventTime: Date;

    createTable(): string {
        let seed = `CREATE TABLE IF NOT EXISTS ${AccessLog.name} (
            ${nameof<AccessLog>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<AccessLog>("Name")} TEXT,
            ${nameof<AccessLog>("State")} INTEGER,
            ${nameof<AccessLog>("EventTime")} TEXT)`;

        return seed;
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${AccessLog.name} 
            (${nameof<AccessLog>("Name")}, ${nameof<AccessLog>("State")}, ${nameof<AccessLog>("EventTime")}) 
            VALUES (?,?,?)`,
            [this.Name, this.State, this.EventTime.toLocaleString()]);
    }
}

export { AccessLog } ;