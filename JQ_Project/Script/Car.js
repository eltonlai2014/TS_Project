"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com;
(function (com) {
    var syspower;
    (function (syspower) {
        var test;
        (function (test) {
            var util;
            (function (util) {
                var Car = /** @class */ (function () {
                    function Car(initObj) {
                        this.descroption = '我是車子';
                        this.color = initObj.color;
                        this.brakes = '商業機密的煞車方式';
                    }
                    Car.prototype.getDescription = function () {
                        return this.descroption + "-" + this.color;
                    };
                    Car.prototype.triggerBrakes = function () {
                        if (this.brakes === '商業機密的煞車方式') {
                            return '用了商業機密的煞車方式';
                        }
                        return '沒有機密方式，沒有煞車';
                    };
                    return Car;
                }());
                util.Car = Car;
                ;
                var Foo = /** @class */ (function (_super) {
                    __extends(Foo, _super);
                    function Foo(initObj) {
                        var _this = _super.call(this, initObj) || this;
                        _this.brakes2 = 'FOO 商業機密的煞車方式';
                        return _this;
                    }
                    Foo.prototype.triggerBrakes = function () {
                        return this.brakes2;
                    };
                    return Foo;
                }(Car));
                util.Foo = Foo;
            })(util = test.util || (test.util = {}));
        })(test = syspower.test || (syspower.test = {}));
    })(syspower = com.syspower || (com.syspower = {}));
})(com || (com = {}));
