var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jquery"], function (require, exports, jquery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    var JQ_AjaxAdaptor = /** @class */ (function () {
        function JQ_AjaxAdaptor(initObj) {
            this.descroption = initObj.descroption;
            this.initObj = initObj;
        }
        JQ_AjaxAdaptor.prototype.getDescription = function () {
            return "[JQ_AjaxAdaptor] " + this.descroption + " " + this.initObj;
        };
        JQ_AjaxAdaptor.prototype.QueryInfoBlob = function (param, s_handle, e_handle) {
            // 加上timestamp避免cache
            if (param.URL) {
                // 加上timestamp避免cache
                var timestamp = new Date().getTime();
                param.URL = param.URL + "?timestamp=" + timestamp;
            }
            // 預設參數設定
            if (!param.type) {
                param.type = this.initObj.type || 'GET';
            }
            if (!param.timeout) {
                param.timeout = this.initObj.timeout || 20000;
            }
            if (JQ_AjaxAdaptor.DEBUG) {
                console.log(param);
            }
            jquery_1.default.ajax(param.URL, {
                type: param.type,
                timeout: param.timeout,
                cache: false,
                data: param.data,
                xhr: function () {
                    // JQuery3.0+ support ,Seems like the only way to get access to the xhr object
                    // Elton 20181030 -> xhr.onreadystatechange callback function is must for ie11, to prevent InvalidStateError Orz
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        try {
                            xhr.responseType = 'arraybuffer';
                            //console.log('XHR state: ' + xhr.readyState);
                        }
                        catch (e) {
                            //console.log('XHR state: ' + xhr.readyState + ' ==> exception: ' + e);
                        }
                    };
                    return xhr;
                },
                success: s_handle,
                error: e_handle
            });
        };
        JQ_AjaxAdaptor.prototype.QueryInfo = function (param, s_handle, e_handle) {
            if (param.URL) {
                // 加上timestamp避免cache
                var timestamp = new Date().getTime();
                param.URL = param.URL + "?timestamp=" + timestamp;
            }
            // 預設參數設定
            if (!param.type) {
                param.type = this.initObj.type || 'GET';
            }
            if (!param.timeout) {
                param.timeout = this.initObj.timeout || 20000;
            }
            if (JQ_AjaxAdaptor.DEBUG) {
                console.log(param);
            }
            jquery_1.default.ajax(param.URL, {
                type: param.type,
                timeout: param.timeout,
                cache: false,
                data: param.data,
                success: s_handle,
                error: e_handle
            });
        };
        JQ_AjaxAdaptor.DEBUG = true;
        return JQ_AjaxAdaptor;
    }());
    exports.JQ_AjaxAdaptor = JQ_AjaxAdaptor;
    ;
});
