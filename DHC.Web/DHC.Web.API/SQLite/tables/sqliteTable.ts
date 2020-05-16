import { sqlCommand } from "../sqlCommand";

interface table {
    /** Unique row id */
    id: number;

    insert(obj: any): sqlCommand;
}

export { table }