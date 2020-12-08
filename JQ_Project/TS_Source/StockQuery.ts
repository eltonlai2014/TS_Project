import * as AJAX_Helper from "./Helper/index";
export { AJAX_Helper };
declare let Zlib: any; // 這行ts不會做任何處理

export class StockQuery {
    initObj: any;
    aJQ_AjaxAdaptor: AJAX_Helper.JQ_AjaxAdaptor;
    constructor(initObj: any) {
        this.initObj = initObj;
        this.aJQ_AjaxAdaptor = new AJAX_Helper.JQ_AjaxAdaptor(initObj);
    }

    public QueryInfo(param: any, s_handle: any, e_handle: any): void {
        this.aJQ_AjaxAdaptor.QueryInfo(param, s_handle, e_handle);
    }

    public QueryInfoBlob(param: any, s_handle: any, e_handle: any): void {
        this.aJQ_AjaxAdaptor.QueryInfoBlob(param, s_handle, e_handle);
    }

    public QueryInfoBlob_Unzip(param: any, s_handle: any, e_handle: any): void {
        this.aJQ_AjaxAdaptor.QueryInfoBlob(param,
            (data: any) => {
                // compress mode =================
                // response is unsigned 8 bit integer
                let responseArray = new Uint8Array(data);
                //console.log("data.length=" + responseArray.length);
                // 這行ts不會做任何處理
                let deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮 
                //console.log("deCompressBuffer.length=" + deCompressBuffer.length);
                let aObj = JSON.parse(this.getString(deCompressBuffer));
                if (s_handle instanceof Function) {
                    s_handle(aObj);
                }
            },
            e_handle
        );
    }

    // Uint8Array轉字串2
    private getString(uintArray: any) {
        let ret = "";
        for (let i = 0, n = uintArray.length; i < n; i++) {
            ret += String.fromCharCode(uintArray[i]);
        }
        ret = decodeURIComponent(escape(ret));
        return ret;
    }

};


