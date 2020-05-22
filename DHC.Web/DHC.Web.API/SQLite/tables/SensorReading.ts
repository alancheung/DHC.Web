import { Table } from "../common-db/Table";
import { SqlCommand } from "../common-db/SqlCommand";
import { DateTable } from "../common-db/DateTable";
import { nameof } from "../../common/nameof";

export enum ReadingType {
    Temperature,
    Humidity,
    SoilMoisture,
}

export class SensorReading extends DateTable {
    /** Hostname of the sensor */
    public SourceHostName: string;

    /** Type of sensor used, eg HiLetgo DHT22 */
    public SensorModel: string;

    /** Type of reading */
    public ReadingType: ReadingType;

    /** Value of the reading */
    public ReadingValue: number;

    constructor(data) {
        super(data);
        if (data) {
            this.SourceHostName = data.SourceHostName;
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
                ${nameof<SensorReading>("SensorModel")}, 
                ${nameof<SensorReading>("ReadingType")}, 
                ${nameof<SensorReading>("ReadingValue")}
            ) VALUES (?,?,?,?,?)`;

        return new SqlCommand(insert, [
            this.StartDate.toLocaleString(),
            this.SourceHostName,
            this.SensorModel,
            this.ReadingType.toString(),
            this.ReadingValue])
    }

    validate(): boolean {
        return (!!this.StartDate && !!this.SourceHostName && !!this.SensorModel && !!this.ReadingType && (!!this.ReadingValue || this.ReadingValue == 0));
    }

}