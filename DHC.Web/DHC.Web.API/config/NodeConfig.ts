import { AppConfig } from "./appconfig";
export class DevConfig implements AppConfig {
    public dbSource: string = 'dhc.sqlite';
    public openPort: number = 3000;
    public redirectAddress: string = "http://localhost:4200";
    public currentSoftwareVersion: number = 0;
    public currentDatabaseVersion: number = 0;
    public authorizedClients: object[] = [];
}