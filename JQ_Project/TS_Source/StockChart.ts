//import { BaseChart, TextObj } from "./Helper/BaseChart";
//import { HashMap } from "./Helper/HashMap";
import { BaseChart, TextObj, HashMap, MyMouseEvent } from "./Helper/index";

export class StockChart extends BaseChart {
    NumberColor: any;
    ChartData: any = {};
    BorderWidth: number;
    BorderHeight: number;
    ChartHeight: number;
    ChartWidth: number;
    ChartRectWidth: number = 0;
    AxisFont: string;
    AxisFontSize: number;
    AxisWidth: number;
    AxisHeight: number;
    AxisColor: string;
    AxisAmount: number;
    //RectAmounts: number;
    MaxRealAmt: number = 0;
    MinRealAmt: number = 0;
    PrettyAxis: number[] = [];
    InvColor: string = "#0000FF";
    RealColor: string = "#FF0000";

    constructor(initObj: any) {
        super(initObj);
        let ComponentId = this.getParamValue(initObj.ComponentId, "");

        this.BorderWidth = this.getParamValue(initObj.BorderWidth, 14);
        this.BorderHeight = this.getParamValue(initObj.BorderHeight, 14);
        this.AxisFont = this.getParamValue(initObj.AxisFont, this.FontType);
        this.AxisFontSize = this.getParamValue(initObj.AxisFontSize, 9);
        this.AxisWidth = this.getParamValue(initObj.AxisWidth, 59);
        this.AxisAmount = this.getParamValue(initObj.AxisAmount, 5);
        this.AxisAmount = this.getParamValue(initObj.AxisAmount, 5);
        this.AxisColor = this.getParamValue(initObj.AxisColor, "#111111");                        // 坐標軸Label

        //this.RectAmounts = this.getParamValue(initObj.RectAmounts, 80);                         // 畫面資料筆數

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
        // this.mCanvas.addEventListener('mousedown', this.mouseDown, false);
        // this.mCanvas.addEventListener('mouseup', this.mouseUp, false);
        // this.mCanvas.addEventListener('mouseout', this.mouseOut, false);
        /*
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

    public mouseHandle = (evt: MouseEvent) => {
        // 取得滑鼠位置之後重新畫圖
        var mousePos = this.getMousePos(evt);
        let aEvent: MyMouseEvent = new MyMouseEvent(mousePos.x, mousePos.y, evt.type);
        this.drawBgToContext(aEvent);
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

    public drawChartArea(): void {

        // 畫底圖與座標軸
        this.drawAxis();

        let xChartData = this.ChartData;
        console.log(xChartData);
        // X軸間隔
        this.ChartRectWidth = this.ChartWidth / (xChartData.length + 1);

        // 畫投資金額
        this.drawChartWithCircle(xChartData, ChartType.INV_CHART, this.InvColor, 1.5);
        // 畫實際金額
        this.drawChart(xChartData, ChartType.REAL_CHART, this.RealColor, 2);

    }

    private drawAxis() {
        let xAlign: string = "right";
        // 背景
        this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.BgColor);
        // 主要圖形底色
        this.fillRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, this.ChartBgColor);
        // 邊框
        //this.drawRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, "0000FF", 1);
        // 畫坐標軸
        for (let i = 0; i < this.AxisAmount; i++) {
            let yPOS = (this.ChartHeight / (this.AxisAmount + 1)) * (this.AxisAmount - i) + this.BorderHeight;
            this.dashedLineTo(this.mBgContext, this.AxisWidth, yPOS, this.ChartWidth + this.AxisWidth, yPOS, 3, this.AxisColor);
            this.drawString(this.mBgContext, this.PrettyAxis[i + 1] + "", this.AxisWidth - 4, Math.round(yPOS + this.AxisHeight / 2), this.AxisFontSize, this.AxisFont, this.AxisColor, xAlign);
        }
        let yPOS = this.ChartHeight + this.BorderHeight + this.AxisHeight / 2;
        this.drawString(this.mBgContext, this.PrettyAxis[0] + "", this.AxisWidth - 4, Math.round(yPOS), this.AxisFontSize, this.AxisFont, this.AxisColor, xAlign);
        yPOS = this.BorderHeight + this.AxisHeight / 2;
        this.drawString(this.mBgContext, this.PrettyAxis[this.PrettyAxis.length - 1] + "", this.AxisWidth - 4, Math.round(yPOS), this.AxisFontSize, this.AxisFont, this.AxisColor, xAlign);
    }

    private drawChart(xChartData: any, aType: number, aColor: string, lineWidth?: number) {
        lineWidth = lineWidth || 1.5;
        this.mBgContext.save();
        this.mBgContext.translate(0.5, 0.5);
        this.mBgContext.lineWidth = lineWidth;
        this.mBgContext.beginPath();
        for (let i = 0; i < xChartData.length; i++) {
            let aInfo = xChartData[i];
            let xPos: number = this.ChartRectWidth * (i + 1) + this.AxisWidth;
            let yPos: number = this.getYPosByType(aInfo, aType);
            this.mBgContext.lineTo(xPos, yPos);
        }
        this.mBgContext.strokeStyle = aColor;
        this.mBgContext.lineJoin = 'round';
        this.mBgContext.stroke();
        this.mBgContext.restore();
    }

    private drawChartWithCircle(xChartData: any, aType: number, aColor: string, lineWidth?: number) {
        lineWidth = lineWidth || 1.5;
        this.mBgContext.save();
        this.mBgContext.translate(0.5, 0.5);
        this.mBgContext.lineWidth = lineWidth;
        this.mBgContext.beginPath();
        for (let i = 0; i < xChartData.length; i++) {
            let aInfo = xChartData[i];
            let xPos: number = this.ChartRectWidth * (i + 1) + this.AxisWidth;
            let yPos: number = this.getYPosByType(aInfo, aType);
            this.mBgContext.lineTo(xPos, yPos);
        }
        this.mBgContext.strokeStyle = aColor;
        this.mBgContext.lineJoin = 'round';
        this.mBgContext.stroke();
        this.mBgContext.restore();

        // 畫圓        
        if (xChartData.length < 50) {
            for (let i = 0; i < xChartData.length; i++) {
                let aInfo = xChartData[i];
                let xPos: number = this.ChartRectWidth * (i + 1) + this.AxisWidth;
                let yPos: number = this.getYPosByType(aInfo, aType);
                this.drawCircle(this.mBgContext, xPos, yPos, 3, aColor);
            }
        }
    }

    private getYPosByType(aInfo: any, aType: ChartType) {
        // 依據不同型態計算Y軸位置
        switch (aType) {
            case ChartType.INV_CHART:
                return this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.SumAmt) / (this.MaxRealAmt - this.MinRealAmt);
            case ChartType.REAL_CHART:
                return this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.RealAmt) / (this.MaxRealAmt - this.MinRealAmt);
            default:
                return 0;
        }
    }

    public drawFrontContext = (mouseEvent?: MyMouseEvent): void => {
        if (!mouseEvent || this.ChartRectWidth == 0 || !this.ChartData) {
            return;
        }
        // 畫查價線
        // 計算x座標
        let xPos = Math.max(mouseEvent.XPos, this.AxisWidth);
        xPos = Math.min(mouseEvent.XPos, this.AxisWidth + this.ChartWidth);
        xPos = Math.max(mouseEvent.XPos, this.AxisWidth);
        let xIndex = -1;
        if ((this.ChartRectWidth > 0 || xPos < this.AxisWidth || xPos > (this.AxisWidth + this.ChartRectWidth))) {
            xIndex = Math.round((xPos - this.AxisWidth - this.ChartRectWidth) / this.ChartRectWidth);
            //xIndex = Math.min(xIndex, this.ChartData.length-1);
            //xIndex = Math.max(xIndex, 0);
        }
        //console.log("xIndex=" + xIndex);
        if (xIndex >= 0 && xIndex < this.ChartData.length) {
            let LineX = Math.round(this.AxisWidth + (xIndex + 1) * this.ChartRectWidth);
            this.clearLineTo(this.mContext, LineX, this.BorderHeight, LineX, this.BorderHeight + this.ChartHeight, "#000000");

            // 畫提示資料
            let hintDisplay: boolean = true;
            let mHint = {
                "BorderWidth": 20,
                "Width": 150,
                "Height": 60,
                "BorderColor": "#000000",
                "BgColor": "#FFFFFF",
                "Alpha": 0.7,

            }
            // 畫hint區塊
            if (hintDisplay) {
                let hintStartX = LineX + mHint.BorderWidth;
                if (hintStartX + mHint.Width > this.AxisWidth + this.ChartWidth - mHint.BorderWidth) {
                    hintStartX = LineX - mHint.BorderWidth - mHint.Width;
                }
                let hintStartY = this.BorderHeight + this.ChartHeight / 2 + mHint.BorderWidth;
                //mContext.lineWidth = mHint.BorderLineWdith;
                this.mContext.strokeStyle = mHint.BorderColor;
                let aColor = this.hexToRgb(mHint.BgColor);
                this.mContext.fillStyle = 'rgba(' + aColor.r + ',' + aColor.g + ',' + aColor.b + ',' + mHint.Alpha + ')';
                this.drawRoundRect(this.mContext, hintStartX, hintStartY, mHint.Width, mHint.Height, 7, true);

                let HintX = [Math.round(hintStartX + 6), Math.round(hintStartX + 20), Math.round(hintStartX + 52)];
                // 日期
                let yPos = Math.round(hintStartY + mHint.Height / 6 + this.AxisHeight / 2);
                this.drawString(this.mContext, this.ChartData[xIndex].MktDate, HintX[1], yPos, this.AxisFontSize, this.AxisFont, "#000000", "left");

                // 市值
                yPos = Math.round(hintStartY + 3 * mHint.Height / 6 + this.AxisHeight / 2);
                this.drawCircle(this.mContext, HintX[0] + 4, Math.round(hintStartY + 3 * mHint.Height / 6), 5, this.InvColor);
                this.drawString(this.mContext, "市值 ", HintX[1], yPos, this.AxisFontSize, this.AxisFont, "#000000", "left");
                this.drawString(this.mContext, this.addComma(this.ChartData[xIndex].SumAmt.toFixed(2)), HintX[2], yPos, this.AxisFontSize, this.AxisFont, "#000000", "left");

                // 成本
                yPos = Math.round(hintStartY + 5 * mHint.Height / 6 + this.AxisHeight / 2);
                this.drawCircle(this.mContext, HintX[0] + 4, Math.round(hintStartY + 5 * mHint.Height / 6), 5, this.RealColor);
                this.drawString(this.mContext, "成本 ", HintX[1], yPos, this.AxisFontSize, this.AxisFont, "#000000", "left");
                this.drawString(this.mContext, this.addComma(this.ChartData[xIndex].RealAmt.toFixed(2)), HintX[2], yPos, this.AxisFontSize, this.AxisFont, "#000000", "left");
            }

        }


    }

    private calMaxMin(): void {
        // 水平座標軸與水平線
        this.PrettyAxis = this.getPrettyAxis(this.MinRealAmt, this.MaxRealAmt, this.AxisAmount + 2);
        //console.log(this.PrettyAxis);

        this.MaxRealAmt = Math.max(this.MaxRealAmt, this.PrettyAxis[this.PrettyAxis.length - 1]);
        this.MinRealAmt = Math.min(this.MinRealAmt, this.PrettyAxis[0]);

        // 依據最大值計算Axis寬度，再加上00
        let aText: TextObj = this.MeasureText(this.PrettyAxis[this.PrettyAxis.length - 1] + "00", "normal", this.AxisFont, this.AxisFontSize);
        this.AxisWidth = aText.Width;
        this.ChartWidth = this.cWidth - this.AxisWidth - this.BorderWidth;
    }

    // 主要繪圖方法
    public drawMain(): void {
        this.drawChartArea();
    };
}

enum ChartType {
    INV_CHART = 1,
    REAL_CHART,
}

