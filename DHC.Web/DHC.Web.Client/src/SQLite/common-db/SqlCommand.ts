class SqlCommand {
    public command: string;
    public parameters: any[];

    constructor(cmd: string, param: any[]) {
        this.command = cmd;
        this.parameters = param;
    }
}

export { SqlCommand }