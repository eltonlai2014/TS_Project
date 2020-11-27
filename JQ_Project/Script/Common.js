define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Message = /** @class */ (function () {
        function Message(text) {
            this.Time = new Date();
            this.foo = "foo";
            this.Text = text;
        }
        return Message;
    }());
    exports.Message = Message;
});
