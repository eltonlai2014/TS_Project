
export class BaseChart {
    initObj: any;
    mCanvas: HTMLCanvasElement;
    mBgCanvas: HTMLCanvasElement;
    cWidth: number;
    cHeight: number;
    mContext: CanvasRenderingContext2D;
    mBgContext: CanvasRenderingContext2D;
    BgColor: string;
    ChartBgColor: string;
    FontType: string;
    FontSize: number;
    UseClientHeight: boolean;
    static Text_Chche: any = {};                                                                // 字串池
    constructor(initObj: any) {
        this.initObj = initObj;
        let ComponentId = this.getParamValue(initObj.ComponentId, "VerifyNumber");
        this.FontType = this.getParamValue(initObj.FontType, "Arial, sans-serif");
        this.FontSize = this.getParamValue(initObj.FontSize, 26);　　　　　　　                   // 字型大小　　　　　　
        this.BgColor = this.getParamValue(initObj.BgColor, "#FFFFFF");                          // 背景顏色
        this.ChartBgColor = this.getParamValue(initObj.ChartBgColor, "#FFFFFF");                // 圖型背景顏色
        this.UseClientHeight = this.getParamValue(initObj.UseClientHeight, false); 
        
        // 基本設定 ====================================================================
        // 取得Component寬度+高度
        let aComponent: HTMLElement = document.querySelector("#" + ComponentId);
        
        let aClientRect = aComponent.getBoundingClientRect();
        console.log(aClientRect);
        this.cHeight = aClientRect.height;
        this.cWidth = aClientRect.width;
        if (this.UseClientHeight) {
            let xComponent: HTMLElement = document.getElementById(ComponentId);
            this.cHeight = xComponent.clientHeight;
            this.cWidth = xComponent.clientWidth;
            console.log("UseClientHeight=" + this.UseClientHeight + " " + this.cHeight + " " + this.cWidth);
        }

        //aClientRect.clientHeight;
        // 產生mCanvas與mBgCanvas
        this.mCanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.mCanvas.width = this.cWidth;
        this.mCanvas.height = this.cHeight;
        this.mContext = this.mCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.mBgCanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.mBgCanvas.width = this.cWidth;
        this.mBgCanvas.height = this.cHeight;
        this.mBgContext = this.mBgCanvas.getContext('2d') as CanvasRenderingContext2D;

        // 避免antialias(應該沒效)
        this.mContext.imageSmoothingEnabled = false;
        this.mBgContext.imageSmoothingEnabled = false;
        // 基本設定 End =================================================================        
    }

    /*
        重新繪製元件 [delay] setTimeout的ms. ex:delay=0 , 執行完畢呼叫callback function
    */
    public repaint(delay?: number, callback?: Function | null): void {
        delay = delay || 0;
        console.log("repaint " + delay + " callback=" + callback);
        let _this = this;
        try {
            setTimeout(() => {
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

    public getParamValue(aValue: any, def: any): any {
        if (aValue === undefined || aValue === null) {
            return def;
        }
        return aValue;
    };

    public drawMain(): void {
        console.log("Base drawMain");
    };

    public drawBgToContext(): void {
        // 將背景層貼到前幕
        this.mContext.clearRect(0, 0, this.cWidth, this.cHeight);
        this.mContext.drawImage(this.mBgCanvas, 0, 0);
    };

    //  字串池 
    //  let aText: TextObj = this.MeasureText("00000000", "normal", this.AxisFont, this.AxisFontSize);
    //  
    public MeasureText(text: string, bold: string, font: string, size: number): TextObj {
        // This global variable is used to cache repeated calls with the same arguments
        let aKey: string = text + ':' + bold + ':' + font + ':' + size;
        if (typeof (BaseChart.Text_Chche) == 'object' && BaseChart.Text_Chche[aKey]) {
            return BaseChart.Text_Chche[aKey];
        }
        let aWidth: number = 0;
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
        var aText = new TextObj();
        aText.Width = aWidth;
        aText.Height = Math.round(div.offsetHeight);
        document.body.removeChild(div);
        // Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
        BaseChart.Text_Chche[aKey] = aText;
        return aText;
    };

    // 圓角矩形
    public roundRect(x: number, y: number, width: number, height: number, ctx: CanvasRenderingContext2D, radius?: number, fill?: boolean, stroke?: boolean): void {
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
    public dashedLineTo(fromX: number, fromY: number, toX: number, toY: number, pattern: number, lineColor: string, ctx: CanvasRenderingContext2D): void {
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
            } else {
                ctx.moveTo(Math.round(fromX + dl * deltax), Math.round(fromY + dl * deltay));
            }

        }
        //ctx.lineWidth = 1;
        ctx.strokeStyle = lineColor;
        ctx.stroke();
        ctx.restore();
    };
    
    // 直線，避免antialias
    public clearLineTo(fromX: number, fromY: number, toX: number, toY: number, lineColor: string, lineWidth?: number, ctx?: CanvasRenderingContext2D): void {
        // default lineWidth -> 1px lineColor -> #FFFFFF
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
    public drawLineNoAliasing(sx: number, sy: number, tx: number, ty: number, lineColor?: string, ctx?: CanvasRenderingContext2D): void {
        lineColor = lineColor || '#FFFFFF';
        let dist = Syspower.Util.DBP(sx, sy, tx, ty); // length of line
        let ang = Syspower.Util.getAngle(tx - sx, ty - sy); // angle of line
        ctx.save();
        ctx.fillStyle = lineColor;
        for (let i = 0; i < dist; i++) {
            // for each point along the line
            ctx.fillRect(Math.round(sx + Math.cos(ang) * i), // round for perfect pixels
                Math.round(sy + Math.sin(ang) * i), // thus no aliasing
                1, 1); // fill in one pixel, 1x1
        }
        ctx.restore();
    };

    // 畫清晰矩形 !!注意自訂方法名稱不要取為跟物件既有的名子重覆，否則效能會很差 
    // !! NEVER TRY THIS !! : CanvasRenderingContext2D.prototype.drawRect
    public drawRectEx(x: number, y: number, width: number, height: number, color: string, lineWidth?: number, ctx?: CanvasRenderingContext2D): void {
        this.clearLineTo(x, y, x + width, y, color, lineWidth, ctx);
        this.clearLineTo(x + width, y, x + width, y + height, color, lineWidth, ctx);
        this.clearLineTo(x + width, y + height, x, y + height, color, lineWidth, ctx);
        this.clearLineTo(x, y + height, x, y, color, lineWidth, ctx);
    };

    // !! NEVER DO THIS !! : CanvasRenderingContext2D.prototype.fillRect
    public fillRectEx(x: number, y: number, width: number, height: number, color: string, ctx?: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = color;
        ctx.fill();
    };

    public drawString (ctx:CanvasRenderingContext2D, txt:string, x:number, y:number, size:number, font?:string, color?:string, align?:any, base?:any):number {
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

};

export class TextObj {
    public Width: number;
    public Height: number;
};

