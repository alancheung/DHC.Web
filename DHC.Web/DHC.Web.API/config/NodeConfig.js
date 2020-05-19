"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevConfig = void 0;
class DevConfig {
    constructor() {
        this.dbSource = 'dhc.sqlite';
        this.openPort = 3000;
        this.redirectAddress = "http://localhost:4200";
        this.currentSoftwareVersion = 0;
        this.currentDatabaseVersion = 0;
    }
}
exports.DevConfig = DevConfig;
//# sourceMappingURL=NodeConfig.js.map