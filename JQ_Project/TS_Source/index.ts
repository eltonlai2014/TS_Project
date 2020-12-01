import $ from "jquery";
//import $ = require("jquery");
$("#Test").html("Hello World");

// 匯入各package物件
import * as Foods from "./Food/index";
export { Foods };

import * as Foods2 from "./Food2/index";
export { Foods2 };

// 引用第三方js
declare var Zlib: any; // 這行ts不會做任何處理
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

    return rtn_data;
    // end of compress mode =================
}


QueryInfoBlob({},mCallbackHandlerBlob,mErrorHandlerEx);


function QueryInfoBlob(param: any, s_handle: any, e_handle: any) {
    // 加上timestamp避免cache
    var timestamp = new Date().getTime();
    var aURL = "result.txt?timestamp=" + timestamp;
    $.ajax(
        aURL,
        {
            type: 'GET',
            timeout: 15000,
            cache: false,
            data: param,
            xhr: function () {
                // JQuery3.0+ support ,Seems like the only way to get access to the xhr object
                // Elton 20181030 -> xhr.onreadystatechange callback function is must for ie11, to prevent InvalidStateError Orz
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    try {
                        xhr.responseType = 'arraybuffer';
                    } catch (e) {
                        console.log('XHR state: ' + xhr.readyState + ' ==> exception: ' + e);
                    }
                };
                return xhr;
            },

            success: s_handle,
            error: e_handle
        });
}

function mCallbackHandlerBlob(data:any) {
    console.log(data);
}

function mErrorHandlerEx(jqXHR:any, exception:any) {
    console.log("mErrorHandler:<br/>" + JSON.stringify(jqXHR) + "<br/>" + exception);
  }


/*
declare var axios: any; // 這行ts不會做任何處理

axios.get('Test.html')
.then(function(res:any) {
    console.log(res);
}).catch(function(err:any) {
    console.log(err);
})

*/