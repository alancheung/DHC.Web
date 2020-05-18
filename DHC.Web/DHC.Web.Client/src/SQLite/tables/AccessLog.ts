import { SqlTable } from "./sqliteTable";
import { SqlCommand } from "../sqlCommand";
import { nameof } from '../../common/nameof';
import { isbooleantrue } from "../../common/isbooleantrue";

class AccessLog implements SqlTable {
  public ID: number;
  public Name: string;
  public State: boolean;
  public EventTime: Date;

  /**
   * Parse the return value of SQLiteDB.all commands for the AccessLog object.
   * @param data Array of (probably) AccessLog objects
   */
  static parse(data: any[]): AccessLog[] {
    let parsedData: AccessLog[] = new AccessLog[0];

    // Convert string back to TS date
    if (data) {
      parsedData = data.map(d => {
        let element = new AccessLog();
        element.ID = d.ID;
        element.Name = d.Name;
        element.EventTime = new Date(d.EventTime);
        element.State = isbooleantrue(d.State);
        return element;
      });
    }

    return parsedData;
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

export { AccessLog };
