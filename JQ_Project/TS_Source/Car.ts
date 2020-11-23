namespace com.syspower.test.util {
    export class Car {
        descroption: string;
        color: string;
        private brakes: string;

        constructor(initObj: any) {
            this.descroption = '我是車子';
            this.color = initObj.color;
            this.brakes = '商業機密的煞車方式';
        }

        public getDescription(): string {
            return `${this.descroption} - ${this.color}`;
        }

        public triggerBrakes(): string {
            if (this.brakes === '商業機密的煞車方式') {
                return '用了商業機密的煞車方式';
            }
            return '沒有機密方式，沒有煞車';
        }
    };
    export class Foo extends Car{
        //descroption: string;
        //color: string;
        private brakes2: string;

        constructor(initObj: any) {
            super(initObj);
            this.brakes2 = 'FOO 商業機密的煞車方式';
            //this.descroption = '我是車子';
            //this.color = color;
            //this.brakes = '商業機密的煞車方式';
        }

        public triggerBrakes(): string {
            return this.brakes2;
        }
    }    
}

