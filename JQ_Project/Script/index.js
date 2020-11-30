var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "jquery", "./Food/index", "./Food2/index"], function (require, exports, jquery_1, Foods, Foods2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    jquery_1 = __importDefault(jquery_1);
    Foods = __importStar(Foods);
    Foods2 = __importStar(Foods2);
    //import $ = require("jquery");
    jquery_1.default("#Test").html("Hello World");
    exports.Foods = Foods;
    exports.Foods2 = Foods2;
    var xURL = "result.txt";
    downloadFile(xURL);
    function downloadFile(urlToSend) {
        var req = new XMLHttpRequest();
        req.open("GET", urlToSend, true);
        req.responseType = "arraybuffer";
        req.onload = function (event) {
            var blob = req.response;
            parseMsg(blob);
        };
        req.send();
    }
    function parseMsg(rtn_data) {
        // compress mode =================
        // response is unsigned 8 bit integer
        var responseArray = new Uint8Array(rtn_data);
        console.log("responseArray.length=" + responseArray.length);
        var deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮
        console.log("deCompressBuffer.length=" + deCompressBuffer.length);
        //var ret = getString(deCompressBuffer);
        //rtn_data = JSON.parse(ret);
        //rtn_data=ret;
        console.log("JSON.parse ok");
        return rtn_data;
        // end of compress mode =================
    }
});
