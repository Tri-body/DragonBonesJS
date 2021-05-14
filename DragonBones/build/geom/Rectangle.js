"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle = /** @class */ (function () {
    function Rectangle(x, y, width, height) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        if (width === void 0) { width = 0.0; }
        if (height === void 0) { height = 0.0; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
        this.width = value.width;
        this.height = value.height;
    };
    Rectangle.prototype.clear = function () {
        this.x = this.y = 0.0;
        this.width = this.height = 0.0;
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
