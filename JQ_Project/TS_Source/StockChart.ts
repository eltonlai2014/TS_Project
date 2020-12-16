//import { BaseChart, TextObj } from "./Helper/BaseChart";
//import { HashMap } from "./Helper/HashMap";
import { BaseChart, TextObj, HashMap } from "./Helper/index";

export class StockChart extends BaseChart {
    NumberColor: any;
    ChartData: any;
    BorderWidth: number;
    BorderHeight: number;
    ChartHeight: number;
    ChartWidth: number;

    AxisFont: string;
    AxisFontSize: number;
    AxisWidth: number;
    AxisHeight: number;
    AxisAmount: number;
    RectAmounts: number;
    MaxRealAmt: number = 0;
    MinRealAmt: number = 0;
    PrettyAxis: number[] = [];

    constructor(initObj: any) {
        super(initObj);
        let ComponentId = this.getParamValue(initObj.ComponentId, "");
        this.NumberColor = this.getParamValue(initObj.NumberColor, "#008800");                  // 數字顏色

        this.BorderWidth = this.getParamValue(initObj.BorderWidth, 14);
        this.BorderHeight = this.getParamValue(initObj.BorderHeight, 14);
        this.AxisFont = this.getParamValue(initObj.AxisFont, this.FontType);
        this.AxisFontSize = this.getParamValue(initObj.AxisFontSize, 9);
        this.AxisWidth = this.getParamValue(initObj.AxisWidth, 59);
        this.AxisAmount = this.getParamValue(initObj.AxisAmount, 5);
        this.RectAmounts = this.getParamValue(initObj.RectAmounts, 80);                                            // 畫面資料筆數

        // 頁面加入<Canvas>標籤
        var aComponent: HTMLElement | null = document.querySelector("#" + ComponentId);
        aComponent!.appendChild(this.mCanvas);

        console.log(this.ClientRect);

        let aText: TextObj = this.MeasureText("00000000", "normal", this.AxisFont, this.AxisFontSize);
        this.AxisWidth = aText.Width;
        this.AxisHeight = aText.Height;

        this.ChartHeight = this.cHeight - this.BorderHeight * 2;
        this.ChartWidth = this.cWidth - this.AxisWidth - this.BorderWidth;

        let PaintOnCreate: boolean = this.getParamValue(initObj.PaintOnCreate, false);
        if (PaintOnCreate) {
            this.repaint();
        }

        this.bindingEvent();

    }
    public bindingEvent() {
        // 滑鼠移動事件
        this.mCanvas.addEventListener('mousemove', this.mouseMove, false);
        /*
        mCanvas.addEventListener('mouseup', mouseUp, false);
        mCanvas.addEventListener('mousedown', mouseDown, false);
        mCanvas.addEventListener('mouseout', mouseOut, false);
        // 註冊觸控事件
        if (EnableTouchEvent) {
            mCanvas.addEventListener("touchstart", touchDown, false);
            mCanvas.addEventListener("touchmove", touchMove, false);
            mCanvas.addEventListener("touchend", touchUp, false);
        }
        // 鍵盤事件(註冊在windows)
        window.addEventListener("keydown", keyPress, false);
        */
    }

    public mouseMove = (evt: any) => {
        var mousePos = this.getMousePos(evt);
        console.log(mousePos);
        //mouseHandle(mousePos, 'mousemove');
    }

    public setData(data: any, invList: any): void {
        this.MinRealAmt = 999999999;
        this.MaxRealAmt = 0;
        if (invList.length > 0) {
            // 投資開始日期
            let startDate = invList[0].MktDate;

            // 投資計畫、歷史Tick，對齊資料起始日
            for (let i = 0; i < data.length; i++) {
                if (data[i].MktDate == startDate) {
                    data = data.slice(i);
                    break;
                }
            }
            //console.log(startDate + " " + data.length);
            let invMap = new HashMap();
            for (let i = 0, n = invList.length; i < n; i++) {
                invMap.put(invList[i].MktDate, invList[i]);
            }
            //console.log(invMap);

            // 計算市值
            let SumShares = 0;
            for (let i = 0; i < data.length; i++) {
                let aObj = invMap.get(data[i].MktDate);
                if (aObj) {
                    // [扣款日] 累計購買金額與股數
                    SumShares += aObj.Shares;
                    data[i].SumShares = SumShares;
                    data[i].SumAmt = aObj.Amt;
                    if (i > 0) {
                        data[i].SumAmt += data[i - 1].SumAmt;
                    }
                }
                else {
                    // [非扣款日] 用前一日的資料
                    data[i].SumShares = data[i - 1].SumShares;
                    data[i].SumAmt = data[i - 1].SumAmt;
                }
                // 實際市值 = 累計股數 * 收盤價
                data[i].RealAmt = data[i].SumShares * data[i].CP;
                this.MaxRealAmt = Math.max(this.MaxRealAmt, data[i].RealAmt);
                this.MinRealAmt = Math.min(this.MinRealAmt, data[i].RealAmt);
            }
        }

        // 最大最小值取整數
        this.calMaxMin();
        this.ChartData = data;
     
    }

