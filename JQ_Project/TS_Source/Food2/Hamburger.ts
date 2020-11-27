import { Base_Food } from "./Base_Food";
export class Hamburger extends Base_Food{
    public getDescription(): string {
        return "[Hamburger2] " + this.descroption + " " + this.color;
    }

    public getPrice():number{
        return 100;
    }

};
//export { Hamburger };