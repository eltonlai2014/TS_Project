import { Base_Food } from "./Base_Food";
export class Hamburger extends Base_Food{
    public getDescription(): string {
        return "[Hamburger] " + this.descroption + " " + this.color;
    }

    private getPrice():number{
        return 100;
    }

};
//export { Hamburger };