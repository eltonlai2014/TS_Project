define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DomOutput = /** @class */ (function () {
        function DomOutput() {
        }
        DomOutput.prototype.Write = function (msg) {
            var div = $("<div></div>");
            div.text(msg.Time.toLocaleTimeString() + " " + msg.Text);
            div.appendTo("body");
        };
        return DomOutput;
    }());
    exports.DomOutput = DomOutput;
    //各模組可export相同名稱項目
    exports.Version = "DomOutput 1.0";
});
