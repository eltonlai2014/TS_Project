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
            _this.MaxRealAmt = 0;
            _this.MinRealAmt = 0;
            _this.PrettyAxis = [];
            _this.mouseMove = function (evt) {
                var mousePos = _this.getMousePos(evt);
                console.log(mousePos);
                //mouseHandle(mousePos, 'mousemove');        
            };
            var ComponentId = _this.getParamValue(initObj.ComponentId, "");
            _this.NumberColor = _this.getParamValue(initObj.NumberColor, "#008800"); // 數字顏色
            _this.BorderWidth = _this.getParamValue(initObj.BorderWidth, 14);
            _this.BorderHeight = _this.getParamValue(initObj.BorderHeight, 14);
            _this.AxisFont = _this.getParamValue(initObj.AxisFont, _this.FontType);
            _this.AxisFontSize = _this.getParamValue(initObj.AxisFontSize, 9);
            _this.AxisWidth = _this.getParamValue(initObj.AxisWidth, 59);
            _this.AxisAmount = _this.getParamValue(initObj.AxisAmount, 5);
            _this.RectAmounts = _this.getParamValue(initObj.RectAmounts, 80); // 畫面資料筆數
            // 頁面加入<Canvas>標籤
            var aComponent = document.querySelector("#" + ComponentId);
            aComponent.appendChild(_this.mCanvas);
            console.log(_this.ClientRect);
            var aText = _this.MeasureText("00000000", "normal", _this.AxisFont, _this.AxisFontSize);
            _this.AxisWidth = aText.Width;
            _this.AxisHeight = aText.Height;
            _this.ChartHeight = _this.cHeight - _this.BorderHeight * 2;
            _this.ChartWidth = _this.cWidth - _this.AxisWidth - _this.BorderWidth;
            var PaintOnCreate = _this.getParamValue(initObj.PaintOnCreate, false);
            if (PaintOnCreate) {
                _this.repaint();
            }
            _this.bindingEvent();
            return _this;
        }
        StockChart.prototype.bindingEvent = function () {
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
        };
        StockChart.prototype.setData = function (data, invList) {
            this.MinRealAmt = 999999999;
            this.MaxRealAmt = 0;
            if (invList.length > 0) {
                // 投資開始日期
                var startDate = invList[0].MktDate;
                // 投資計畫、歷史Tick，對齊資料起始日
                for (var i = 0; i < data.length; i++) {
                    if (data[i].MktDate == startDate) {
                        data = data.slice(i);
                        break;
                    }
                }
                //console.log(startDate + " " + data.length);
                var invMap = new index_1.HashMap();
                for (var i = 0, n = invList.length; i < n; i++) {
                    invMap.put(invList[i].MktDate, invList[i]);
                }
                //console.log(invMap);
                // 計算市值
                var SumShares = 0;
                for (var i = 0; i < data.length; i++) {
                    var aObj = invMap.get(data[i].MktDate);
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
        };
        StockChart.prototype.drawChart = function () {
            var xChartData = this.ChartData;
            // 畫底圖
            this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.BgColor);
            // 主要圖形底色
            this.fillRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, this.ChartBgColor);
            // 邊框
            //this.drawRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, "0000FF", 1);
            // 畫坐標軸
            for (var i = 0; i < this.AxisAmount; i++) {
                var yPOS_1 = (this.ChartHeight / (this.AxisAmount + 1)) * (this.AxisAmount - i) + this.BorderHeight;
                this.dashedLineTo(this.mBgContext, this.AxisWidth, yPOS_1, this.ChartWidth + this.AxisWidth, yPOS_1, 3, "#000000");
                this.drawString(this.mBgContext, this.PrettyAxis[i + 1] + "", this.AxisWidth - 4, Math.round(yPOS_1 + this.AxisHeight / 2), this.AxisFontSize, this.AxisFont, "#000000", "right");
            }
            var yPOS = this.ChartHeight + this.BorderHeight;
            this.drawString(this.mBgContext, this.PrettyAxis[0] + "", this.AxisWidth - 4, Math.round(yPOS), this.AxisFontSize, this.AxisFont, "#000000", "right");
            yPOS = this.BorderHeight;
            this.drawString(this.mBgContext, this.PrettyAxis[this.PrettyAxis.length - 1] + "", this.AxisWidth - 4, Math.round(yPOS + this.AxisHeight), this.AxisFontSize, this.AxisFont, "#000000", "right");
            console.log(xChartData);
            // X軸間隔
            var ChartRectWidth = this.ChartWidth / (xChartData.length + 1);
            // 畫投資金額
            var InvColor = "#0000FF";
            var RealColor = "#FF0000";
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = 1.5;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = ChartRectWidth * (i + 1) + this.AxisWidth;
                var yPos = this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.SumAmt) / (this.MaxRealAmt - this.MinRealAmt);
                this.mBgContext.lineTo(xPos, yPos);
                //this.mBgContext.lineTo(Math.round(xPos), Math.round(yPos));
            }
            this.mBgContext.strokeStyle = InvColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
            // 畫圓        
            if (xChartData.length < 50) {
                for (var i = 0; i < xChartData.length; i++) {
                    var aInfo = xChartData[i];
                    var xPos = ChartRectWidth * (i + 1) + this.AxisWidth;
                    var yPos = this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.SumAmt) / (this.MaxRealAmt - this.MinRealAmt);
                    this.drawCircle(this.mBgContext, xPos, yPos, 3, InvColor);
                }
            }
            // 畫實際金額
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = 2;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = ChartRectWidth * (i + 1) + this.AxisWidth;
                var yPos = this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.RealAmt) / (this.MaxRealAmt - this.MinRealAmt);
                this.mBgContext.lineTo(xPos, yPos);
                //this.mBgContext.lineTo(Math.round(xPos), Math.round(yPos));
                //console.log(xPos+" "+yPos);         
            }
            this.mBgContext.strokeStyle = RealColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
        };
        StockChart.prototype.calMaxMin = function () {
            // 水平座標軸與水平線
            this.PrettyAxis = this.getPrettyAxis(this.MinRealAmt, this.MaxRealAmt, this.AxisAmount + 2);
            console.log(this.PrettyAxis);
            this.MaxRealAmt = Math.max(this.MaxRealAmt, this.PrettyAxis[this.PrettyAxis.length - 1]);
            this.MinRealAmt = Math.min(this.MinRealAmt, this.PrettyAxis[0]);
            // 依據最大值計算Axis寬度，再加上00
            var aText = this.MeasureText(this.PrettyAxis[this.PrettyAxis.length - 1] + "00", "normal", this.AxisFont, this.AxisFontSize);
            this.AxisWidth = aText.Width;
            this.ChartWidth = this.cWidth - this.AxisWidth - this.BorderWidth;
        };
        StockChart.prototype.drawMain = function () {
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
