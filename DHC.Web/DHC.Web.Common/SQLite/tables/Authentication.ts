import { SqlCommand, DatabaseTable } from "../context";
import { nameof } from "../../functions";
import { AuthorizedClient } from "./AuthorizedClient";

export class Authentication extends DatabaseTable {
    /** Which client does this authorization belong to? */
    public Client: AuthorizedClient;
    /** FK to AuthorizedClient */
    public ClientId: number;

    /** Raw value of the hash */
    public Hash: string;

    /** What method is the authentication request coming from? */
    public Type: string;

    constructor(data) {
        super(data);
        if (data) {
            this.Hash = data.Hash;
            this.Type = data.Type;

            // Take ID where you can. No need to build the whole object out for now.
            if (data.ClientId) {
                this.ClientId = data.ClientId;
            } else if (data.Client) {
                this.ClientId = data.Client.ID;
            }
        }
    }

    createTable(): SqlCommand {
        let seed = `CREATE TABLE IF NOT EXISTS ${Authentication.name} (
            ${nameof<Authentication>("ID")} INTEGER PRIMARY KEY AUTOINCREMENT,
            ${nameof<Authentication>("ClientId")} INTEGER REFERENCES ${AuthorizedClient.name} (${nameof<AuthorizedClient>("ID")}) ON DELETE CASCADE,
            ${nameof<Authentication>("Hash")} BLOB NOT NULL,
            ${nameof<Authentication>("Type")} TEXT NOT NULL)`;

        return new SqlCommand(seed, []);
    }

    insert(): SqlCommand {
        let insert = `INSERT INTO ${Authentication.name} 
            (
                ${nameof<Authentication>("ClientId")}, 
                ${nameof<Authentication>("Hash")}, 
                ${nameof<Authentication>("Type")}
            ) VALUES (?,?,?)`;

        return new SqlCommand(insert, [
            this.ClientId,
            this.Hash,
            this.Type])
    }

    validate(): boolean {
        return (!!this.ClientId
            && !!this.Hash
            && !!this.Type);
    }
}