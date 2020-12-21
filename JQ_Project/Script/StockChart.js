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
            _this.mChartData = {};
            _this.mChartRectWidth = 0;
            _this.mMaxRealAmt = 0;
            _this.mMinRealAmt = 0;
            _this.mPrettyAxis = [];
            _this.mouseHandle = function (evt) {
                // 取得滑鼠位置之後重新畫圖
                var mousePos = _this.getMousePos(evt);
                var aEvent = new index_1.MyMouseEvent(mousePos.x, mousePos.y, evt.type);
                _this.drawBgToContext(aEvent);
            };
            // 貼底圖後繪製前景
            _this.drawFrontContext = function (mouseEvent) {
                if (!mouseEvent || _this.mChartRectWidth == 0 || !_this.mChartData) {
                    return;
                }
                // 畫查價線
                // 計算x座標
                var xPos = Math.max(mouseEvent.XPos, _this.mAxisWidth);
                xPos = Math.min(mouseEvent.XPos, _this.mAxisWidth + _this.mChartWidth);
                xPos = Math.max(mouseEvent.XPos, _this.mAxisWidth);
                var xIndex = -1;
                if ((_this.mChartRectWidth > 0 || xPos < _this.mAxisWidth || xPos > (_this.mAxisWidth + _this.mChartRectWidth))) {
                    xIndex = Math.round((xPos - _this.mAxisWidth - _this.mChartRectWidth) / _this.mChartRectWidth);
                    //xIndex = Math.min(xIndex, this.ChartData.length-1);
                    //xIndex = Math.max(xIndex, 0);
                }
                //console.log("xIndex=" + xIndex);
                if (xIndex >= 0 && xIndex < _this.mChartData.length) {
                    var LineX = Math.round(_this.mAxisWidth + (xIndex + 1) * _this.mChartRectWidth);
                    if (_this.mShowQuoteLine) {
                        _this.clearLineTo(_this.mContext, LineX, _this.mTopHeight, LineX, _this.mTopHeight + _this.mChartHeight, _this.mQuoteLineColor);
                    }
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
                        if (hintStartX + mHint.Width > _this.mAxisWidth + _this.mChartWidth - mHint.BorderWidth) {
                            hintStartX = LineX - mHint.BorderWidth - mHint.Width;
                        }
                        var hintStartY = _this.mTopHeight + _this.mChartHeight / 2 + mHint.BorderWidth;
                        //mContext.lineWidth = mHint.BorderLineWdith;
                        _this.mContext.strokeStyle = mHint.BorderColor;
                        var aColor = _this.hexToRgb(mHint.BgColor);
                        _this.mContext.fillStyle = 'rgba(' + aColor.r + ',' + aColor.g + ',' + aColor.b + ',' + mHint.Alpha + ')';
                        _this.drawRoundRect(_this.mContext, hintStartX, hintStartY, mHint.Width, mHint.Height, 7, true);
                        var HintX = [Math.round(hintStartX + 6), Math.round(hintStartX + 20), Math.round(hintStartX + 52)];
                        // 日期
                        var yPos = Math.round(hintStartY + mHint.Height / 6 + _this.mAxisHeight / 2);
                        _this.drawString(_this.mContext, _this.mChartData[xIndex].MktDate, HintX[1], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        // 成本
                        yPos = Math.round(hintStartY + 5 * mHint.Height / 6 + _this.mAxisHeight / 2);
                        _this.drawCircle(_this.mContext, HintX[0] + 4, Math.round(hintStartY + 5 * mHint.Height / 6), 5, _this.mInvColor);
                        _this.drawString(_this.mContext, "成本 ", HintX[1], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        _this.drawString(_this.mContext, _this.addComma(_this.mChartData[xIndex].SumAmt.toFixed(2)), HintX[2], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        // 市值
                        yPos = Math.round(hintStartY + 3 * mHint.Height / 6 + _this.mAxisHeight / 2);
                        _this.drawCircle(_this.mContext, HintX[0] + 4, Math.round(hintStartY + 3 * mHint.Height / 6), 5, _this.mRealColor);
                        _this.drawString(_this.mContext, "市值 ", HintX[1], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                        _this.drawString(_this.mContext, _this.addComma(_this.mChartData[xIndex].RealAmt.toFixed(2)), HintX[2], yPos, _this.mAxisFontSize, _this.mAxisFont, "#000000", "left");
                    }
                }
            };
            var ComponentId = _this.getParamValue(initObj.ComponentId, "");
            _this.mBorderWidth = _this.getParamValue(initObj.BorderWidth, 14);
            _this.mTopHeight = _this.getParamValue(initObj.TopHeight, 14);
            _this.mBottomHeight = _this.getParamValue(initObj.BottomHeight, 14);
            _this.mAxisFont = _this.getParamValue(initObj.AxisFont, _this.mFontType);
            _this.mAxisFontSize = _this.getParamValue(initObj.AxisFontSize, 9);
            _this.mAxisWidth = _this.getParamValue(initObj.AxisWidth, 59);
            _this.mAxisAmount = _this.getParamValue(initObj.AxisAmount, 5);
            _this.mAxisAmount = _this.getParamValue(initObj.AxisAmount, 5);
            _this.mAxisColor = _this.getParamValue(initObj.AxisColor, "#111111"); // 坐標軸Label顏色
            _this.mTitleFont = _this.getParamValue(initObj.TitleFont, _this.mFontType);
            _this.mTitleFontSize = _this.getParamValue(initObj.TitleFontSize, 9);
            _this.mTitleLabel = _this.getParamValue(initObj.TitleLabel, "");
            _this.mShowChartBorder = _this.getParamValue(initObj.ShowChartBorder, false);
            _this.mShowQuoteLine = _this.getParamValue(initObj.ShowQuoteLine, true);
            _this.mQuoteLineColor = _this.getParamValue(initObj.QuoteLineColor, "#111111");
            _this.mInvColor = _this.getParamValue(initObj.InvColor, "#0000FF"); // 投資顏色
            _this.mRealColor = _this.getParamValue(initObj.RealColor, "#FF0000"); // 市值顏色
            //this.RectAmounts = this.getParamValue(initObj.RectAmounts, 80);                          // 畫面資料筆數
            // 頁面加入<Canvas>標籤
            var aComponent = document.querySelector("#" + ComponentId);
            aComponent.appendChild(_this.mCanvas);
            console.log(_this.mClientRect);
            var aText = _this.MeasureText("00000000", "normal", _this.mAxisFont, _this.mAxisFontSize);
            _this.mAxisWidth = aText.Width;
            _this.mAxisHeight = aText.Height;
            _this.mChartHeight = _this.cHeight - _this.mTopHeight - _this.mBottomHeight;
            _this.mChartWidth = _this.cWidth - _this.mAxisWidth - _this.mBorderWidth;
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
            this.mMinRealAmt = 999999999;
            this.mMaxRealAmt = 0;
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
                    this.mMaxRealAmt = Math.max(this.mMaxRealAmt, data[i].RealAmt);
                    this.mMinRealAmt = Math.min(this.mMinRealAmt, data[i].RealAmt);
                }
            }
            // 最大最小值取整數
            this.calMaxMin();
            this.mChartData = data;
        };
        StockChart.prototype.getInvResult = function () {
            var ret = {};
            if (this.mChartData.length > 0) {
                ret.SumShares = this.mChartData[this.mChartData.length - 1].SumShares;
                ret.SumAmt = this.mChartData[this.mChartData.length - 1].SumAmt;
                ret.RealAmt = this.mChartData[this.mChartData.length - 1].RealAmt;
            }
            return ret;
        };
        StockChart.prototype.drawChartArea = function () {
            // 畫底圖與座標軸
            this.drawAxis();
            var xChartData = this.mChartData;
            console.log(xChartData);
            // X軸間隔
            this.mChartRectWidth = this.mChartWidth / (xChartData.length + 1);
            // 畫投資金額
            this.drawChartWithCircle(xChartData, ChartType.INV_CHART, this.mInvColor, 1.5);
            // 畫實際金額
            this.drawChart(xChartData, ChartType.REAL_CHART, this.mRealColor, 2);
        };
        // 畫底圖與座標軸
        StockChart.prototype.drawAxis = function () {
            var xAlign = "right";
            // 背景
            this.fillRectEx(this.mBgContext, 0, 0, this.cWidth, this.cHeight, this.mBgColor);
            // 主要圖形底色
            this.fillRectEx(this.mBgContext, this.mAxisWidth, this.mTopHeight, this.mChartWidth, this.mChartHeight, this.mChartBgColor);
            // 邊框       
            if (this.mShowChartBorder) {
                this.drawRectEx(this.mBgContext, this.mAxisWidth, this.mTopHeight, this.mChartWidth, this.mChartHeight, "111111", 1);
            }
            // 標題
            var aText = this.MeasureText(this.mTitleLabel, "normal", this.mTitleFont, this.mTitleFontSize);
            this.drawString(this.mBgContext, this.mTitleLabel, this.cWidth / 2 + aText.Width / 2, this.mTopHeight / 2 + aText.Height / 2, this.mTitleFontSize, this.mTitleFont, this.mAxisColor, xAlign);
            // 畫坐標軸
            for (var i = 0; i < this.mAxisAmount; i++) {
                var yPOS_1 = (this.mChartHeight / (this.mAxisAmount + 1)) * (this.mAxisAmount - i) + this.mTopHeight;
                this.dashedLineTo(this.mBgContext, this.mAxisWidth, yPOS_1, this.mChartWidth + this.mAxisWidth, yPOS_1, 3, this.mAxisColor);
                this.drawString(this.mBgContext, this.mPrettyAxis[i + 1] + "", this.mAxisWidth - 4, Math.round(yPOS_1 + this.mAxisHeight / 2), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
            }
            var yPOS = this.mChartHeight + this.mTopHeight + this.mAxisHeight / 2;
            this.drawString(this.mBgContext, this.mPrettyAxis[0] + "", this.mAxisWidth - 4, Math.round(yPOS), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
            yPOS = this.mTopHeight + this.mAxisHeight / 2;
            this.drawString(this.mBgContext, this.mPrettyAxis[this.mPrettyAxis.length - 1] + "", this.mAxisWidth - 4, Math.round(yPOS), this.mAxisFontSize, this.mAxisFont, this.mAxisColor, xAlign);
        };
        // 畫線圖
        StockChart.prototype.drawChart = function (xChartData, aType, aColor, lineWidth) {
            lineWidth = lineWidth || 1.5;
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = lineWidth;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
                var yPos = this.getYPosByType(aInfo, aType);
                this.mBgContext.lineTo(xPos, yPos);
            }
            this.mBgContext.strokeStyle = aColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
        };
        // 畫線圖+符號
        StockChart.prototype.drawChartWithCircle = function (xChartData, aType, aColor, lineWidth) {
            lineWidth = lineWidth || 1.5;
            this.mBgContext.save();
            this.mBgContext.translate(0.5, 0.5);
            this.mBgContext.lineWidth = lineWidth;
            this.mBgContext.beginPath();
            for (var i = 0; i < xChartData.length; i++) {
                var aInfo = xChartData[i];
                var xPos = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
                var yPos = this.getYPosByType(aInfo, aType);
                this.mBgContext.lineTo(xPos, yPos);
            }
            this.mBgContext.strokeStyle = aColor;
            this.mBgContext.lineJoin = 'round';
            this.mBgContext.stroke();
            this.mBgContext.restore();
            // 當資料量少時畫符號        
            if (xChartData.length < 50) {
                for (var i = 0; i < xChartData.length; i++) {
                    var aInfo = xChartData[i];
                    var xPos = this.mChartRectWidth * (i + 1) + this.mAxisWidth;
                    var yPos = this.getYPosByType(aInfo, aType);
                    this.drawCircle(this.mBgContext, xPos, yPos, 3, aColor);
                }
            }
        };
        // 依據不同型態計算Y軸位置
        StockChart.prototype.getYPosByType = function (aInfo, aType) {
            switch (aType) {
                case ChartType.INV_CHART:
                    return this.mTopHeight + this.mChartHeight * (this.mMaxRealAmt - aInfo.SumAmt) / (this.mMaxRealAmt - this.mMinRealAmt);
                case ChartType.REAL_CHART:
                    return this.mTopHeight + this.mChartHeight * (this.mMaxRealAmt - aInfo.RealAmt) / (this.mMaxRealAmt - this.mMinRealAmt);
                default:
                    return 0;
            }
        };
        StockChart.prototype.calMaxMin = function () {
            // 水平座標軸與水平線
            this.mPrettyAxis = this.getPrettyAxis(this.mMinRealAmt, this.mMaxRealAmt, this.mAxisAmount + 2);
            //console.log(this.PrettyAxis);
            this.mMaxRealAmt = Math.max(this.mMaxRealAmt, this.mPrettyAxis[this.mPrettyAxis.length - 1]);
            this.mMinRealAmt = Math.min(this.mMinRealAmt, this.mPrettyAxis[0]);
            // 依據最大值計算Axis寬度，再加上00
            var aText = this.MeasureText(this.mPrettyAxis[this.mPrettyAxis.length - 1] + "00", "normal", this.mAxisFont, this.mAxisFontSize);
            this.mAxisWidth = aText.Width;
            this.mChartWidth = this.cWidth - this.mAxisWidth - this.mBorderWidth;
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
