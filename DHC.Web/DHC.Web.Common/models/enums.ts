/** Types of things tracked by this version history table. */
export enum VersionHistoryModules {
    Software,
    Database,
}

export enum SensorReadingType {
    Temperature,
    Humidity,
    SoilMoisture,
}

export enum LogCategory {
    Debug = 0,
    Info = 1,
    Warning = 2,
    Error = 3
}