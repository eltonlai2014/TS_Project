"use strict";
var Syspower = Syspower || {}; // 名稱空間
/*
    初始化
    var initObj = {
        "ComponentId": "VerifyNumber", "FontType": "Arial, sans-serif", "FontSize": 32,
        "NumberColor": "#0000FF", "BgColor": "#dddddd", "MaxNumber": aMaxNumber,
        "VerifyNumber":56789
    };
*/
Syspower.VerifyNumber = (function (initObj) {
    "use strict";
    // 初始化
    initObj = initObj || {};
    var ComponentId = getParamValue(initObj.ComponentId, "VerifyNumber");
    var FontType = getParamValue(initObj.FontType, "Arial, sans-serif");
    var FontSize = getParamValue(initObj.FontSize, 26); // 字型大小　　　　　　
    var NumberColor = getParamValue(initObj.NumberColor, "#008800"); // 數字顏色
    var BgColor = getParamValue(initObj.BgColor, "#FFFFFF"); // 背景顏色色
    var MaxNumber = getParamValue(initObj.MaxNumber, 9999); // 最大號碼(亂數產生)
    var VerifyNumber = getParamValue(initObj.VerifyNumber, 0); // 頁面設定驗證碼
    var ZeroArray = ["", "0", "00", "000"];
    var mCanvas, mBgCanvas, cWidth, cHeight;
    var mContext, mBgContext;
    var aNumber; // 檢查碼
    // 基本設定 ====================================================================
    // 取得Component寬度+高度
    var aComponent = $("#" + ComponentId);
    cWidth = aComponent.width();
    cHeight = aComponent.height();
    // 產生mCanvas與mBgCanvas
    mCanvas = document.createElement('canvas');
    mCanvas.width = cWidth;
    mCanvas.height = cHeight;
    mContext = mCanvas.getContext('2d');
    mBgCanvas = document.createElement('canvas');
    mBgCanvas.width = cWidth;
    mBgCanvas.height = cHeight;
    mBgContext = mBgCanvas.getContext('2d');
    // 頁面加入<Canvas>標籤
    aComponent.html(mCanvas);
    // 基本設定 End =================================================================
    // 繪製畫面
    drawNumber();
    drawBgToContext();
    function getParamValue(aValue, def) {
        if (aValue === undefined || aValue === null) {
            return def;
        }
        return aValue;
    }
    ;
    function drawNumber() {
        // 畫驗證碼
        // 背景色
        mBgContext.fillStyle = BgColor;
        mBgContext.fillRect(0, 0, cWidth, cHeight);
        // 產生驗證碼
        if (VerifyNumber) {
            // 指定號碼
            aNumber = genNumber(VerifyNumber, VerifyNumber);
        }
        else {
            // 隨機產生
            aNumber = genNumber(1, MaxNumber);
        }
        mBgContext.fillStyle = NumberColor;
        mBgContext.font = 'bold ' + FontSize + "pt " + FontType;
        // 畫在中間
        mBgContext.textAlign = 'center';
        mBgContext.textBaseline = 'middle';
        mBgContext.fillText(aNumber, cWidth / 2, cHeight / 2);
    }
    function drawBgToContext() {
        // 將背景層貼到前幕
        mContext.clearRect(0, 0, cWidth, cHeight);
        mContext.drawImage(mBgCanvas, 0, 0);
    }
    function genNumber(min, max) {
        var foo = Math.round(Math.random() * (max - min) + min);
        // 前面補零
        var ZERO = ZeroArray[max.toString().length - foo.toString().length];
        return ZERO + foo;
    }
    var public_method = {
        /*
            重新繪製元件 [delay] setTimeout的ms. ex:delay=0 , 執行完畢呼叫callback function
        */
        repaint: function (delay, callback) {
            delay = delay || 0;
            try {
                setTimeout(function () {
                    drawNumber();
                    drawBgToContext();
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
        },
        /*
            重新設定驗證碼 [number]
        */
        resetNumber: function (number) {
            if (number) {
                MaxNumber = number.toString();
                VerifyNumber = number.toString();
            }
            else {
                VerifyNumber = 0;
            }
            this.repaint();
        },
        /*
            檢查使用者輸入的檢查碼 [number] 使用者輸入 , 執行完畢呼叫callback function
        */
        checkNumber: function (number, callback) {
            var aStatus = 0;
            var aMessage = "驗證成功";
            if (aNumber != number) {
                aStatus = -1;
                aMessage = "驗證失敗";
            }
            var result = {
                "VerifyNumber": aNumber, "UserInput": number,
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
        }
    };
    return public_method;
    // return public_method 必須放在物件結尾
});
