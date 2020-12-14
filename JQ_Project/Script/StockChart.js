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
define(["require", "exports", "./Helper/BaseChart"], function (require, exports, BaseChart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // import * as My_Helper from "./Helper/index";
    var StockChart = /** @class */ (function (_super) {
        __extends(StockChart, _super);
        function StockChart(initObj) {
            var _this = _super.call(this, initObj) || this;
            var ComponentId = _this.getParamValue(initObj.ComponentId, "");
            _this.NumberColor = _this.getParamValue(initObj.NumberColor, "#008800"); // 數字顏色
            // 頁面加入<Canvas>標籤
            var aComponent = document.querySelector("#" + ComponentId);
            aComponent.appendChild(_this.mCanvas);
            return _this;
            //drawNumber();
            //drawBgToContext();
        }
        StockChart.prototype.setData = function (data) {
            this.ChartData = data;
            for (var i = 0; i < data.length; i++) {
                console.log(data[i]);
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
        };
        ;
        StockChart.prototype.QueryInfo = function (param, s_handle, e_handle) {
            //this.aJQ_AjaxAdaptor.QueryInfo(param, s_handle, e_handle);
        };
        return StockChart;
    }(BaseChart_1.BaseChart));
    exports.StockChart = StockChart;
    ;
});
