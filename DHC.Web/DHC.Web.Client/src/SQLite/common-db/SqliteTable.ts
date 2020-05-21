import { SqlCommand } from "./SqlCommand";

/** A database table in SQLite that represents a unique table key and commands to create and insert the table. */
interface SqlTable {
    /** Unique row id */
    ID: number;

    /** Create a SQL command to create this table and return as a string */
    createTable(): SqlCommand;

    /** Create a SqlCommand object that represents the INSERT INTO command for this table object instance. */
    insert(): SqlCommand;
}

export { SqlTable }