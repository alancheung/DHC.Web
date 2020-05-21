import { SqliteTable } from "../common-db/SqliteTable";
import { SqlCommand } from "../common-db/SqlCommand";
import { DateTable } from "../common-db/DateTable";
import { nameof } from "../../common/nameof";
import { Project } from "./Project";

export class Todo extends DateTable {
    public ID: number;

    /** Description of task to be performed. */
    public Task: string;

    /** What type of Todo is this? */
    public Type: string;

    /** What was the cost associated? */
    public Cost: number;

    /** Simple ordering system based on priority */
    public Priority: number;

    /** What project does this task relate to? */
    public Project: Project;
    /** Foreign Key value to Project */
    public ProjectId: number;

    constructor(data: any) {
        super(data);
        // Convert string back to TS date
        if (data) {
            this.ID = data.ID;
            this.Task = data.Task;
            this.Type = data.Type;
            this.Cost = data.Cost;
            this.Priority = data.Priority;
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${Todo.name} (
            ${nameof<Todo>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<Todo>("StartDate")} TEXT NOT NULL,
            ${nameof<Todo>("EndDate")} TEXT,
            ${nameof<Todo>("Task")} TEXT NOT NULL,
            ${nameof<Todo>("Type")} TEXT,
            ${nameof<Todo>("Cost")} REAL,
            ${nameof<Todo>("Priority")} INTEGER,
            ${nameof<Todo>("ProjectId")} INTEGER REFERENCES ${Project.name} (${nameof<Project>("ID")}) ON DELETE CASCADE)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${Todo.name} 
            (${nameof<Todo>("StartDate")}, ${nameof<Todo>("Priority")}, ${nameof<Todo>("Task")}) 
            VALUES (?,?,?)`,
            [this.StartDate.toLocaleString(), this.Priority, this.Task]);
    }
}