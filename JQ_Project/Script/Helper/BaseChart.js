define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseChart = /** @class */ (function () {
        function BaseChart(initObj) {
            this.initObj = initObj;
            var ComponentId = this.getParamValue(initObj.ComponentId, "VerifyNumber");
            this.FontType = this.getParamValue(initObj.FontType, "Arial, sans-serif");
            this.FontSize = this.getParamValue(initObj.FontSize, 26); // 字型大小　　　　　　
            this.BgColor = this.getParamValue(initObj.BgColor, "#FFFFFF"); // 背景顏色
            this.ChartBgColor = this.getParamValue(initObj.ChartBgColor, "#FFFFFF"); // 圖型背景顏色
            this.UseClientHeight = this.getParamValue(initObj.UseClientHeight, false);
            // 基本設定 ====================================================================
            // 取得Component寬度+高度
            // "strictNullChecks": true
            // assert aComponent is not null
            var aComponent = document.querySelector("#" + ComponentId);
            var aClientRect = aComponent.getBoundingClientRect();
            console.log(aClientRect);
            this.cHeight = aClientRect.height;
            this.cWidth = aClientRect.width;
            if (this.UseClientHeight) {
                var xComponent = document.getElementById(ComponentId);
                // "strictNullChecks": true
                // assert aComponent is not null,need to write -> xComponent!.clientHeight 
                this.cHeight = xComponent.clientHeight;
                this.cWidth = xComponent.clientWidth;
                console.log("UseClientHeight=" + this.UseClientHeight + " " + this.cHeight + " " + this.cWidth);
            }
            //aClientRect.clientHeight;
            // 產生mCanvas與mBgCanvas
            this.mCanvas = document.createElement('canvas');
            this.mCanvas.width = this.cWidth;
            this.mCanvas.height = this.cHeight;
            this.mContext = this.mCanvas.getContext('2d');
            this.mBgCanvas = document.createElement('canvas');
            this.mBgCanvas.width = this.cWidth;
            this.mBgCanvas.height = this.cHeight;
            this.mBgContext = this.mBgCanvas.getContext('2d');
            // 避免antialias(應該沒效)
            this.mContext.imageSmoothingEnabled = false;
            this.mBgContext.imageSmoothingEnabled = false;
            // 基本設定 End =================================================================        
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
        BaseChart.prototype.getParamValue = function (aValue, def) {
            if (aValue === undefined || aValue === null) {
                return def;
            }
            return aValue;
        };
        BaseChart.prototype.drawMain = function () {
            console.log("Base drawMain");
        };
        BaseChart.prototype.drawBgToContext = function () {
            // 將背景層貼到前幕
            this.mContext.clearRect(0, 0, this.cWidth, this.cHeight);
            this.mContext.drawImage(this.mBgCanvas, 0, 0);
        };
        //  字串池 
        //  let aText: TextObj = this.MeasureText("00000000", "normal", this.AxisFont, this.AxisFontSize);
        //  
        BaseChart.prototype.MeasureText = function (text, bold, font, size) {
            // This global variable is used to cache repeated calls with the same arguments
            var aKey = text + ':' + bold + ':' + font + ':' + size;
            if (typeof (BaseChart.Text_Chche) == 'object' && BaseChart.Text_Chche[aKey]) {
                return BaseChart.Text_Chche[aKey];
            }
            var aWidth = 0;
            if (this.mBgContext) {
                this.mBgContext.font = size + "pt " + font;
                aWidth = this.mBgContext.measureText(text).width;
            }
            // 高度取法(新增一個不可見標籤，取offsetHeight，刪除，加入快取)
            var div = document.createElement("MyDIV");
            div.innerHTML = text;
            div.style.position = 'absolute';
            div.style.top = '-100px';
            div.style.left = '-100px';
            div.style.fontFamily = font;
            div.style.fontWeight = bold;
            div.style.fontSize = size + 'pt';
            document.body.appendChild(div);
            var aText = new TextObj(aWidth, Math.round(div.offsetHeight));
            document.body.removeChild(div);
            // Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
            BaseChart.Text_Chche[aKey] = aText;
            return aText;
        };
        // 圓角矩形
        BaseChart.prototype.roundRect = function (ctx, x, y, width, height, radius, fill, stroke) {
            if (typeof stroke == "undefined") {
                stroke = true;
            }
            if (typeof fill === "undefined") {
                fill = false;
            }
            if (typeof radius === "undefined") {
                radius = 5;
            }
            //x = Math.round(x);
            //y = Math.round(y);
            ctx.save();
            ctx.translate(0.5, 0.5);
            ctx.beginPath();
            // 畫圓角
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            if (stroke) {
                ctx.stroke();
            }
            if (fill) {
                ctx.fill();
            }
            ctx.restore();
        };
        // 虛線
        BaseChart.prototype.dashedLineTo = function (ctx, fromX, fromY, toX, toY, pattern, lineColor) {
            // default interval distance -> 5px
            if (typeof pattern === "undefined") {
                pattern = 5;
            }
            lineColor = lineColor || '#FFFFFF';
            // 避免畫線時產生antialias，save()->translate()->restore()
            ctx.save();
            ctx.translate(0.5, 0.5);
            // calculate the delta x and delta y
            var dx = (toX - fromX);
            var dy = (toY - fromY);
            var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));
            var dashlineInteveral = (pattern <= 0) ? distance : (distance / pattern);
            var deltay = (dy / distance) * pattern;
            var deltax = (dx / distance) * pattern;
            // draw dash line
            ctx.beginPath();
            for (var dl = 0; dl < dashlineInteveral; dl++) {
                if (dl % 2) {
                    ctx.lineTo(Math.round(fromX + dl * deltax), Math.round(fromY + dl * deltay));
                }
                else {
                    ctx.moveTo(Math.round(fromX + dl * deltax), Math.round(fromY + dl * deltay));
                }
            }
            //ctx.lineWidth = 1;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.restore();
        };
        // 直線，避免antialias
        BaseChart.prototype.clearLineTo = function (ctx, fromX, fromY, toX, toY, lineColor, lineWidth) {
            // default lineWidth -> 1px lineColor -> #FFFFFF
            lineWidth = lineWidth || 1;
            lineColor = lineColor || '#FFFFFF';
            // 避免畫線時產生antialias，save()->translate()->restore()
            ctx.save();
            ctx.translate(0.5, 0.5);
            // draw line
            fromX = Math.round(fromX);
            fromY = Math.round(fromY);
            toX = Math.round(toX);
            toY = Math.round(toY);
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.restore();
        };
        // 任意線段，避免antialias，用矩形模擬
        BaseChart.prototype.drawLineNoAliasing = function (ctx, sx, sy, tx, ty, lineColor) {
            lineColor = lineColor || '#FFFFFF';
            var dist = Syspower.Util.DBP(sx, sy, tx, ty); // length of line
            var ang = Syspower.Util.getAngle(tx - sx, ty - sy); // angle of line
            ctx.save();
            ctx.fillStyle = lineColor;
            for (var i = 0; i < dist; i++) {
                // for each point along the line
                ctx.fillRect(Math.round(sx + Math.cos(ang) * i), // round for perfect pixels
                Math.round(sy + Math.sin(ang) * i), // thus no aliasing
                1, 1); // fill in one pixel, 1x1
            }
            ctx.restore();
        };
        // 畫清晰矩形 !!注意自訂方法名稱不要取為跟物件既有的名子重覆，否則效能會很差 
        // !! NEVER TRY THIS !! : CanvasRenderingContext2D.prototype.drawRect
        BaseChart.prototype.drawRectEx = function (ctx, x, y, width, height, color, lineWidth) {
            this.clearLineTo(ctx, x, y, x + width, y, color, lineWidth);
            this.clearLineTo(ctx, x + width, y, x + width, y + height, color, lineWidth);
            this.clearLineTo(ctx, x + width, y + height, x, y + height, color, lineWidth);
            this.clearLineTo(ctx, x, y + height, x, y, color, lineWidth);
        };
        // !! NEVER DO THIS !! : CanvasRenderingContext2D.prototype.fillRect
        BaseChart.prototype.fillRectEx = function (ctx, x, y, width, height, color) {
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.fillStyle = color;
            ctx.fill();
        };
        BaseChart.prototype.drawString = function (ctx, txt, x, y, size, font, color, align, base) {
            color = color || "#000000";
            base = base || "bottom";
            align = align || "left";
            font = font || "Arial";
            ctx.fillStyle = color;
            ctx.font = size + "pt " + font;
            ctx.textAlign = align;
            ctx.textBaseline = base;
            if (size <= 8) {
                //因為chrome字型指定9px就不能更小，故用ctx.scale縮放處理 (x,y,size 先放大兩倍，再scale 0.5) 
                //放大前先紀錄
                ctx.save();
                size *= 2;
                x *= 2;
                y *= 2;
                ctx.font = size + "pt " + font;
                ctx.scale(0.5, 0.5);
                ctx.fillText(txt, x, y);
                //回復
                ctx.restore();
            }
            else {
                ctx.fillText(txt, x, y);
            }
            return ctx.measureText(txt).width;
        };
        BaseChart.Text_Chche = {}; // 字串池
        return BaseChart;
    }());
    exports.BaseChart = BaseChart;
    var TextObj = /** @class */ (function () {
        function TextObj(Width, Height) {
            this.Width = Width;
            this.Height = Height;
        }
        return TextObj;
    }());
    exports.TextObj = TextObj;
});
