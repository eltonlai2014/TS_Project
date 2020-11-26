define(["require", "exports", "./Common"], function (require, exports, Common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Message = exports.ConsoleOutput = exports.Version = void 0;
    Object.defineProperty(exports, "Message", { enumerable: true, get: function () { return Common_1.Message; } });
    var ConsoleOutput = /** @class */ (function () {
        function ConsoleOutput() {
        }
        ConsoleOutput.prototype.Write = function (msg) {
            console.log(msg.Time.toLocaleTimeString() + " " + msg.Text);
        };
        return ConsoleOutput;
    }());
    exports.ConsoleOutput = ConsoleOutput;
    //各模組可export相同名稱項目
    exports.Version = "ConsoleOutput 1.0";
});
