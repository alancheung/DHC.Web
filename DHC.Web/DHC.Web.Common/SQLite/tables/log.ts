import { LogCategory } from "../../models/enums";
import { DateTable, SqlCommand } from "../context";
import { nameof } from "../../functions";

export class Log extends DateTable {
    /** Logging category */
    public Category: LogCategory;

    /** The log message or stack trace */
    public Message: string;

    /** The name of the application this message originated from */
    public Application: string;

    /** The file or component this message originated from */
    public Source: string;

    constructor(data: any) {
        super(data);
        if (data) {
            this.Category = data.Category;
            this.Message = data.Message;
            this.Application = data.Application;
            this.Source = data.Source;
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${Log.name} (
            ${nameof<Log>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<Log>("StartDate")} TEXT NOT NULL,
            ${nameof<Log>("Category")} INTEGER,
            ${nameof<Log>("Message")} TEXT,
            ${nameof<Log>("Application")} TEXT,
            ${nameof<Log>("Source")} TEXT)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${Log.name} 
            (${nameof<Log>("StartDate")}, ${nameof<Log>("Category")}, ${nameof<Log>("Message")}, ${nameof<Log>("Application")}, ${nameof<Log>("Source")}) 
            VALUES (?,?,?,?,?)`,
            [this.StartDate.toLocaleString(), this.Category, this.Message, this.Application, this.Source]);
    }
}