import { SqlCommand, DatabaseTable } from "../context";
import { nameof } from "../../functions";

export class AuthorizedClient extends DatabaseTable {
    /** The public value given to the client to interact with the database. */
    public PublicKey: string;

    /** Name of the client */
    public Name: string;

    /** The secure zone the client is in */
    public Zone: string;

    constructor(data) {
        super(data);
        if (data) {
            this.PublicKey = data.PublicKey;
            this.Name = data.Name;
            this.Zone = data.Zone;
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${AuthorizedClient.name} (
            ${nameof<AuthorizedClient>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<AuthorizedClient>("PublicKey")} BLOB NOT NULL,
            ${nameof<AuthorizedClient>("Name")} TEXT NOT NULL,
            ${nameof<AuthorizedClient>("Zone")} TEXT NOT NULL)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        let insert = `INSERT INTO ${AuthorizedClient.name} 
            (
                ${nameof<AuthorizedClient>("PublicKey")}, 
                ${nameof<AuthorizedClient>("Name")},
                ${nameof<AuthorizedClient>("Zone")}
            ) VALUES (?,?,?)`;

        return new SqlCommand(insert, [
            this.PublicKey,
            this.Name,
            this.Zone])
    }

    validate(): boolean {
        return (!!this.PublicKey
            && !!this.Name
            && !!this.Zone);
    }
}