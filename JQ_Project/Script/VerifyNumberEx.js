"use strict";
/*
    初始化
    var initObj = {
        "ComponentId": "VerifyNumber", "FontType": "Arial, sans-serif", "FontSize": 32,
        "NumberColor": "#0000FF", "BgColor": "#dddddd", "MaxNumber": aMaxNumber,
        "VerifyNumber":56789
    };
*/
var SyspowerTS;
(function (SyspowerTS) {
    var Util;
    (function (Util) {
        var VerifyNumber = /** @class */ (function () {
            function VerifyNumber(initObj) {
                this.ZeroArray = ["", "0", "00", "000"];
                this.ComponentId = this.getParamValue(initObj.ComponentId, "VerifyNumber");
                this.FontType = this.getParamValue(initObj.FontType, "Arial, sans-serif");
                this.FontSize = this.getParamValue(initObj.FontSize, 26); // 字型大小　　　　　　
                this.NumberColor = this.getParamValue(initObj.NumberColor, "#008800"); // 數字顏色
                this.BgColor = this.getParamValue(initObj.BgColor, "#FFFFFF"); // 背景顏色
                this.MaxNumber = this.getParamValue(initObj.MaxNumber, 9999); // 最大號碼(亂數產生)
                this.VerifyNumber = this.getParamValue(initObj.VerifyNumber, 0); // 頁面設定驗證碼
                // 基本設定 ====================================================================
                // 取得Component寬度+高度
                var aComponent = $("#" + this.ComponentId);
                this.cWidth = aComponent.width();
                this.cHeight = aComponent.height();
                // 產生mCanvas與mBgCanvas
                this.mCanvas = document.createElement('canvas');
                this.mCanvas.width = this.cWidth;
                this.mCanvas.height = this.cHeight;
                this.mContext = this.mCanvas.getContext('2d');
                this.mBgCanvas = document.createElement('canvas');
                this.mBgCanvas.width = this.cWidth;
                this.mBgCanvas.height = this.cHeight;
                this.mBgContext = this.mBgCanvas.getContext('2d');
                // 頁面加入<Canvas>標籤
                aComponent.html(this.mCanvas);
                // 基本設定 End =================================================================
                // 繪製畫面
                this.aNumber = this.drawNumber();
                this.drawBgToContext();
            }
            VerifyNumber.prototype.getParamValue = function (aValue, def) {
                if (aValue === undefined || aValue === null) {
                    return def;
                }
                return aValue;
            };
            ;
            VerifyNumber.prototype.drawNumber = function () {
                // 畫驗證碼
                // 背景色
                var xNumber = "";
                this.mBgContext.fillStyle = this.BgColor;
                this.mBgContext.fillRect(0, 0, this.cWidth, this.cHeight);
                // 產生驗證碼
                if (this.VerifyNumber) {
                    // 指定號碼
                    xNumber = this.genNumber(this.VerifyNumber, this.VerifyNumber);
                }
                else {
                    // 隨機產生
                    xNumber = this.genNumber(1, this.MaxNumber);
                }
                this.mBgContext.fillStyle = this.NumberColor;
                this.mBgContext.font = 'bold ' + this.FontSize + "pt " + this.FontType;
                // 畫在中間
                this.mBgContext.textAlign = 'center';
                this.mBgContext.textBaseline = 'middle';
                this.mBgContext.fillText(xNumber, this.cWidth / 2, this.cHeight / 2);
                return xNumber;
            };
            ;
            VerifyNumber.prototype.drawBgToContext = function () {
                // 將背景層貼到前幕
                this.mContext.clearRect(0, 0, this.cWidth, this.cHeight);
                this.mContext.drawImage(this.mBgCanvas, 0, 0);
            };
            ;
            VerifyNumber.prototype.genNumber = function (min, max) {
                var tmp = Math.round(Math.random() * (max - min) + min);
                // 前面補零
                var ZERO = "";
                var xLength = max.toString().length - tmp.toString().length;
                if (xLength >= 0) {
                    ZERO = this.ZeroArray[xLength];
                }
                return ZERO + tmp;
            };
            ;
            /*
                重新繪製元件 [delay] setTimeout的ms. ex:delay=0 , 執行完畢呼叫callback function
            */
            VerifyNumber.prototype.repaint = function (delay, callback) {
                delay = delay || 0;
                console.log("repaint " + delay + " callback=" + callback);
                var _this = this;
                try {
                    setTimeout(function () {
                        _this.aNumber = _this.drawNumber();
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
            /*
                重新設定驗證碼 [number]
            */
            VerifyNumber.prototype.resetNumber = function (aNumber) {
                this.VerifyNumber = 0;
                if (aNumber) {
                    this.MaxNumber = aNumber;
                    this.VerifyNumber = aNumber;
                }
                this.repaint();
            };
            ;
            /*
                檢查使用者輸入的檢查碼 [number] 使用者輸入 , 執行完畢呼叫callback function
            */
            VerifyNumber.prototype.checkNumber = function (number, callback) {
                var aStatus = 0;
                var aMessage = "驗證成功";
                if (this.aNumber != number) {
                    aStatus = -1;
                    aMessage = "驗證失敗";
                }
                var result = {
                    "VerifyNumber": this.aNumber, "UserInput": number,
                    "Status": aStatus, "Message": aMessage
                };
                setTimeout(function () {
                    if (callback instanceof Function) {
                        try {
                            callback(result);
                        }
                        catch (error) {
                            console.error(error.message);
                        }
                    }
                    else {
                        console.log(result);
                        console.error("第二個參數必須是callback function !");
                    }
                }, 0);
            };
            return VerifyNumber;
        }());
        Util.VerifyNumber = VerifyNumber;
    })(Util = SyspowerTS.Util || (SyspowerTS.Util = {}));
})(SyspowerTS || (SyspowerTS = {}));
