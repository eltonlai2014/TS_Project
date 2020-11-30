import $ from "jquery";
//import $ = require("jquery");
$("#Test").html("Hello World");

// 匯入各package物件
import * as Foods from "./Food/index";
export { Foods };

import * as Foods2 from "./Food2/index";
export { Foods2 };

// 引用第三方js
declare var Zlib: any; // 這行ts不會做任何處理
var xURL = "result.txt";
downloadFile(xURL);

function downloadFile(urlToSend: string) {
    var req = new XMLHttpRequest();
    req.open("GET", urlToSend, true);
    req.responseType = "arraybuffer";
    req.onload = function (event) {
        var blob = req.response;
        parseMsg(blob);
    };

    req.send();
}

function parseMsg(rtn_data: any) {
    // compress mode =================
    // response is unsigned 8 bit integer
    var responseArray = new Uint8Array(rtn_data);
    console.log("responseArray.length=" + responseArray.length);
    // 這行ts不會做任何處理
    var deCompressBuffer = new Zlib.Gunzip(responseArray).decompress(); // 將Bytes解壓縮 
    console.log("deCompressBuffer.length=" + deCompressBuffer.length);
    //var ret = getString(deCompressBuffer);
    //rtn_data = JSON.parse(ret);
    //rtn_data=ret;
    console.log("JSON.parse ok");
    return rtn_data;
    // end of compress mode =================
}

