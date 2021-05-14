"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DragonBones_1 = require("../core/DragonBones");
/**
 * @language zh_CN
 * 2D 变换。
 * @version DragonBones 3.0
 */
var Transform = /** @class */ (function () {
    function Transform(
        /**
         * @language zh_CN
         * 水平位移。
         * @version DragonBones 3.0
         */
        x, 
        /**
         * @language zh_CN
         * 垂直位移。
         * @version DragonBones 3.0
         */
        y, 
        /**
         * @language zh_CN
         * 水平倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewX, 
        /**
         * @language zh_CN
         * 垂直倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewY, 
        /**
         * @language zh_CN
         * 水平缩放。
         * @version DragonBones 3.0
         */
        scaleX, 
        /**
         * @language zh_CN
         * 垂直缩放。
         * @version DragonBones 3.0
         */
        scaleY) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        if (skewX === void 0) { skewX = 0.0; }
        if (skewY === void 0) { skewY = 0.0; }
        if (scaleX === void 0) { scaleX = 1.0; }
        if (scaleY === void 0) { scaleY = 1.0; }
        this.x = x;
        this.y = y;
        this.skewX = skewX;
        this.skewY = skewY;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
    /**
     * @private
     */
    Transform.normalizeRadian = function (value) {
        value = (value + Math.PI) % (Math.PI * 2.0);
        value += value > 0.0 ? -Math.PI : Math.PI;
        return value;
    };
    /**
     * @private
     */
    Transform.prototype.toString = function () {
        return "[object dragonBones.Transform] x:" + this.x + " y:" + this.y + " skewX:" + this.skewX * 180.0 / Math.PI + " skewY:" + this.skewY * 180.0 / Math.PI + " scaleX:" + this.scaleX + " scaleY:" + this.scaleY;
    };
    /**
     * @private
     */
    Transform.prototype.copyFrom = function (value) {
        this.x = value.x;
        this.y = value.y;
        this.skewX = value.skewX;
        this.skewY = value.skewY;
        this.scaleX = value.scaleX;
        this.scaleY = value.scaleY;
        return this;
    };
    /**
     * @private
     */
    Transform.prototype.identity = function () {
        this.x = this.y = this.skewX = this.skewY = 0.0;
        this.scaleX = this.scaleY = 1.0;
        return this;
    };
    /**
     * @private
     */
    Transform.prototype.add = function (value) {
        this.x += value.x;
        this.y += value.y;
        this.skewX += value.skewX;
        this.skewY += value.skewY;
        this.scaleX *= value.scaleX;
        this.scaleY *= value.scaleY;
        return this;
    };
    /**
     * @private
     */
    Transform.prototype.minus = function (value) {
        this.x -= value.x;
        this.y -= value.y;
        this.skewX = Transform.normalizeRadian(this.skewX - value.skewX);
        this.skewY = Transform.normalizeRadian(this.skewY - value.skewY);
        this.scaleX /= value.scaleX;
        this.scaleY /= value.scaleY;
        return this;
    };
    /**
     * @language zh_CN
     * 矩阵转换为变换。
     * @param 矩阵。
     * @version DragonBones 3.0
     */
    Transform.prototype.fromMatrix = function (matrix) {
        this.x = matrix.tx;
        this.y = matrix.ty;
        this.skewX = Math.atan(-matrix.c / matrix.d);
        this.skewY = Math.atan(matrix.b / matrix.a);
        var backupScaleX = this.scaleX, backupScaleY = this.scaleY;
        var PI_Q = DragonBones_1.DragonBones.PI_Q;
        var dSkew = this.skewX - this.skewY;
        var cos = Math.cos(this.skewX);
        var sin = Math.sin(this.skewX);
        if (-0.01 < dSkew && dSkew < 0.01) {
            this.scaleX = (this.skewY > -PI_Q && this.skewY < PI_Q) ? matrix.a / cos : matrix.b / sin;
        }
        else {
            this.scaleX = (this.skewY > -PI_Q && this.skewY < PI_Q) ? matrix.a / Math.cos(this.skewY) : matrix.b / Math.sin(this.skewY);
        }
        this.scaleY = (this.skewX > -PI_Q && this.skewX < PI_Q) ? matrix.d / cos : -matrix.c / sin;
        if (backupScaleX >= 0.0 && this.scaleX < 0.0) {
            this.scaleX = -this.scaleX;
            this.skewY = Transform.normalizeRadian(this.skewY - Math.PI);
        }
        if (backupScaleY >= 0.0 && this.scaleY < 0.0) {
            this.scaleY = -this.scaleY;
            this.skewX = Transform.normalizeRadian(this.skewX - Math.PI);
        }
        return this;
    };
    /**
     * @language zh_CN
     * 转换为矩阵。
     * @param 矩阵。
     * @version DragonBones 3.0
     */
    Transform.prototype.toMatrix = function (matrix) {
        if (this.skewX !== 0.0 || this.skewY !== 0.0) {
            matrix.a = Math.cos(this.skewY);
            matrix.b = Math.sin(this.skewY);
            var dSkew = this.skewX - this.skewY;
            if (-0.01 < dSkew && dSkew < 0.01) {
                matrix.c = -matrix.b;
                matrix.d = matrix.a;
            }
            else {
                matrix.c = -Math.sin(this.skewX);
                matrix.d = Math.cos(this.skewX);
            }
            if (this.scaleX !== 1.0) {
                matrix.a *= this.scaleX;
                matrix.b *= this.scaleX;
            }
            if (this.scaleY !== 1.0) {
                matrix.c *= this.scaleY;
                matrix.d *= this.scaleY;
            }
        }
        else {
            matrix.a = this.scaleX;
            matrix.b = 0.0;
            matrix.c = 0.0;
            matrix.d = this.scaleY;
        }
        matrix.tx = this.x;
        matrix.ty = this.y;
        return this;
    };
    Object.defineProperty(Transform.prototype, "rotation", {
        /**
         * @language zh_CN
         * 旋转。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        get: function () {
            return this.scaleX >= 0.0 ? this.skewY : this.skewY + Math.PI;
        },
        set: function (value) {
            var dValue = this.scaleX >= 0.0 ? (value - this.skewY) : (value - this.skewY - Math.PI);
            this.skewX += dValue;
            this.skewY += dValue;
        },
        enumerable: true,
        configurable: true
    });
    return Transform;
}());
exports.Transform = Transform;
