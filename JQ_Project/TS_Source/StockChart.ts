import { BaseChart } from "./Helper/BaseChart";
// import * as My_Helper from "./Helper/index";

export class StockChart extends BaseChart {
    NumberColor: any;
    ChartData:any;
    constructor(initObj: any) {
        super(initObj);
        let ComponentId = this.getParamValue(initObj.ComponentId, "");
        this.NumberColor = this.getParamValue(initObj.NumberColor, "#008800");                  // 數字顏色

        // 頁面加入<Canvas>標籤
        var aComponent: HTMLElement = document.querySelector("#" + ComponentId);
        aComponent.appendChild(this.mCanvas);
        
        //drawNumber();
        //drawBgToContext();
    }

    public setData(data:any):void{
        this.ChartData = data;
        for(let i=0;i<data.length;i++){
            console.log(data[i]);
        }
    }

    private calMaxMin():void{

    }

    public drawMain(): void {
        console.log("drawMain xxxxx");
        // 畫驗證碼
        // 背景色
        let xNumber: string = "1234";
        this.mBgContext.fillStyle = this.BgColor;
        this.mBgContext.fillRect(0, 0, this.cWidth, this.cHeight);

        this.mBgContext.fillStyle = this.NumberColor;
        this.mBgContext.font = 'bold ' + this.FontSize + "pt " + this.FontType;
        // 畫在中間
        this.mBgContext.textAlign = 'center';
        this.mBgContext.textBaseline = 'middle';
        this.mBgContext.fillText(xNumber, this.cWidth / 2, this.cHeight / 2);
        //return xNumber;    
    };

    public QueryInfo(param: any, s_handle: any, e_handle: any): void {
        //this.aJQ_AjaxAdaptor.QueryInfo(param, s_handle, e_handle);
    }

};


