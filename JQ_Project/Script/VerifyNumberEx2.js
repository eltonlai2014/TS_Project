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
    var VerifyNumber = /** @class */ (function (_super) {
        __extends(VerifyNumber, _super);
        function VerifyNumber(initObj) {
            var _this = _super.call(this, initObj) || this;
            _this.MaxNumber = 0; // 最大號碼(亂數產生)
            _this.ZeroArray = ["", "0", "00", "000"];
            var ComponentId = _this.getParamValue(initObj.ComponentId, "");
            _this.NumberColor = _this.getParamValue(initObj.NumberColor, "#008800"); // 數字顏色
            _this.VerifyNumber = _this.getParamValue(initObj.VerifyNumber, 0); // 頁面設定驗證碼
            // 頁面加入<Canvas>標籤
            var aComponent = document.querySelector("#" + ComponentId);
            aComponent.appendChild(_this.mCanvas);
            // 繪製畫面
            _this.aNumber = _this.drawNumber();
            _this.drawBgToContext();
            return _this;
        }
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
        VerifyNumber.prototype.drawMain = function () {
            this.aNumber = this.drawNumber();
        };
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
    }(BaseChart_1.BaseChart));
    exports.VerifyNumber = VerifyNumber;
});
