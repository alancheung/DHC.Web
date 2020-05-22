const Lifx = require('node-lifx-lan');

export class LifxWrapper {
    private _lifx: any = Lifx;

    public get LifxClient() {
        return this._lifx;
    }

    constructor() {
        this.discover();
    }

    public discover(): void{
        this.LifxClient.discover().then(this.printDiscovery)
            .catch((error) => {
                console.error(error);
            });
    }

    public turnOnOffice() {
        Lifx.discover().then(() => {
            return Lifx.turnOnFilter({
                filters: [{
                    group: { label: 'Office' },
                }],
                duration: 5000,
            });
        }).then(() => {
            console.log('Turn Office on!');
        }).catch((error) => {
            console.error(error);
        });
    }

    public turnOffOffice() {
        Lifx.discover().then(() => {
            return Lifx.turnOnFilter({
                filters: [{
                    group: { label: 'Office' },
                }],
                duration: 5000,
            });
        }).then(() => {
            console.log('Turn Office off!');
        }).catch((error) => {
            console.error(error);
        });
    }

    public printDiscovery(device_list: any[]) {
        console.log('New discovery attempted!')
        device_list.forEach((device) => {
            console.log([device['ip'],device['mac'], device['deviceInfo']['label']].join(' | '));
        });
    }
}
