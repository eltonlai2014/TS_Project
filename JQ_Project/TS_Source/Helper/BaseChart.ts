
export class BaseChart {

    initObj: any;
    mCanvas: HTMLCanvasElement;
    mBgCanvas: HTMLCanvasElement;
    cWidth: number;
    cHeight: number;
    mContext: CanvasRenderingContext2D;
    mBgContext: CanvasRenderingContext2D;
    BgColor: string;
    FontType: string;
    FontSize: number;

    constructor(initObj: any) {
        this.initObj = initObj;
        let ComponentId = this.getParamValue(initObj.ComponentId, "VerifyNumber");
        this.FontType = this.getParamValue(initObj.FontType, "Arial, sans-serif");
        this.FontSize = this.getParamValue(initObj.FontSize, 26);　　　　　　　                   // 字型大小　　　　　　
        this.BgColor = this.getParamValue(initObj.BgColor, "#FFFFFF");                          // 背景顏色色

        // 基本設定 ====================================================================
        // 取得Component寬度+高度
        var aComponent: HTMLElement = document.querySelector("#" + ComponentId);
        var aClientRect = aComponent.getBoundingClientRect();
        console.log(aClientRect);
        this.cHeight = aClientRect.height;
        this.cWidth = aClientRect.width;
        // 產生mCanvas與mBgCanvas
        this.mCanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.mCanvas.width = this.cWidth;
        this.mCanvas.height = this.cHeight;
        this.mContext = this.mCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.mBgCanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.mBgCanvas.width = this.cWidth;
        this.mBgCanvas.height = this.cHeight;
        this.mBgContext = this.mBgCanvas.getContext('2d') as CanvasRenderingContext2D;
        // 基本設定 End =================================================================        
    }

    /*
        重新繪製元件 [delay] setTimeout的ms. ex:delay=0 , 執行完畢呼叫callback function
    */
    public repaint(delay?: number, callback?: Function | null): void {
        delay = delay || 0;
        console.log("repaint " + delay + " callback=" + callback);
        let _this = this;
        try {
            setTimeout(() => {
                _this.drawMain();
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

    public getParamValue(aValue: any, def: any): any {
        if (aValue === undefined || aValue === null) {
            return def;
        }
        return aValue;
    };

    public drawMain(): void {
        console.log("Base drawMain");
    };

    public drawBgToContext(): void {
        // 將背景層貼到前幕
        this.mContext.clearRect(0, 0, this.cWidth, this.cHeight);
        this.mContext.drawImage(this.mBgCanvas, 0, 0);
    };

};
