/*
    初始化         
    var initObj = {
        "ComponentId": "VerifyNumber", "FontType": "Arial, sans-serif", "FontSize": 32,
        "NumberColor": "#0000FF", "BgColor": "#dddddd", "MaxNumber": aMaxNumber,
        "VerifyNumber":56789
    };
*/

namespace SyspowerTS.Util {
    export class VerifyNumber{
        ComponentId: string;
        FontType: string;
        FontSize: number;　　　　　　                        // 字型大小　　　　　　
        NumberColor: string;                               // 數字顏色
        BgColor: string;                                   // 背景顏色
        MaxNumber: number;        　                       // 最大號碼(亂數產生)
        VerifyNumber: number;                              // 頁面設定驗證碼
        ZeroArray = ["", "0", "00", "000"];
        cWidth: number;
        cHeight: number;

        mCanvas: HTMLCanvasElement;
        mBgCanvas: HTMLCanvasElement;
        mContext: CanvasRenderingContext2D;
        mBgContext: CanvasRenderingContext2D;
        private aNumber: string; // 檢查碼               

        constructor(initObj: any) {
            //super(initObj);
            this.ComponentId = this.getParamValue(initObj.ComponentId, "VerifyNumber");
            this.FontType = this.getParamValue(initObj.FontType, "Arial, sans-serif");
            this.FontSize = this.getParamValue(initObj.FontSize, 26);　　　　　　　                   // 字型大小　　　　　　
            this.NumberColor = this.getParamValue(initObj.NumberColor, "#008800");                  // 數字顏色
            this.BgColor = this.getParamValue(initObj.BgColor, "#FFFFFF");                          // 背景顏色
            this.MaxNumber = this.getParamValue(initObj.MaxNumber, 9999);         　                // 最大號碼(亂數產生)
            this.VerifyNumber = this.getParamValue(initObj.VerifyNumber, 0);                        // 頁面設定驗證碼
            // 基本設定 ====================================================================
            // 取得Component寬度+高度
            let aComponent = $("#" + this.ComponentId);
            this.cWidth = <number>aComponent.width();
            this.cHeight = <number>aComponent.height();
            // 產生mCanvas與mBgCanvas
            this.mCanvas = document.createElement('canvas') as HTMLCanvasElement;
            this.mCanvas.width = this.cWidth;
            this.mCanvas.height = this.cHeight;
            this.mContext = this.mCanvas.getContext('2d') as CanvasRenderingContext2D;
            this.mBgCanvas = document.createElement('canvas') as HTMLCanvasElement;
            this.mBgCanvas.width = this.cWidth;
            this.mBgCanvas.height = this.cHeight;
            this.mBgContext = this.mBgCanvas.getContext('2d') as CanvasRenderingContext2D;
            // 頁面加入<Canvas>標籤
            aComponent.html(this.mCanvas);
            // 基本設定 End =================================================================

            // 繪製畫面
            this.aNumber = this.drawNumber();
            this.drawBgToContext();

        }

        private getParamValue(aValue: any, def: any): any {
            if (aValue === undefined || aValue === null) {
                return def;
            }
            return aValue;
        };

        private drawNumber(): string {
            // 畫驗證碼
            // 背景色
            let xNumber: string = "";
            this.mBgContext.fillStyle = this.BgColor;
            this.mBgContext.fillRect(0, 0, this.cWidth, this.cHeight);
            // 產生驗證碼
            if (this.VerifyNumber) {
                // 指定號碼
                xNumber = this.genNumber(this.VerifyNumber, this.VerifyNumber);
            }
            else {
                // 隨機產生
                xNumber = this.genNumber(1, this.MaxNumber);
            }
            this.mBgContext.fillStyle = this.NumberColor;
            this.mBgContext.font = 'bold ' + this.FontSize + "pt " + this.FontType;
            // 畫在中間
            this.mBgContext.textAlign = 'center';
            this.mBgContext.textBaseline = 'middle';
            this.mBgContext.fillText(xNumber, this.cWidth / 2, this.cHeight / 2);
            return xNumber;
        };

        private drawBgToContext(): void {
            // 將背景層貼到前幕
            this.mContext.clearRect(0, 0, this.cWidth, this.cHeight);
            this.mContext.drawImage(this.mBgCanvas, 0, 0);
        };

        private genNumber(min: number, max: number): string {
            let tmp = Math.round(Math.random() * (max - min) + min);
            // 前面補零
            let ZERO = "";
            let xLength = max.toString().length - tmp.toString().length;
            if (xLength >= 0) {
                ZERO = this.ZeroArray[xLength];
            }
            return ZERO + tmp;
        };

        /*
            重新繪製元件 [delay] setTimeout的ms. ex:delay=0 , 執行完畢呼叫callback function
        */
        public repaint(delay?: number, callback?: Function | null): void {
            delay = delay || 0;
            console.log("repaint " + delay + " callback=" + callback);
            let _this = this;
            try {
                setTimeout(() => {
                    _this.aNumber = _this.drawNumber();
                    _this.drawBgToContext();
                    if (callback instanceof Function) {
                        callback("repaint(" + delay + ") finish...");
                    }
                }, delay);
            }
            catch (err) {
                if (callback instanceof Function) {
                    callback("repaint(" + delay + ") " + err.message);
                }
            }
        };

        /*
            重新設定驗證碼 [number] 
        */
        public resetNumber(aNumber: number): void {
            this.VerifyNumber = 0;
            if (aNumber) {
                this.MaxNumber = aNumber;
                this.VerifyNumber = aNumber;
            }
            this.repaint();
        };

        /*
            檢查使用者輸入的檢查碼 [number] 使用者輸入 , 執行完畢呼叫callback function
        */
        public checkNumber(number: string, callback?: Function | null): void {
            var aStatus = 0;
            var aMessage = "驗證成功";
            if (this.aNumber != number) {
                aStatus = -1;
                aMessage = "驗證失敗";
            }
            var result = {
                "VerifyNumber": this.aNumber, "UserInput": number,
                "Status": aStatus, "Message": aMessage
            };
            setTimeout(() => {
                if (callback instanceof Function) {
                    try {
                        callback(result);
                    }
                    catch (error) { console.error(error.message) }
                }
                else {
                    console.log(result);
                    console.error("第二個參數必須是callback function !");
                }
            }, 0);
        }
    }
}    

