import { DateTable, SqlCommand } from "../context";
import { Todo } from "./Todo";
import { nameof } from "../../functions";

export class Project extends DateTable {
    /** Name of new project in progress */
    public Name: string;

    /** Short description */
    public Description: string;

    /** Link to repository if it exists */
    public Link: string;

    /** Any associated tasks with this project? In memory property only, not reflected in database schema. */
    public Tasks: Todo[];

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