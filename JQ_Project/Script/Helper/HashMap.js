define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HashMap = /** @class */ (function () {
        function HashMap() {
            // Map Size
            this.size = 0;
            // Map Object
            this.entry = {};
        }
        // 存
        HashMap.prototype.put = function (key, value) {
            if (!this.containsKey(key)) {
                this.size++;
            }
            this.entry[key] = value;
        };
        // 取
        HashMap.prototype.get = function (key) {
            if (this.containsKey(key)) {
                return this.entry[key];
            }
            else {
                return null;
            }
        };
        // 刪除
        HashMap.prototype.remove = function (key) {
            if (delete this.entry[key]) {
                this.size--;
            }
        };
        // 是否包含Key
        HashMap.prototype.containsKey = function (key) {
            return (key in this.entry);
        };
        // 是否包含Value
        HashMap.prototype.containsValue = function (value) {
            for (var prop in this.entry) {
                if (this.entry[prop] == value) {
                    return true;
                }
            }
            return false;
        };
        // 所有Value
        HashMap.prototype.values = function () {
            var values = [];
            for (var prop in this.entry) {
                values.push(this.entry[prop]);
            }
            return values;
        };
        // 所有Key
        HashMap.prototype.keys = function () {
            var keys = [];
            for (var prop in this.entry) {
                keys.push(prop);
            }
            return keys;
        };
        HashMap.prototype.getSize = function () {
            return this.size;
        };
        // 清Map
        HashMap.prototype.clear = function () {
            this.size = 0;
            this.entry = {};
            return this.size;
        };
        return HashMap;
    }());
    exports.HashMap = HashMap;
});
