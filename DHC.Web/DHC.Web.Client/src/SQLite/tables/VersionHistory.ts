import { SqlTable } from "../common-db/sqliteTable";
import { SqlCommand } from "../common-db/sqlCommand";
import { nameof } from '../../common/nameof';

/** Types of things tracked by this version history table. */
enum VersionHistoryModules {
    Software,
    Database,
}

class VersionHistory implements SqlTable {
    ID: number;
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

export {VersionHistory}