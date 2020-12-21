//import { BaseChart, TextObj } from "./Helper/BaseChart";
//import { HashMap } from "./Helper/HashMap";
import { BaseChart, TextObj, HashMap, MyMouseEvent } from "./Helper/index";

export class StockChart extends BaseChart {
    mChartData: any = {};
    mBorderWidth: number;

    mTopHeight: number;
    mBottomHeight: number;
    mChartHeight: number;
    mChartWidth: number;
    mChartRectWidth: number = 0;
    mAxisFont: string;
    mAxisFontSize: number;
    mAxisWidth: number;
    mAxisHeight: number;
    mAxisColor: string;
    mAxisAmount: number;
    mTitleFont: string;
    mTitleFontSize: number;
    mTitleLabel:string;

    mShowChartBorder : boolean;
    mShowQuoteLine : boolean;
    mQuoteLineColor :string;
    mMaxRealAmt: number = 0;
    mMinRealAmt: number = 0;
    mPrettyAxis: number[] = [];
    mInvColor: string;
    mRealColor: string;

    constructor(initObj: any) {
        super(initObj);
        let ComponentId = this.getParamValue(initObj.ComponentId, "");

        this.mBorderWidth = this.getParamValue(initObj.BorderWidth, 14);
        this.mTopHeight = this.getParamValue(initObj.TopHeight, 14);
        this.mBottomHeight = this.getParamValue(initObj.BottomHeight, 14);
        this.mAxisFont = this.getParamValue(initObj.AxisFont, this.mFontType);
        this.mAxisFontSize = this.getParamValue(initObj.AxisFontSize, 9);
        this.mAxisWidth = this.getParamValue(initObj.AxisWidth, 59);
        this.mAxisAmount = this.getParamValue(initObj.AxisAmount, 5);
        this.mAxisAmount = this.getParamValue(initObj.AxisAmount, 5);
        this.mAxisColor = this.getParamValue(initObj.AxisColor, "#111111");                        // 坐標軸Label顏色

        this.mTitleFont = this.getParamValue(initObj.TitleFont, this.mFontType);
        this.mTitleFontSize = this.getParamValue(initObj.TitleFontSize, 9);
        this.mTitleLabel = this.getParamValue(initObj.TitleLabel, "");
        
        this.mShowChartBorder = this.getParamValue(initObj.ShowChartBorder, false);
        this.mShowQuoteLine = this.getParamValue(initObj.ShowQuoteLine, true);
        this.mQuoteLineColor = this.getParamValue(initObj.QuoteLineColor, "#111111");

        this.mInvColor = this.getParamValue(initObj.InvColor, "#0000FF");                          // 投資顏色
        this.mRealColor = this.getParamValue(initObj.RealColor, "#FF0000");                        // 市值顏色
        //this.RectAmounts = this.getParamValue(initObj.RectAmounts, 80);                          // 畫面資料筆數

        // 頁面加入<Canvas>標籤
        var aComponent: HTMLElement | null = document.querySelector("#" + ComponentId);
        aComponent!.appendChild(this.mCanvas);

        console.log(this.mClientRect);

        let aText: TextObj = this.MeasureText("00000000", "normal", this.mAxisFont, this.mAxisFontSize);
        this.mAxisWidth = aText.Width;
        this.mAxisHeight = aText.Height;

        this.mChartHeight = this.cHeight - this.mTopHeight - this.mBottomHeight;
        this.mChartWidth = this.cWidth - this.mAxisWidth - this.mBorderWidth;

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
        this.mMinRealAmt = 999999999;
        this.mMaxRealAmt = 0;
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
                this.mMaxRealAmt = Math.max(this.mMaxRealAmt, data[i].RealAmt);
                this.mMinRealAmt = Math.min(this.mMinRealAmt, data[i].RealAmt);
            }
        }

        // 最大最小值取整數
        this.calMaxMin();
        this.mChartData = data;

    }

    public getInvResult(): any {
        let ret: any = {};
        if (this.mChartData.length > 0) {
            ret.SumShares = this.mChartData[this.mChartData.length - 1].SumShares;
            ret.SumAmt = this.mChartData[this.mChartData.length - 1].SumAmt;
            ret.RealAmt = this.mChartData[this.mChartData.length - 1].RealAmt;
        }
        return ret;
    }

    public drawChartArea(): void {

        // 畫底圖與座標軸
        this.drawAxis();

        let xChartData = this.mChartData;
        console.log(xChartData);
        // X軸間隔
        this.mChartRectWidth = this.mChartWidth / (xChartData.length + 1);

        // 畫投資金額
        this.drawChartWithCircle(xChartData, ChartType.INV_CHART, this.mInvColor, 1.5);
        // 畫實際金額
        this.drawChart(xChartData, ChartType.REAL_CHART, this.mRealColor, 2);

    }

    // 畫底圖與座標軸
    private drawAxis() {
        let xAlign: string = "right";
        // 背景
        this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.mBgColor);
        // 主要圖形底色
        this.fillRectEx(this.mBgContext, this.mAxisWidth, this.mTopHeight, this.mChartWidth, this.mChartHeight, this.mChartBgColor);
        // 邊框       
        if(this.mShowChartBorder){
            this.drawRectEx(this.mBgContext, this.mAxisWidth, this.mTopHeight, this.mChartWidth, this.mChartHeight, "111111", 1);
        }

        // 標題
        let aText: TextObj = this.MeasureText(this.mTitleLabel, "normal", this.mTitleFont, this.mTitleFontSize);       
        this.drawString(this.mBgContext, this.mTitleLabel, this.cWidth / 2 + aText.Width / 2, this.mTopHeight / 2 + aText.Height / 2, this.mTitleFontSize, this.mTitleFont, this.mAxisColor, xAlign);

        // 畫坐標軸
        for (let i = 0; i < this.mAxisAmount; i++) {
            let yPOS = (this.mChartHeight / (this.mAxisAmount + 1)) * (this.mAxisAmount - i) + this.mTopHeight;
            this.dashedLineTo(this.mBgContext, this.mAxisWidth, yPOS, this.mChartWidth + this.mAxisWidth, yPOS, 3, this.mAxisColor);
            this.drawString(this.mBgContext, this.mPrettyAxis[i + 1] + "", this.mAxisWidth - 4, Math.round(yPOS + this.mAxisHeight / 2), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
        }
        let yPOS = this.mChartHeight + this.mTopHeight + this.mAxisHeight / 2;
        this.drawString(this.mBgContext, this.mPrettyAxis[0] + "", this.mAxisWidth - 4, Math.round(yPOS), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
        yPOS = this.mTopHeight + this.mAxisHeight / 2;
        this.drawString(this.mBgContext, this.mPrettyAxis[this.mPrettyAxis.length - 1] + "", this.mAxisWidth - 4, Math.round(yPOS), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
    }

    // 畫線圖
    private drawChart(xChartData: any, aType: number, aColor: string, lineWidth?: number) {
        lineWidth = lineWidth || 1.5;
        this.mBgContext.save();
        this.mBgContext.translate(0.5, 0.5);
        this.mBgContext.lineWidth = lineWidth;
        this.mBgContext.beginPath();
        for (let i = 0; i < xChartData.length; i++) {
            let aInfo = xChartData[i];
            let xPos: number = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
            let yPos: number = this.getYPosByType(aInfo, aType);
            this.mBgContext.lineTo(xPos, yPos);
        }
        this.mBgContext.strokeStyle = aColor;
        this.mBgContext.lineJoin = 'round';
        this.mBgContext.stroke();
        this.mBgContext.restore();
    }

    // 畫線圖+符號
    private drawChartWithCircle(xChartData: any, aType: number, aColor: string, lineWidth?: number) {
        lineWidth = lineWidth || 1.5;
        this.mBgContext.save();
        this.mBgContext.translate(0.5, 0.5);
        this.mBgContext.lineWidth = lineWidth;
        this.mBgContext.beginPath();
        for (let i = 0; i < xChartData.length; i++) {
            let aInfo = xChartData[i];
            let xPos: number = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
            let yPos: number = this.getYPosByType(aInfo, aType);
            this.mBgContext.lineTo(xPos, yPos);
        }
        this.mBgContext.strokeStyle = aColor;
        this.mBgContext.lineJoin = 'round';
        this.mBgContext.stroke();
        this.mBgContext.restore();

        // 當資料量少時畫符號        
        if (xChartData.length < 50) {
            for (let i = 0; i < xChartData.length; i++) {
                let aInfo = xChartData[i];
                let xPos: number = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
                let yPos: number = this.getYPosByType(aInfo, aType);
                this.drawCircle(this.mBgContext, xPos, yPos, 3, aColor);
            }
        }
    }

    // 依據不同型態計算Y軸位置
    private getYPosByType(aInfo: any, aType: ChartType) {
        switch (aType) {
            case ChartType.INV_CHART:
                return this.mTopHeight + this.mChartHeight * (this.mMaxRealAmt - aInfo.SumAmt) / (this.mMaxRealAmt - this.mMinRealAmt);
            case ChartType.REAL_CHART:
                return this.mTopHeight + this.mChartHeight * (this.mMaxRealAmt - aInfo.RealAmt) / (this.mMaxRealAmt - this.mMinRealAmt);
            default:
                return 0;
        }
    }

    // 貼底圖後繪製前景
    public drawFrontContext = (mouseEvent?: MyMouseEvent): void => {
        if (!mouseEvent || this.mChartRectWidth == 0 || !this.mChartData) {
            return;
        }
        // 畫查價線
        // 計算x座標
        let xPos = Math.max(mouseEvent.XPos, this.mAxisWidth);
        xPos = Math.min(mouseEvent.XPos, this.mAxisWidth + this.mChartWidth);
        xPos = Math.max(mouseEvent.XPos, this.mAxisWidth);
        let xIndex = -1;
        if ((this.mChartRectWidth > 0 || xPos < this.mAxisWidth || xPos > (this.mAxisWidth + this.mChartRectWidth))) {
            xIndex = Math.round((xPos - this.mAxisWidth - this.mChartRectWidth) / this.mChartRectWidth);
            //xIndex = Math.min(xIndex, this.ChartData.length-1);
            //xIndex = Math.max(xIndex, 0);
        }
        //console.log("xIndex=" + xIndex);
        if (xIndex >= 0 && xIndex < this.mChartData.length) {
            let LineX = Math.round(this.mAxisWidth + (xIndex + 1) * this.mChartRectWidth);     
            if(this.mShowQuoteLine){
                this.clearLineTo(this.mContext, LineX, this.mTopHeight, LineX, this.mTopHeight + this.mChartHeight, this.mQuoteLineColor);
            }

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
                if (hintStartX + mHint.Width > this.mAxisWidth + this.mChartWidth - mHint.BorderWidth) {
                    hintStartX = LineX - mHint.BorderWidth - mHint.Width;
                }
                let hintStartY = this.mTopHeight + this.mChartHeight / 2 + mHint.BorderWidth;
                //mContext.lineWidth = mHint.BorderLineWdith;
                this.mContext.strokeStyle = mHint.BorderColor;
                let aColor = this.hexToRgb(mHint.BgColor);
                this.mContext.fillStyle = 'rgba(' + aColor.r + ',' + aColor.g + ',' + aColor.b + ',' + mHint.Alpha + ')';
                this.drawRoundRect(this.mContext, hintStartX, hintStartY, mHint.Width, mHint.Height, 7, true);

                let HintX = [Math.round(hintStartX + 6), Math.round(hintStartX + 20), Math.round(hintStartX + 52)];
                // 日期
                let yPos = Math.round(hintStartY + mHint.Height / 6 + this.mAxisHeight / 2);
                this.drawString(this.mContext, this.mChartData[xIndex].MktDate, HintX[1], yPos, this.mAxisFontSize, this.mAxisFont, "#000000", "left");

                // 成本
                yPos = Math.round(hintStartY + 5 * mHint.Height / 6 + this.mAxisHeight / 2);
                this.drawCircle(this.mContext, HintX[0] + 4, Math.round(hintStartY + 5 * mHint.Height / 6), 5, this.mInvColor);
                this.drawString(this.mContext, "成本 ", HintX[1], yPos, this.mAxisFontSize, this.mAxisFont, "#000000", "left");
                this.drawString(this.mContext, this.addComma(this.mChartData[xIndex].SumAmt.toFixed(2)), HintX[2], yPos, this.mAxisFontSize, this.mAxisFont, "#000000", "left");

                // 市值
                yPos = Math.round(hintStartY + 3 * mHint.Height / 6 + this.mAxisHeight / 2);
                this.drawCircle(this.mContext, HintX[0] + 4, Math.round(hintStartY + 3 * mHint.Height / 6), 5, this.mRealColor);
                this.drawString(this.mContext, "市值 ", HintX[1], yPos, this.mAxisFontSize, this.mAxisFont, "#000000", "left");
                this.drawString(this.mContext, this.addComma(this.mChartData[xIndex].RealAmt.toFixed(2)), HintX[2], yPos, this.mAxisFontSize, this.mAxisFont, "#000000", "left");
            }

        }

    }

    private calMaxMin(): void {
        // 水平座標軸與水平線
        this.mPrettyAxis = this.getPrettyAxis(this.mMinRealAmt, this.mMaxRealAmt, this.mAxisAmount + 2);
        //console.log(this.PrettyAxis);

        this.mMaxRealAmt = Math.max(this.mMaxRealAmt, this.mPrettyAxis[this.mPrettyAxis.length - 1]);
        this.mMinRealAmt = Math.min(this.mMinRealAmt, this.mPrettyAxis[0]);

        // 依據最大值計算Axis寬度，再加上00
        let aText: TextObj = this.MeasureText(this.mPrettyAxis[this.mPrettyAxis.length - 1] + "00", "normal", this.mAxisFont, this.mAxisFontSize);
        this.mAxisWidth = aText.Width;
        this.mChartWidth = this.cWidth - this.mAxisWidth - this.mBorderWidth;
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

