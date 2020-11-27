var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./Base_Food"], function (require, exports, Base_Food_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Hamburger = /** @class */ (function (_super) {
        __extends(Hamburger, _super);
        function Hamburger() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Hamburger.prototype.getDescription = function () {
            return "[Hamburger2] " + this.descroption + " " + this.color;
        };
        Hamburger.prototype.getPrice = function () {
            return 100;
        };
        return Hamburger;
    }(Base_Food_1.Base_Food));
    exports.Hamburger = Hamburger;
    ;
});
//export { Hamburger };
