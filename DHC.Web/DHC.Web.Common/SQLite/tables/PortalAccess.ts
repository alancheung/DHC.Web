import { DatabaseTable, SqlCommand, DateTable } from "../context";
import { isbooleantrue, nameof } from "../../functions";

export class PortalAccess extends DateTable {
    public Name: string;
    public State: boolean;

    constructor(data: any) {
        super(data);
        if (data) {
            this.Name = data.Name;
            this.State = isbooleantrue(data.State);
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${PortalAccess.name} (
            ${nameof<PortalAccess>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<PortalAccess>("Name")} TEXT,
            ${nameof<PortalAccess>("State")} INTEGER,
            ${this.DefineDateTimeColumn(nameof<PortalAccess>("StartDate"), true)})`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${PortalAccess.name} 
            (${nameof<PortalAccess>("Name")}, ${nameof<PortalAccess>("State")}) 
            VALUES (?,?)`,
            [this.Name, this.State]);
    }

    validate(): boolean {
        return !!this.Name;
    }
    
}