import { DevConfig } from "./NodeConfig";
import { ProdConfig } from "./NodeConfig.prod";

export interface AppConfig {
    openPort: number;
    currentSoftwareVersion: number;
    currentDatabaseVersion: number;
}

export function GetConfig(production: boolean): AppConfig {
    if (production) return new ProdConfig();
    else return new DevConfig();
}

export class ApplicationSettings {
    public static Config: AppConfig;
}