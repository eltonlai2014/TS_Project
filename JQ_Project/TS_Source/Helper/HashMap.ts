export class HashMap {
    // Map Size
    private size:number = 0;
    // Map Object
    private entry:any = {};
    constructor() {
    }    
    // 存
    public put (key:string, value:any) {
        if (!this.containsKey(key)) {
            this.size++;
        }
        this.entry[key] = value;
    }

    // 取
    public get (key:string):any{
        if (this.containsKey(key)) {
            return this.entry[key];
        }
        else {
            return null;
        }
    }
    
    // 刪除
    public remove (key:string) {
        if (delete this.entry[key]) {
            this.size--;
        }
    }

    // 是否包含Key
    public containsKey (key:string) :boolean{
        return (key in this.entry);
    }

    // 是否包含Value
    public containsValue (value:any) :boolean{
        for (var prop in this.entry) {
            if (this.entry[prop] == value) {
                return true;
            }
        }
        return false;
    }

    // 所有Value
    public values ():any {
        var values = [];
        for (var prop in this.entry) {
            values.push(this.entry[prop]);
        }
        return values;
    }

    // 所有Key
    public keys ():string[] {
        var keys = [];
        for (var prop in this.entry) {
            keys.push(prop);
        }
        return keys;
    }

    public getSize() {
        return this.size;
    }
    // 清Map
    public clear () {
        this.size = 0;
        this.entry = {};
        return this.size;
    }    
}