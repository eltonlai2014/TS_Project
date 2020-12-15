var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Helper/index"], function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StockChart = /** @class */ (function (_super) {
        __extends(StockChart, _super);
        function StockChart(initObj) {
            var _this = _super.call(this, initObj) || this;
            _this.AxisAmount = 5;
            var ComponentId = _this.getParamValue(initObj.ComponentId, "");
            _this.NumberColor = _this.getParamValue(initObj.NumberColor, "#008800"); // 數字顏色
            _this.BorderWidth = _this.getParamValue(initObj.BorderWidth, 14);
            _this.BorderHeight = _this.getParamValue(initObj.BorderHeight, 14);
            _this.AxisFont = _this.getParamValue(initObj.AxisFont, _this.FontType);
            _this.AxisFontSize = _this.getParamValue(initObj.AxisFontSize, 9);
            _this.AxisWidth = _this.getParamValue(initObj.AxisWidth, 59);
            _this.AxisAmount = 5;
            _this.RectAmounts = _this.getParamValue(initObj.RectAmounts, 80); // 畫面資料筆數
            // 頁面加入<Canvas>標籤
            var aComponent = document.querySelector("#" + ComponentId);
            aComponent.appendChild(_this.mCanvas);
            var aText = _this.MeasureText("00000000", "normal", _this.AxisFont, _this.AxisFontSize);
            _this.AxisWidth = aText.Width;
            _this.AxisHeight = aText.Height;
            _this.ChartHeight = _this.cHeight - _this.BorderHeight * 2;
            _this.ChartWidth = _this.cWidth - _this.AxisWidth - _this.BorderWidth;
            var PaintOnCreate = _this.getParamValue(initObj.PaintOnCreate, false);
            if (PaintOnCreate) {
                _this.repaint();
            }
            return _this;
        }
        StockChart.prototype.setData = function (data, invList) {
            this.ChartData = data;
            if (invList.length > 0) {
                // 開始結束日期
                var startDate = invList[0].MktDate;
                var endDate = data[data.length - 1].MktDate;
                // 計算市值
                for (var i = 0; i < data.length; i++) {
                    if (data[i].MktDate == startDate) {
                        data = data.slice(i);
                        break;
                    }
                }
                console.log(startDate + " " + endDate + " " + data.length);
                var invMap = new index_1.HashMap();
                for (var i = 0, n = invList.length; i < n; i++) {
                    invMap.put(invList[i].MktDate, invList[i]);
                }
                console.log(invMap);
                var SumShares = 0;
                for (var i = 0; i < data.length; i++) {
                    var aObj = invMap.get(data[i].MktDate);
                    if (aObj) {
                        // 累計購買金額與股數
                        SumShares += aObj.Shares;
                        data[i].SumShares = SumShares;
                        data[i].SumAmt = aObj.Amt;
                        if (i > 0) {
                            data[i].SumAmt += data[i - 1].SumAmt;
                        }
                    }
                    else {
                        // 用前一日的資料
                        data[i].SumShares = data[i - 1].SumShares;
                        data[i].SumAmt = data[i - 1].SumAmt;
                    }
                    // 實際市值 = 累計股數 * 收盤價
                    data[i].RealAmt = data[i].SumShares * data[i].CP;
                    console.log(data[i]);
                }
            }
        };
        StockChart.prototype.drawChart = function () {
            // 繪圖
            // BgColor
            this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.BgColor);
            // ChartBg
            this.fillRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, this.ChartBgColor);
            // Border
            this.drawRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, "0000FF", 1);
            // 水平座標軸與水平線
            var AxisCount = 5;
            for (var i = 0; i < AxisCount; i++) {
                // public dashedLineTo(fromX: number, fromY: number, toX: number, toY: number, pattern: number, lineColor: string, ctx: CanvasRenderingContext2D): void {
                var yPOS = (this.ChartHeight / (AxisCount + 1)) * (i + 1) + this.BorderHeight;
                this.dashedLineTo(this.mBgContext, this.AxisWidth, yPOS, this.ChartWidth + this.AxisWidth, yPOS, 3, "#000000");
                this.drawString(this.mBgContext, "1234", this.AxisWidth - 4, Math.round(yPOS + this.AxisHeight / 2), this.AxisFontSize, this.AxisFont, "#000000", "right");
                // drawString (ctx:CanvasRenderingContext2D, txt:string, x:number, y:number, size:number, font?:string, color?:string, align?:any, base?:any):number
            }
        };
        StockChart.prototype.calMaxMin = function () {
        };
        StockChart.prototype.drawMain = function () {
            console.log("drawMain xxxxx");
            // 畫驗證碼
            // 背景色
            var xNumber = "1234";
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
        ;
        StockChart.prototype.QueryInfo = function (param, s_handle, e_handle) {
            //this.aJQ_AjaxAdaptor.QueryInfo(param, s_handle, e_handle);
        };
        return StockChart;
    }(index_1.BaseChart));
    exports.StockChart = StockChart;
});
