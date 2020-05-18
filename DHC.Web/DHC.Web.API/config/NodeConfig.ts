import { AppConfig } from "./appconfig";
export class DevConfig implements AppConfig {
    public openPort: number = 3000;
    public currentSoftwareVersion: number = 0;
    public currentDatabaseVersion: number = 0;
}