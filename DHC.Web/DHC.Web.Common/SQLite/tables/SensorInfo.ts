import { DatabaseTable, SqlCommand } from "../context";
import { isbooleantrue, nameof } from "../../functions";

export class SensorInfo extends DatabaseTable {
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
        let seed = `CREATE TABLE IF NOT EXISTS ${SensorInfo.name} (
            ${nameof<SensorInfo>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<SensorInfo>("Make")} TEXT,
            ${nameof<SensorInfo>("Model")} TEXT NOT NULL,
            ${nameof<SensorInfo>("Analog")} INTEGER)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        let insert = `INSERT INTO ${SensorInfo.name} 
            (
                ${nameof<SensorInfo>("Make")}, 
                ${nameof<SensorInfo>("Model")}, 
                ${nameof<SensorInfo>("Analog")}
            ) VALUES (?,?,?)`;

        return new SqlCommand(insert, [
            this.Make,
            this.Model,
            this.Analog ? 1 : 0]);
    }
}