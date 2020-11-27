import { Base_Food } from "./Base_Food";
export class FrenchFries extends Base_Food{
    public getDescription(): string {
        return "[FrenchFries2] "+this.descroption + " " + this.color;
    }
};
//export { FrenchFries };