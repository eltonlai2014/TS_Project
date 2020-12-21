import { BaseChart } from "./Helper/BaseChart";

export class VerifyNumber extends BaseChart {
    NumberColor: any;
    VerifyNumber: number;                              // 頁面設定驗證碼
    MaxNumber: number = 0;        　                   // 最大號碼(亂數產生)
    ZeroArray = ["", "0", "00", "000"];
    private aNumber: string; // 檢查碼  
    constructor(initObj: any) {
        super(initObj);
        let ComponentId = this.getParamValue(initObj.ComponentId, "");
        this.NumberColor = this.getParamValue(initObj.NumberColor, "#008800");                  // 數字顏色
        this.VerifyNumber = this.getParamValue(initObj.VerifyNumber, 0);                        // 頁面設定驗證碼
        // 頁面加入<Canvas>標籤
        var aComponent: HTMLElement | null = document.querySelector("#" + ComponentId);
        aComponent!.appendChild(this.mCanvas);

        // 繪製畫面
        this.aNumber = this.drawNumber();
        this.drawBgToContext();

    }

    private drawNumber(): string {
        // 畫驗證碼
        // 背景色
        let xNumber: string = "";
        this.mBgContext.fillStyle = this.mBgColor;
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
        this.mBgContext.font = 'bold ' + this.mFontSize + "pt " + this.mFontType;
        // 畫在中間
        this.mBgContext.textAlign = 'center';
        this.mBgContext.textBaseline = 'middle';
        this.mBgContext.fillText(xNumber, this.cWidth / 2, this.cHeight / 2);
        return xNumber;
    }

    public drawMain(): void {
        this.aNumber = this.drawNumber();
    }
    private genNumber(min: number, max: number): string {
        let tmp = Math.round(Math.random() * (max - min) + min);
        // 前面補零
        let ZERO = "";
        let xLength = max.toString().length - tmp.toString().length;
        if (xLength >= 0) {
            ZERO = this.ZeroArray[xLength];
        }
        return ZERO + tmp;
    }

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
    }

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