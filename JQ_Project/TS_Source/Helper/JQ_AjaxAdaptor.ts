import $ from "jquery";

export class JQ_AjaxAdaptor {
    // JQUERY AJAX 工具類別
    static readonly DEBUG: boolean = true;
    static readonly DEFAULT_METHOD: string = "GET";
    static readonly DEFAULT_TIMEOUT: Number = 20000;
    descroption: string;
    initObj: any;
    constructor(initObj: any) {
        this.descroption = initObj.descroption;
        this.initObj = initObj;
    }

    public getDescription(): string {
        return "[JQ_AjaxAdaptor] " + this.descroption + " " + this.initObj;
    }

    public queryInfoBlob(param: any, s_handle: any, e_handle: any): void {
        // 加上timestamp避免cache
        if (param.URL) {
            // 加上timestamp避免cache
            var timestamp = new Date().getTime();
            param.URL = param.URL + "?timestamp=" + timestamp;
        }
        // 預設參數設定
        if (!param.type) {
            param.type = this.initObj.type || JQ_AjaxAdaptor.DEFAULT_METHOD;
        }
        if (!param.timeout) {
            param.timeout = this.initObj.timeout || JQ_AjaxAdaptor.DEFAULT_TIMEOUT;
        }
        if (JQ_AjaxAdaptor.DEBUG) {
            console.log(param);
        }
        $.ajax(
            param.URL,
            {
                type: param.type,
                timeout: param.timeout,
                cache: false,
                data: param.data,
                xhr: function () {
                    // JQuery3.0+ support ,Seems like the only way to get access to the xhr object
                    // xhr.onreadystatechange callback function is MUST for IE11, to prevent InvalidStateError
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        try {
                            xhr.responseType = 'arraybuffer';
                            //console.log('XHR state: ' + xhr.readyState);
                        } catch (e) {
                            //console.log('XHR state: ' + xhr.readyState + ' ==> exception: ' + e);
                        }
                    };
                    return xhr;
                },

                success: s_handle,
                error: e_handle
            }
        );
    }

    public queryInfo(param: any, s_handle: any, e_handle: any): void {
        if (param.URL) {
            // 加上timestamp避免cache
            var timestamp = new Date().getTime();
            param.URL = param.URL + "?timestamp=" + timestamp;
        }
        // 預設參數設定
        if (!param.type) {
            param.type = this.initObj.type || JQ_AjaxAdaptor.DEFAULT_METHOD;
        }
        if (!param.timeout) {
            param.timeout = this.initObj.timeout || JQ_AjaxAdaptor.DEFAULT_TIMEOUT;
        }
        if (JQ_AjaxAdaptor.DEBUG) {
            console.log(param);
        }
        $.ajax(
            param.URL,
            {
                type: param.type,
                timeout: param.timeout,
                cache: false,
                data: param.data,
                success: s_handle,
                error: e_handle
            }
        );
    }

};

