import { AppConfig } from "./appconfig";
export class DevConfig implements AppConfig {
    public currentSoftwareVersion: number = 0;
    public currentDatabaseVersion: number = 0;
}