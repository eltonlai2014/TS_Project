define(["require", "exports", "./Dom", "./Console"], function (require, exports, Dom_1, Console_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var c = new Console_1.ConsoleOutput();
    c.Write(new Console_1.Message("console test"));
    var d = new Dom_1.DomOutput();
    d.Write(new Console_1.Message("dom test"));
});
