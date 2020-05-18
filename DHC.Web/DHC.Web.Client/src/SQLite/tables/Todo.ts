import { SqlTable } from "./sqliteTable";
import { SqlCommand } from "../sqlCommand";
import { DateTable } from "./DateTable";
import { nameof } from "../../common/nameof";

export class Todo extends DateTable implements SqlTable {
    public ID: number;
    public StartDate: Date;
    public EndDate: Date;
    
    public Task: string;
    public Priority: number;

    constructor(data: any) {
        super();
        // Convert string back to TS date
        if (data) {
            this.ID = data.ID;
            this.Task = data.Task;
            this.Priority = data.Priority;
            this.parseDates(data.StartDate, data.EndDate);
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${Todo.name} (
            ${nameof<Todo>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<Todo>("StartDate")} TEXT,
            ${nameof<Todo>("EndDate")} TEXT,
            ${nameof<Todo>("Task")} TEXT,
            ${nameof<Todo>("Priority")} INTEGER)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${Todo.name} 
            (${nameof<Todo>("StartDate")}, ${nameof<Todo>("Priority")}, ${nameof<Todo>("Task")}) 
            VALUES (?,?,?)`,
            [this.StartDate.toLocaleString(), this.Priority, this.Task]);
    }

}