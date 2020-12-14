define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseChart = /** @class */ (function () {
        function BaseChart(initObj) {
            this.initObj = initObj;
            var ComponentId = this.getParamValue(initObj.ComponentId, "VerifyNumber");
            this.FontType = this.getParamValue(initObj.FontType, "Arial, sans-serif");
            this.FontSize = this.getParamValue(initObj.FontSize, 26); // 字型大小　　　　　　
            this.BgColor = this.getParamValue(initObj.BgColor, "#FFFFFF"); // 背景顏色色
            // 基本設定 ====================================================================
            // 取得Component寬度+高度
            var aComponent = document.querySelector("#" + ComponentId);
            //if (aComponent) {
            var positionInfo = aComponent.getBoundingClientRect();
            this.cHeight = aComponent.clientHeight;
            this.cWidth = aComponent.clientWidth;
            console.log(positionInfo);
            console.log(this.cWidth + " " + this.cHeight + " " + aComponent.style.width + " " + aComponent.style.height);
            // 產生mCanvas與mBgCanvas
            this.mCanvas = document.createElement('canvas');
            this.mCanvas.width = this.cWidth;
            this.mCanvas.height = this.cHeight;
            this.mContext = this.mCanvas.getContext('2d');
            this.mBgCanvas = document.createElement('canvas');
            this.mBgCanvas.width = this.cWidth;
            this.mBgCanvas.height = this.cHeight;
            this.mBgContext = this.mBgCanvas.getContext('2d');
        }
        /*
            重新繪製元件 [delay] setTimeout的ms. ex:delay=0 , 執行完畢呼叫callback function
        */
        BaseChart.prototype.repaint = function (delay, callback) {
            delay = delay || 0;
            console.log("repaint " + delay + " callback=" + callback);
            var _this = this;
            try {
                setTimeout(function () {
                    _this.drawMain();
                    _this.drawBgToContext();
                    if (callback instanceof Function) {
                        callback("repaint(" + delay + ") finish...");
                    }
                }, delay);
            }
            catch (err) {
                if (callback instanceof Function) {
                    callback("repaint(" + delay + ") " + err.message);
                }
            }
        };
        ;
        BaseChart.prototype.getParamValue = function (aValue, def) {
            if (aValue === undefined || aValue === null) {
                return def;
            }
            return aValue;
        };
        ;
        BaseChart.prototype.drawMain = function () {
            console.log("Base drawMain");
        };
        ;
        BaseChart.prototype.drawBgToContext = function () {
            // 將背景層貼到前幕
            this.mContext.clearRect(0, 0, this.cWidth, this.cHeight);
            this.mContext.drawImage(this.mBgCanvas, 0, 0);
        };
        ;
        return BaseChart;
    }());
    exports.BaseChart = BaseChart;
    ;
});
