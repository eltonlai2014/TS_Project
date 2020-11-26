define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Message = void 0;
    var Message = /** @class */ (function () {
        function Message(text) {
            this.Time = new Date();
            this.Text = text;
        }
        return Message;
    }());
    exports.Message = Message;
});
