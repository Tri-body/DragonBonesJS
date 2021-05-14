"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
    };
    Point.prototype.clear = function () {
        this.x = this.y = 0.0;
    };
    return Point;
}());
exports.Point = Point;
