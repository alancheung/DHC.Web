import { DateTable, SqlCommand } from "../context";
import { nameof } from "../../functions";
import { SensorReadingType } from "../../models/enums";

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
            ${this.DefineDateTimeColumn(nameof<SensorReading>("StartDate"), true)},
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
                ${nameof<SensorReading>("SourceHostName")}, 
                ${nameof<SensorReading>("Location")}, 
                ${nameof<SensorReading>("SensorModel")}, 
                ${nameof<SensorReading>("ReadingType")}, 
                ${nameof<SensorReading>("ReadingValue")}
            ) VALUES (?,?,?,?,?)`;

        return new SqlCommand(insert, [
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