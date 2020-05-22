import { Table } from "../common-db/Table";
import { SqlCommand } from "../common-db/SqlCommand";
import { nameof } from "../../common/nameof";
import { isbooleantrue } from "../../common/isbooleantrue";

export class Sensor extends Table {
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