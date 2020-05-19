import { SqlTable } from "../common-db/sqliteTable";
import { SqlCommand } from "../common-db/sqlCommand";
import { DateTable } from "../common-db/DateTable";
import { nameof } from "../../common/nameof";

export class Project extends DateTable {
    ID: number;

    /** Name of new project in progress */
    public Name: string;

    /** Short description */
    public Description: string;

    /** Link to repository if it exists */
    public Link: string;

    constructor(data: any) {
        super(data);
        if (data) {
            this.ID = data.ID;
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${Project.name} (
            ${nameof<Project>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<Project>("StartDate")} TEXT NOT NULL,
            ${nameof<Project>("EndDate")} TEXT,
            ${nameof<Project>("Name")} TEXT NOT NULL,
            ${nameof<Project>("Description")} TEXT
            ${nameof<Project>("Link")} TEXT)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${Project.name} 
            (${nameof<Project>("StartDate")}, ${nameof<Project>("Name")}, ${nameof<Project>("Description")}, ${nameof<Project>("Link")}) 
            VALUES (?,?,?)`,
            [this.StartDate.toLocaleString(), this.Name, this.Description, this.Link]);
    }

}