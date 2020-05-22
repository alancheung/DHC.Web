import { SqliteTable } from "./SqliteTable";
import { SqlCommand } from "./SqlCommand";

export abstract class Table implements SqliteTable {
    ID: number;

    constructor(data: any) {
        if(data) {
            this.ID = data.ID;
        }
    }

    abstract createTable(): SqlCommand;
    abstract insert(): SqlCommand;
}