import { nameof, isbooleantrue } from '../functions';
import { SqlCommand, DatabaseTable, DateTable } from './context';
import { SensorReadingType, VersionHistoryModules, LogCategory } from '../models/enums';

export class AccessLog extends DatabaseTable {
    public Name: string;
    public State: boolean;
    public EventTime: Date;

    constructor(data: any) {
        super(data);
        if (data) {
            this.Name = data.Name;
            // Convert string back to TS date
            this.EventTime = new Date(data.EventTime);
            this.State = isbooleantrue(data.State);
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${AccessLog.name} (
            ${nameof<AccessLog>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<AccessLog>("Name")} TEXT,
            ${nameof<AccessLog>("State")} INTEGER,
            ${nameof<AccessLog>("EventTime")} TEXT NOT NULL)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${AccessLog.name} 
            (${nameof<AccessLog>("Name")}, ${nameof<AccessLog>("State")}, ${nameof<AccessLog>("EventTime")}) 
            VALUES (?,?,?)`,
            [this.Name, this.State, this.EventTime.toLocaleString()]);
    }
}

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

export class Sensor extends DatabaseTable {
    /** Manufacturer of the sensor */
    public Make: string;

    /** Type of sensor used, eg HiLetgo DHT22 */
    public Model: string;

    /** Is the reading in digital or analog output? */
    public Analog: boolean;

    constructor(data) {
        super(data);
        if (data) {
            this.Make = data.Make;
            this.Model = data.Model;
            this.Analog = isbooleantrue(data.Analog);
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${Sensor.name} (
            ${nameof<Sensor>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<Sensor>("Make")} TEXT,
            ${nameof<Sensor>("Model")} TEXT NOT NULL,
            ${nameof<Sensor>("Analog")} INTEGER)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        let insert = `INSERT INTO ${Sensor.name} 
            (
                ${nameof<Sensor>("Make")}, 
                ${nameof<Sensor>("Model")}, 
                ${nameof<Sensor>("Analog")}
            ) VALUES (?,?,?)`;

        return new SqlCommand(insert, [
            this.Make,
            this.Model,
            this.Analog ? 1 : 0]);
    }
}

export class SensorReading extends DateTable {
    /** Hostname of the sensor */
    public SourceHostName: string;

    /** Location of the sensor */
    public Location: string;

    /** Type of sensor used, eg HiLetgo DHT22 */
    public SensorModel: string;

    /** Type of reading */
    public ReadingType: SensorReadingType;

    /** Value of the reading */
    public ReadingValue: number;

    constructor(data) {
        super(data);
        if (data) {
            this.SourceHostName = data.SourceHostName;
            this.Location = data.Location;
            this.SensorModel = data.SensorModel;
            this.ReadingType = data.ReadingType;
            this.ReadingValue = data.ReadingValue;
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${SensorReading.name} (
            ${nameof<SensorReading>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<SensorReading>("StartDate")} TEXT NOT NULL,
            ${nameof<SensorReading>("SourceHostName")} TEXT NOT NULL,
            ${nameof<SensorReading>("Location")} TEXT NOT NULL,
            ${nameof<SensorReading>("SensorModel")} TEXT NOT NULL,
            ${nameof<SensorReading>("ReadingType")} TEXT NOT NULL,
            ${nameof<SensorReading>("ReadingValue")} REAL NOT NULL)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        let insert = `INSERT INTO ${SensorReading.name} 
            (
                ${nameof<SensorReading>("StartDate")}, 
                ${nameof<SensorReading>("SourceHostName")}, 
                ${nameof<SensorReading>("Location")}, 
                ${nameof<SensorReading>("SensorModel")}, 
                ${nameof<SensorReading>("ReadingType")}, 
                ${nameof<SensorReading>("ReadingValue")}
            ) VALUES (?,?,?,?,?,?)`;

        return new SqlCommand(insert, [
            this.StartDate.toLocaleString(),
            this.SourceHostName,
            this.Location,
            this.SensorModel,
            this.ReadingType.toString(),
            this.ReadingValue])
    }

    validate(): boolean {
        return (!!this.StartDate
            && !!this.SourceHostName
            && !!this.Location
            && !!this.SensorModel
            && !!this.ReadingType
            && (!!this.ReadingValue || this.ReadingValue == 0));
    }
}

export class Todo extends DateTable {
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

export class VersionHistory extends DatabaseTable {
    Module: VersionHistoryModules;
    Version: number;
    Notes: string;
    BootTime: Date;

    /**
     * Determine if the provided database requires an upgrade based on the current version number 
     * @param db Reference to the 
     * @param version
     * @returns True if upgrade required, false otherwise.
     */
    static RequiresUpgrade(db: any, version: number): boolean {
        db.all(`SELECT TOP(1) * FROM ${VersionHistory.name} WHERE Module = ${VersionHistoryModules.Database} ORDER BY ${nameof<VersionHistory>('Version')} DESC
                UNION
                SELECT TOP(1) * FROM ${VersionHistory.name} WHERE Module = ${VersionHistoryModules.Software} ORDER BY ${nameof<VersionHistory>('Version')} DESC`,
            (err, data: VersionHistory[]) => {
                if (err) throw err;

                let database
            });

        return false;
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${VersionHistory.name} (
            ${nameof<VersionHistory>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<VersionHistory>("Module")} TEXT,
            ${nameof<VersionHistory>("Version")} INTEGER,
            ${nameof<VersionHistory>("Notes")} TEXT,
            ${nameof<VersionHistory>("BootTime")}`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        return new SqlCommand(`INSERT INTO ${VersionHistory.name} 
            (${nameof<VersionHistory>("Module")}, ${nameof<VersionHistory>("Version")}, ${nameof<VersionHistory>("Notes")}) 
            VALUES (?,?,?)`,
            [this.Module, this.Version.toString(), this.Notes]);
    }
}

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