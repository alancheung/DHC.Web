/** https://www.npmjs.com/package/node-lifx-lan#LifxLanDevice-object */
export class LightInfo {
    public IP: string;
    public MAC: string;
    public LightName: string;
    public GroupName: string;
    public State: LightState;

    constructor(device: any[]) {
        this.IP = device['ip'];
        this.MAC = device['mac'];
        this.LightName = device['deviceInfo']['label'];
        this.GroupName = device['deviceInfo']['group']['label'];
        this.State = undefined;
    }
}

/** https://www.npmjs.com/package/node-lifx-lan#LifxLanDevice-lightGet-method */
export class LightState {
    public Color: LightColor;
    public Power: boolean;
    public LightName: string;

    constructor(stateInfo: any) {
        this.Color = new LightColor(stateInfo['color']);
        this.Power = stateInfo['power'];
        this.LightName = stateInfo['label'];
    }
}

/** https://www.npmjs.com/package/node-lifx-lan#LifxLanColorHSB-object */
export class LightColor {
    public Hue: number;
    public Saturation: number;
    public Brightness: number;
    public Kelvin: number;

    constructor(colorInfo: any) {
        this.Hue = colorInfo['hue'];
        this.Saturation = colorInfo['saturation'];
        this.Brightness = colorInfo['brightness'];
        this.Kelvin = colorInfo['kelvin'];
    }
}