"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @language zh_CN
 * 2D 矩阵。
 * @version DragonBones 3.0
 */
var Matrix = /** @class */ (function () {
    function Matrix(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1.0; }
        if (b === void 0) { b = 0.0; }
        if (c === void 0) { c = 0.0; }
        if (d === void 0) { d = 1.0; }
        if (tx === void 0) { tx = 0.0; }
        if (ty === void 0) { ty = 0.0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    /**
     * @private
     */
    Matrix.prototype.toString = function () {
        return "[object dragonBones.Matrix] a:" + this.a + " b:" + this.b + " c:" + this.c + " d:" + this.d + " tx:" + this.tx + " ty:" + this.ty;
    };
    /**
     * @language zh_CN
     * 复制矩阵。
     * @param value 需要复制的矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.copyFrom = function (value) {
        this.a = value.a;
        this.b = value.b;
        this.c = value.c;
        this.d = value.d;
        this.tx = value.tx;
        this.ty = value.ty;
        return this;
    };
    /**
     * @private
     */
    Matrix.prototype.copyFromArray = function (value, offset) {
        if (offset === void 0) { offset = 0; }
        this.a = value[offset];
        this.b = value[offset + 1];
        this.c = value[offset + 2];
        this.d = value[offset + 3];
        this.tx = value[offset + 4];
        this.ty = value[offset + 5];
        return this;
    };
    /**
     * @language zh_CN
     * 转换为恒等矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.identity = function () {
        this.a = this.d = 1.0;
        this.b = this.c = 0.0;
        this.tx = this.ty = 0.0;
        return this;
    };
    /**
     * @language zh_CN
     * 将当前矩阵与另一个矩阵相乘。
     * @param value 需要相乘的矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.concat = function (value) {
        var aA = this.a * value.a;
        var bA = 0.0;
        var cA = 0.0;
        var dA = this.d * value.d;
        var txA = this.tx * value.a + value.tx;
        var tyA = this.ty * value.d + value.ty;
        if (this.b !== 0.0 || this.c !== 0.0) {
            aA += this.b * value.c;
            bA += this.b * value.d;
            cA += this.c * value.a;
            dA += this.c * value.b;
        }
        if (value.b !== 0.0 || value.c !== 0.0) {
            bA += this.a * value.b;
            cA += this.d * value.c;
            txA += this.ty * value.c;
            tyA += this.tx * value.b;
        }
        this.a = aA;
        this.b = bA;
        this.c = cA;
        this.d = dA;
        this.tx = txA;
        this.ty = tyA;
        return this;
    };
    /**
     * @language zh_CN
     * 转换为逆矩阵。
     * @version DragonBones 3.0
     */
    Matrix.prototype.invert = function () {
        var aA = this.a;
        var bA = this.b;
        var cA = this.c;
        var dA = this.d;
        var txA = this.tx;
        var tyA = this.ty;
        if (bA === 0.0 && cA === 0.0) {
            this.b = this.c = 0.0;
            if (aA === 0.0 || dA === 0.0) {
                this.a = this.b = this.tx = this.ty = 0.0;
            }
            else {
                aA = this.a = 1.0 / aA;
                dA = this.d = 1.0 / dA;
                this.tx = -aA * txA;
                this.ty = -dA * tyA;
            }
            return this;
        }
        var determinant = aA * dA - bA * cA;
        if (determinant === 0.0) {
            this.a = this.d = 1.0;
            this.b = this.c = 0.0;
            this.tx = this.ty = 0.0;
            return this;
        }
        determinant = 1.0 / determinant;
        var k = this.a = dA * determinant;
        bA = this.b = -bA * determinant;
        cA = this.c = -cA * determinant;
        dA = this.d = aA * determinant;
        this.tx = -(k * txA + cA * tyA);
        this.ty = -(bA * txA + dA * tyA);
        return this;
    };
    /**
     * @language zh_CN
     * 将矩阵转换应用于指定点。
     * @param x 横坐标。
     * @param y 纵坐标。
     * @param result 应用转换之后的坐标。
     * @params delta 是否忽略 tx，ty 对坐标的转换。
     * @version DragonBones 3.0
     */
    Matrix.prototype.transformPoint = function (x, y, result, delta) {
        if (delta === void 0) { delta = false; }
        result.x = this.a * x + this.c * y;
        result.y = this.b * x + this.d * y;
        if (!delta) {
            result.x += this.tx;
            result.y += this.ty;
        }
    };
    return Matrix;
}());
exports.Matrix = Matrix;
