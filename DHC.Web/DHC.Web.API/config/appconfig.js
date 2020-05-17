"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationSettings = exports.GetConfig = void 0;
const NodeConfig_1 = require("./NodeConfig");
const NodeConfig_prod_1 = require("./NodeConfig.prod");
function GetConfig(production) {
    if (production)
        return new NodeConfig_prod_1.ProdConfig();
    else
        return new NodeConfig_1.DevConfig();
}
exports.GetConfig = GetConfig;
class ApplicationSettings {
}
exports.ApplicationSettings = ApplicationSettings;
//# sourceMappingURL=appconfig.js.map