    public drawChart(): void {
        let xChartData = this.ChartData;

        // 畫底圖
        this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.BgColor);
        // 主要圖形底色
        this.fillRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, this.ChartBgColor);
        // 邊框
        //this.drawRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, "0000FF", 1);

        // 畫坐標軸
        for (let i = 0; i < this.AxisAmount; i++) {
            let yPOS = (this.ChartHeight / (this.AxisAmount + 1)) * (this.AxisAmount - i) + this.BorderHeight;
            this.dashedLineTo(this.mBgContext, this.AxisWidth, yPOS, this.ChartWidth + this.AxisWidth, yPOS, 3, "#000000");
            this.drawString(this.mBgContext, this.PrettyAxis[i + 1] + "", this.AxisWidth - 4, Math.round(yPOS + this.AxisHeight / 2), this.AxisFontSize, this.AxisFont, "#000000", "right");
        }
        let yPOS = this.ChartHeight + this.BorderHeight;
        this.drawString(this.mBgContext, this.PrettyAxis[0] + "", this.AxisWidth - 4, Math.round(yPOS), this.AxisFontSize, this.AxisFont, "#000000", "right");
        yPOS = this.BorderHeight;
        this.drawString(this.mBgContext, this.PrettyAxis[this.PrettyAxis.length - 1] + "", this.AxisWidth - 4, Math.round(yPOS + this.AxisHeight), this.AxisFontSize, this.AxisFont, "#000000", "right");
        console.log(xChartData);

        // X軸間隔
        let ChartRectWidth = this.ChartWidth / (xChartData.length + 1);

        // 畫投資金額
        let InvColor: string = "#0000FF";
        let RealColor = "#FF0000";
        this.mBgContext.save();
        this.mBgContext.translate(0.5, 0.5);
        this.mBgContext.lineWidth = 1.5;
        this.mBgContext.beginPath();
        for (let i = 0; i < xChartData.length; i++) {
            let aInfo = xChartData[i];
            let xPos: number = ChartRectWidth * (i + 1) + this.AxisWidth;
            let yPos: number = this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.SumAmt) / (this.MaxRealAmt - this.MinRealAmt);
            this.mBgContext.lineTo(xPos, yPos);
            //this.mBgContext.lineTo(Math.round(xPos), Math.round(yPos));
        }
        this.mBgContext.strokeStyle = InvColor;
        this.mBgContext.lineJoin = 'round';
        this.mBgContext.stroke();
        this.mBgContext.restore();

        // 畫圓        
        if (xChartData.length < 50) {
            for (let i = 0; i < xChartData.length; i++) {
                let aInfo = xChartData[i];
                let xPos: number = ChartRectWidth * (i + 1) + this.AxisWidth;
                let yPos: number = this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.SumAmt) / (this.MaxRealAmt - this.MinRealAmt);
                this.drawCircle(this.mBgContext, xPos, yPos, 3, InvColor);
            }
        }

        // 畫實際金額
        this.mBgContext.save();
        this.mBgContext.translate(0.5, 0.5);
        this.mBgContext.lineWidth = 2;
        this.mBgContext.beginPath();

        for (let i = 0; i < xChartData.length; i++) {
            let aInfo = xChartData[i];
            let xPos: number = ChartRectWidth * (i + 1) + this.AxisWidth;
            let yPos: number = this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.RealAmt) / (this.MaxRealAmt - this.MinRealAmt);
            this.mBgContext.lineTo(xPos, yPos);
            //this.mBgContext.lineTo(Math.round(xPos), Math.round(yPos));
            //console.log(xPos+" "+yPos);         
        }
        this.mBgContext.strokeStyle = RealColor;
        this.mBgContext.lineJoin = 'round';
        this.mBgContext.stroke();
        this.mBgContext.restore();

    }

    private calMaxMin(): void {
        // 水平座標軸與水平線
        this.PrettyAxis = this.getPrettyAxis(this.MinRealAmt, this.MaxRealAmt, this.AxisAmount + 2);
        console.log(this.PrettyAxis);

        this.MaxRealAmt = Math.max(this.MaxRealAmt, this.PrettyAxis[this.PrettyAxis.length - 1]);
        this.MinRealAmt = Math.min(this.MinRealAmt, this.PrettyAxis[0]);

        // 依據最大值計算Axis寬度，再加上00
        let aText: TextObj = this.MeasureText(this.PrettyAxis[this.PrettyAxis.length - 1] + "00", "normal", this.AxisFont, this.AxisFontSize);
        this.AxisWidth = aText.Width;
        this.ChartWidth = this.cWidth - this.AxisWidth - this.BorderWidth;
    }

    public drawMain(): void {
        this.drawChart();
    };

    public QueryInfo(param: any, s_handle: any, e_handle: any): void {
        //this.aJQ_AjaxAdaptor.QueryInfo(param, s_handle, e_handle);
    }

}


