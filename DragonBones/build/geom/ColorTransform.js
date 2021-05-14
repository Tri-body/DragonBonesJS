"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @private
 */
var ColorTransform = /** @class */ (function () {
    function ColorTransform(alphaMultiplier, redMultiplier, greenMultiplier, blueMultiplier, alphaOffset, redOffset, greenOffset, blueOffset) {
        if (alphaMultiplier === void 0) { alphaMultiplier = 1.0; }
        if (redMultiplier === void 0) { redMultiplier = 1.0; }
        if (greenMultiplier === void 0) { greenMultiplier = 1.0; }
        if (blueMultiplier === void 0) { blueMultiplier = 1.0; }
        if (alphaOffset === void 0) { alphaOffset = 0; }
        if (redOffset === void 0) { redOffset = 0; }
        if (greenOffset === void 0) { greenOffset = 0; }
        if (blueOffset === void 0) { blueOffset = 0; }
        this.alphaMultiplier = alphaMultiplier;
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaOffset = alphaOffset;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
    }
    ColorTransform.prototype.copyFrom = function (value) {
        this.alphaMultiplier = value.alphaMultiplier;
        this.redMultiplier = value.redMultiplier;
        this.greenMultiplier = value.greenMultiplier;
        this.blueMultiplier = value.blueMultiplier;
        this.alphaOffset = value.alphaOffset;
        this.redOffset = value.redOffset;
        this.redOffset = value.redOffset;
        this.greenOffset = value.blueOffset;
    };
    ColorTransform.prototype.identity = function () {
        this.alphaMultiplier = this.redMultiplier = this.greenMultiplier = this.blueMultiplier = 1.0;
        this.alphaOffset = this.redOffset = this.greenOffset = this.blueOffset = 0;
    };
    return ColorTransform;
}());
exports.ColorTransform = ColorTransform;
