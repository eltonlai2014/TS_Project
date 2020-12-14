import { BaseChart } from "./Helper/BaseChart";
import { TextObj } from "./Helper/BaseChart";
// import * as My_Helper from "./Helper/index";

export class StockChart extends BaseChart {
    NumberColor: any;
    ChartData: any;
    BorderWidth:number;
    BorderHeight:number;
    ChartHeight:number;
    ChartWidth:number;

    AxisFont:string;
    AxisFontSize:number;
    AxisWidth:number;
    AxisHeight:number;
    AxisAmount:number = 5 ;
    RectAmounts:number;
    constructor(initObj: any) {
        super(initObj);
        let ComponentId = this.getParamValue(initObj.ComponentId, "");
        this.NumberColor = this.getParamValue(initObj.NumberColor, "#008800");                  // 數字顏色

        this.BorderWidth = this.getParamValue(initObj.BorderWidth,14);
        this.BorderHeight = this.getParamValue(initObj.BorderHeight,14);
        this.AxisFont = this.getParamValue(initObj.AxisFont,this.FontType);
        this.AxisFontSize = this.getParamValue(initObj.AxisFontSize,9);
        this.AxisWidth = this.getParamValue(initObj.AxisWidth,59);
        this.AxisAmount = 5;
        this.RectAmounts = this.getParamValue(initObj.RectAmounts,80);                                            // 畫面資料筆數

        // 頁面加入<Canvas>標籤
        var aComponent: HTMLElement = document.querySelector("#" + ComponentId);
        aComponent.appendChild(this.mCanvas);
        let aText: TextObj = this.MeasureText("00000000", "normal", this.AxisFont, this.AxisFontSize);
        this.AxisWidth = aText.Width;
        this.AxisHeight = aText.Height;
        
        this.ChartHeight = this.cHeight - this.BorderHeight * 2;
        this.ChartWidth = this.cWidth - this.AxisWidth - this.BorderWidth;        

        let PaintOnCreate:boolean = this.getParamValue(initObj.PaintOnCreate, false);
        if(PaintOnCreate){
            this.repaint();
        }
    }

    public setData(data: any): void {
        this.ChartData = data;
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);
        }
    }

    public drawChart(): void {
        // 繪圖
        // BgColor
        this.fillRectEx(0, 0, this.cWidth, this.cHeight, this.BgColor, this.mBgContext);
        // ChartBg
        this.fillRectEx(this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, this.ChartBgColor, this.mBgContext);
        // Border
        this.drawRectEx(this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, "0000FF", 1, this.mBgContext);

        // 水平座標軸與水平線
        let AxisCount = 5;
        for (let i = 0; i < AxisCount; i++) {
            // public dashedLineTo(fromX: number, fromY: number, toX: number, toY: number, pattern: number, lineColor: string, ctx: CanvasRenderingContext2D): void {
            let yPOS = (this.ChartHeight / (AxisCount + 1)) * (i + 1) + this.BorderHeight;
            this.dashedLineTo(this.AxisWidth, yPOS, this.ChartWidth + this.AxisWidth, yPOS, 3, "#000000", this.mBgContext);
            this.drawString(this.mBgContext, "1234", this.AxisWidth - 4, Math.round(yPOS + this.AxisHeight / 2), this.AxisFontSize, this.AxisFont, "#000000", "right");

            // drawString (ctx:CanvasRenderingContext2D, txt:string, x:number, y:number, size:number, font?:string, color?:string, align?:any, base?:any):number
        }


    }

    private calMaxMin(): void {

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

        this.drawChart();


    };

    public QueryInfo(param: any, s_handle: any, e_handle: any): void {
        //this.aJQ_AjaxAdaptor.QueryInfo(param, s_handle, e_handle);
    }

};


