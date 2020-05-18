import { DevConfig } from "./NodeConfig";
import { ProdConfig } from "./NodeConfig.prod";

export interface AppConfig {
    /** The port this Express server is listening on. */
    openPort: number;

    /** The web address to redirect web requests too */
    redirectAddress: string;

    /** Current software version */
    currentSoftwareVersion: number;

    /** Current database version */
    currentDatabaseVersion: number;
}

export function GetConfig(production: boolean): AppConfig {
    if (production) return new ProdConfig();
    else return new DevConfig();
}

export class ApplicationSettings {
    public static Config: AppConfig;
}