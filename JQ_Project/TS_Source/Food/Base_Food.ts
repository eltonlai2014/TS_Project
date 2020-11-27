export class Base_Food {
    descroption: string;
    color: string;
    constructor(initObj: any) {
        this.descroption = initObj.descroption;
        this.color = initObj.color;
    }

    public getDescription(): string {
        return "[Base_Food] " + this.descroption + "-" + this.color;
    }

};
