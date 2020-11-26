var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "./Dom", "./Console"], function (require, exports, Dom_1, Console_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Dom_1 = __importDefault(Dom_1);
    var c = new Console_1.ConsoleOutput();
    c.Write(new Console_1.Message("console test"));
    var d = new Dom_1.default();
    d.Write(new Console_1.Message("dom test"));
});
