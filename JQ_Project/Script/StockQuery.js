var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "./Helper/index"], function (require, exports, AJAX_Helper) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    AJAX_Helper = __importStar(AJAX_Helper);
    exports.AJAX_Helper = AJAX_Helper;
    var StockQuery = /** @class */ (function () {
        function StockQuery(initObj) {
            this.initObj = initObj;
            this.aJQ_AjaxAdaptor = new AJAX_Helper.JQ_AjaxAdaptor(initObj);
        }
        StockQuery.prototype.QueryInfo = function (param, s_handle, e_handle) {
            return this.aJQ_AjaxAdaptor.QueryInfo(param, s_handle, e_handle);
        };
        StockQuery.prototype.QueryInfoBlob = function (param, s_handle, e_handle) {
            return this.aJQ_AjaxAdaptor.QueryInfoBlob(param, s_handle, e_handle);
        };
        StockQuery.prototype.QueryInfoBlob_Unzip = function (param, s_handle, e_handle) {
            var _this = this;
            return this.aJQ_AjaxAdaptor.QueryInfoBlob(param, function (data) {
                // compress mode =================
                // response is unsigned 8 bit integer
                var responseArray = new Uint8Array(data);
                //console.log("data.length=" + responseArray.length);
                // 這行ts不會做任何處理
                var deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮 
                //console.log("deCompressBuffer.length=" + deCompressBuffer.length);
                var aObj = JSON.parse(_this.getString(deCompressBuffer));
                if (s_handle instanceof Function) {
                    s_handle(aObj);
                }
            }, e_handle);
        };
        // Uint8Array轉字串2
        StockQuery.prototype.getString = function (uintArray) {
            var ret = "";
            for (var i = 0, n = uintArray.length; i < n; i++) {
                ret += String.fromCharCode(uintArray[i]);
            }
            ret = decodeURIComponent(escape(ret));
            return ret;
        };
        return StockQuery;
    }());
    exports.StockQuery = StockQuery;
    ;
});
