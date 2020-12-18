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
            _this.ChartData = {};
            _this.ChartRectWidth = 0;
            //RectAmounts: number;
            _this.MaxRealAmt = 0;
            _this.MinRealAmt = 0;
            _this.PrettyAxis = [];
            _this.InvColor = "#0000FF";
            _this.RealColor = "#FF0000";
            _this.mouseHandle = function (evt) {
                // 取得滑鼠位置之後重新畫圖
                var mousePos = _this.getMousePos(evt);
                var aEvent = new index_1.MyMouseEvent(mousePos.x, mousePos.y, evt.type);
                _this.drawBgToContext(aEvent);
            };
            _this.drawFrontContext = function (mouseEvent) {
                if (!mouseEvent || _this.ChartRectWidth == 0 || !_this.ChartData) {
                    return;
                }
                // 畫查價線
                // 計算x座標
                var xPos = Math.max(mouseEvent.XPos, _this.AxisWidth);
                xPos = Math.min(mouseEvent.XPos, _this.AxisWidth + _this.ChartWidth);
                xPos = Math.max(mouseEvent.XPos, _this.AxisWidth);
                var xIndex = -1;
                if ((_this.ChartRectWidth > 0 || xPos < _this.AxisWidth || xPos > (_this.AxisWidth + _this.ChartRectWidth))) {
                    xIndex = Math.round((xPos - _this.AxisWidth - _this.ChartRectWidth) / _this.ChartRectWidth);
                    //xIndex = Math.min(xIndex, this.ChartData.length-1);
                    //xIndex = Math.max(xIndex, 0);
                }
                //console.log("xIndex=" + xIndex);
                if (xIndex >= 0 && xIndex < _this.ChartData.length) {
                    var LineX = Math.round(_this.AxisWidth + (xIndex + 1) * _this.ChartRectWidth);
                    _this.clearLineTo(_this.mContext, LineX, _this.BorderHeight, LineX, _this.BorderHeight + _this.ChartHeight, "#000000");
                    // 畫提示資料
                    var hintDisplay = true;
                    var mHint = {
                        "BorderWidth": 20,
                        "Width": 150,
                        "Height": 60,
                        "BorderColor": "#000000",
                        "BgColor": "#FFFFFF",
                        "Alpha": 0.7,
                    };
                    // 畫hint區塊
                    if (hintDisplay) {
                        var hintStartX = LineX + mHint.BorderWidth;
                        if (hintStartX + mHint.Width > _this.AxisWidth + _this.ChartWidth - mHint.BorderWidth) {
                            hintStartX = LineX - mHint.BorderWidth - mHint.Width;
                        }
                        var hintStartY = _this.BorderHeight + _this.ChartHeight / 2 + mHint.BorderWidth;
                        //mContext.lineWidth = mHint.BorderLineWdith;
                        _this.mContext.strokeStyle = mHint.BorderColor;
                        var aColor = _this.hexToRgb(mHint.BgColor);
                        _this.mContext.fillStyle = 'rgba(' + aColor.r + ',' + aColor.g + ',' + aColor.b + ',' + mHint.Alpha + ')';
                        _this.drawRoundRect(_this.mContext, hintStartX, hintStartY, mHint.Width, mHint.Height, 7, true);
                        var HintX = [Math.round(hintStartX + 6), Math.round(hintStartX + 20), Math.round(hintStartX + 52)];
                        // 日期
                        var yPos = Math.round(hintStartY + mHint.Height / 6 + _this.AxisHeight / 2);
                        _this.drawString(_this.mContext, _this.ChartData[xIndex].MktDate, HintX[1], yPos, _this.AxisFontSize, _this.AxisFont, "#000000", "left");
                        // 市值
                        yPos = Math.round(hintStartY + 3 * mHint.Height / 6 + _this.AxisHeight / 2);
                        _this.drawCircle(_this.mContext, HintX[0] + 4, Math.round(hintStartY + 3 * mHint.Height / 6), 5, _this.InvColor);
                        _this.drawString(_this.mContext, "市值 ", HintX[1], yPos, _this.AxisFontSize, _this.AxisFont, "#000000", "left");
                        _this.drawString(_this.mContext, _this.addComma(_this.ChartData[xIndex].SumAmt.toFixed(2)), HintX[2], yPos, _this.AxisFontSize, _this.AxisFont, "#000000", "left");
                        // 成本
                        yPos = Math.round(hintStartY + 5 * mHint.Height / 6 + _this.AxisHeight / 2);
                        _this.drawCircle(_this.mContext, HintX[0] + 4, Math.round(hintStartY + 5 * mHint.Height / 6), 5, _this.RealColor);
                        _this.drawString(_this.mContext, "成本 ", HintX[1], yPos, _this.AxisFontSize, _this.AxisFont, "#000000", "left");
                        _this.drawString(_this.mContext, _this.addComma(_this.ChartData[xIndex].RealAmt.toFixed(2)), HintX[2], yPos, _this.AxisFontSize, _this.AxisFont, "#000000", "left");
                    }
                }
            };
            var ComponentId = _this.getParamValue(initObj.ComponentId, "");
            _this.BorderWidth = _this.getParamValue(initObj.BorderWidth, 14);
            _this.BorderHeight = _this.getParamValue(initObj.BorderHeight, 14);
            _this.AxisFont = _this.getParamValue(initObj.AxisFont, _this.FontType);
            _this.AxisFontSize = _this.getParamValue(initObj.AxisFontSize, 9);
            _this.AxisWidth = _this.getParamValue(initObj.AxisWidth, 59);
            _this.AxisAmount = _this.getParamValue(initObj.AxisAmount, 5);
            _this.AxisAmount = _this.getParamValue(initObj.AxisAmount, 5);
            _this.AxisColor = _this.getParamValue(initObj.AxisColor, "#111111"); // 坐標軸Label
            //this.RectAmounts = this.getParamValue(initObj.RectAmounts, 80);                         // 畫面資料筆數
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
        StockChart.prototype.drawChartArea = function () {
            // 畫底圖與座標軸
            this.drawAxis();
            var xChartData = this.ChartData;
            console.log(xChartData);
            // X軸間隔
            this.ChartRectWidth = this.ChartWidth / (xChartData.length + 1);
            // 畫投資金額
            this.drawChartWithCircle(xChartData, ChartType.INV_CHART, this.InvColor, 1.5);
            // 畫實際金額
            this.drawChartWithCircle(xChartData, ChartType.REAL_CHART, this.RealColor, 2);
        };
        StockChart.prototype.drawAxis = function () {
            var xAlign = "right";
            // 背景
            this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.BgColor);
            // 主要圖形底色
            this.fillRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, this.ChartBgColor);
            // 邊框
            //this.drawRectEx(this.mBgContext, this.AxisWidth, this.BorderHeight, this.ChartWidth, this.ChartHeight, "0000FF", 1);
            // 畫坐標軸
            for (var i = 0; i < this.AxisAmount; i++) {
                var yPOS_1 = (this.ChartHeight / (this.AxisAmount + 1)) * (this.AxisAmount - i) + this.BorderHeight;
                this.dashedLineTo(this.mBgContext, this.AxisWidth, yPOS_1, this.ChartWidth + this.AxisWidth, yPOS_1, 3, this.AxisColor);
                this.drawString(this.mBgContext, this.PrettyAxis[i + 1] + "", this.AxisWidth - 4, Math.round(yPOS_1 + this.AxisHeight / 2), this.AxisFontSize, this.AxisFont, this.AxisColor, xAlign);
            }
            var yPOS = this.ChartHeight + this.BorderHeight + this.AxisHeight / 2;
            this.drawString(this.mBgContext, this.PrettyAxis[0] + "", this.AxisWidth - 4, Math.round(yPOS), this.AxisFontSize, this.AxisFont, this.AxisColor, xAlign);
            yPOS = this.BorderHeight + this.AxisHeight / 2;
            this.drawString(this.mBgContext, this.PrettyAxis[this.PrettyAxis.length - 1] + "", this.AxisWidth - 4, Math.round(yPOS), this.AxisFontSize, this.AxisFont, this.AxisColor, xAlign);
        };
        StockChart.prototype.drawChart = function (xChartData, aType, aColor, lineWidth) {
            lineWidth = lineWidth || 1.5;
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = lineWidth;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = this.ChartRectWidth * (i + 1) + this.AxisWidth;
                var yPos = this.getYPosByType(aInfo, aType);
                this.mBgContext.lineTo(xPos, yPos);
            }
            this.mBgContext.strokeStyle = aColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
        };
        StockChart.prototype.drawChartWithCircle = function (xChartData, aType, aColor, lineWidth) {
            lineWidth = lineWidth || 1.5;
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = lineWidth;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = this.ChartRectWidth * (i + 1) + this.AxisWidth;
                var yPos = this.getYPosByType(aInfo, aType);
                this.mBgContext.lineTo(xPos, yPos);
            }
            this.mBgContext.strokeStyle = aColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
            // 畫圓        
            if (xChartData.length < 50) {
                for (var i = 0; i < xChartData.length; i++) {
                    var aInfo = xChartData[i];
                    var xPos = this.ChartRectWidth * (i + 1) + this.AxisWidth;
                    var yPos = this.getYPosByType(aInfo, aType);
                    this.drawCircle(this.mBgContext, xPos, yPos, 3, aColor);
                }
            }
        };
        StockChart.prototype.getYPosByType = function (aInfo, aType) {
            // 依據不同型態計算Y軸位置
            switch (aType) {
                case ChartType.INV_CHART:
                    return this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.SumAmt) / (this.MaxRealAmt - this.MinRealAmt);
                case ChartType.REAL_CHART:
                    return this.BorderHeight + this.ChartHeight * (this.MaxRealAmt - aInfo.RealAmt) / (this.MaxRealAmt - this.MinRealAmt);
                default:
                    return 0;
            }
        };
        StockChart.prototype.calMaxMin = function () {
            // 水平座標軸與水平線
            this.PrettyAxis = this.getPrettyAxis(this.MinRealAmt, this.MaxRealAmt, this.AxisAmount + 2);
            //console.log(this.PrettyAxis);
            this.MaxRealAmt = Math.max(this.MaxRealAmt, this.PrettyAxis[this.PrettyAxis.length - 1]);
            this.MinRealAmt = Math.min(this.MinRealAmt, this.PrettyAxis[0]);
            // 依據最大值計算Axis寬度，再加上00
            var aText = this.MeasureText(this.PrettyAxis[this.PrettyAxis.length - 1] + "00", "normal", this.AxisFont, this.AxisFontSize);
            this.AxisWidth = aText.Width;
            this.ChartWidth = this.cWidth - this.AxisWidth - this.BorderWidth;
        };
        // 主要繪圖方法
        StockChart.prototype.drawMain = function () {
            this.drawChartArea();
        };
        ;
        return StockChart;
    }(index_1.BaseChart));
    exports.StockChart = StockChart;
    var ChartType;
    (function (ChartType) {
        ChartType[ChartType["INV_CHART"] = 1] = "INV_CHART";
        ChartType[ChartType["REAL_CHART"] = 2] = "REAL_CHART";
    })(ChartType || (ChartType = {}));
});
