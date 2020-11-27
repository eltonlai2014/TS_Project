define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Base_Food = /** @class */ (function () {
        function Base_Food(initObj) {
            this.descroption = initObj.descroption;
            this.color = initObj.color;
        }
        Base_Food.prototype.getDescription = function () {
            return "[Base_Food] " + this.descroption + "-" + this.color;
        };
        return Base_Food;
    }());
    exports.Base_Food = Base_Food;
    ;
});
