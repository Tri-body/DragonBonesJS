"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseObject_1 = require("../core/BaseObject");
var Point_1 = require("../geom/Point");
var Transform_1 = require("../geom/Transform");
var ColorTransform_1 = require("../geom/ColorTransform");
/**
 * @private
 */
var FrameData = /** @class */ (function (_super) {
    tslib_1.__extends(FrameData, _super);
    function FrameData() {
        return _super.call(this) || this;
    }
    FrameData.prototype._onClear = function () {
        this.position = 0.0;
        this.duration = 0.0;
        this.prev = null;
        this.next = null;
    };
    return FrameData;
}(BaseObject_1.BaseObject));
exports.FrameData = FrameData;
/**
 * @private
 */
var TweenFrameData = /** @class */ (function (_super) {
    tslib_1.__extends(TweenFrameData, _super);
    function TweenFrameData() {
        return _super.call(this) || this;
    }
    TweenFrameData._getCurvePoint = function (x1, y1, x2, y2, x3, y3, x4, y4, t, result) {
        var l_t = 1 - t;
        var powA = l_t * l_t;
        var powB = t * t;
        var kA = l_t * powA;
        var kB = 3.0 * t * powA;
        var kC = 3.0 * l_t * powB;
        var kD = t * powB;
        result.x = kA * x1 + kB * x2 + kC * x3 + kD * x4;
        result.y = kA * y1 + kB * y2 + kC * y3 + kD * y4;
    };
    TweenFrameData.samplingEasingCurve = function (curve, samples) {
        var curveCount = curve.length;
        var result = new Point_1.Point();
        var stepIndex = -2;
        for (var i = 0, l = samples.length; i < l; ++i) {
            var t = (i + 1) / (l + 1);
            while ((stepIndex + 6 < curveCount ? curve[stepIndex + 6] : 1) < t) { // stepIndex + 3 * 2
                stepIndex += 6;
            }
            var isInCurve = stepIndex >= 0 && stepIndex + 6 < curveCount;
            var x1 = isInCurve ? curve[stepIndex] : 0.0;
            var y1 = isInCurve ? curve[stepIndex + 1] : 0.0;
            var x2 = curve[stepIndex + 2];
            var y2 = curve[stepIndex + 3];
            var x3 = curve[stepIndex + 4];
            var y3 = curve[stepIndex + 5];
            var x4 = isInCurve ? curve[stepIndex + 6] : 1.0;
            var y4 = isInCurve ? curve[stepIndex + 7] : 1.0;
            var lower = 0.0;
            var higher = 1.0;
            while (higher - lower > 0.01) {
                var percentage = (higher + lower) / 2.0;
                TweenFrameData._getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, percentage, result);
                if (t - result.x > 0.0) {
                    lower = percentage;
                }
                else {
                    higher = percentage;
                }
            }
            samples[i] = result.y;
        }
    };
    TweenFrameData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.tweenEasing = 0.0;
        this.curve = null;
    };
    return TweenFrameData;
}(FrameData));
exports.TweenFrameData = TweenFrameData;
/**
 * @private
 */
var AnimationFrameData = /** @class */ (function (_super) {
    tslib_1.__extends(AnimationFrameData, _super);
    function AnimationFrameData() {
        var _this = _super.call(this) || this;
        _this.actions = [];
        _this.events = [];
        return _this;
    }
    AnimationFrameData.toString = function () {
        return "[class dragonBones.AnimationFrameData]";
    };
    AnimationFrameData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        for (var i = 0, l = this.actions.length; i < l; ++i) {
            this.actions[i].returnToPool();
        }
        for (var i = 0, l = this.events.length; i < l; ++i) {
            this.events[i].returnToPool();
        }
        this.actions.length = 0;
        this.events.length = 0;
    };
    return AnimationFrameData;
}(FrameData));
exports.AnimationFrameData = AnimationFrameData;
/**
 * @private
 */
var ZOrderFrameData = /** @class */ (function (_super) {
    tslib_1.__extends(ZOrderFrameData, _super);
    function ZOrderFrameData() {
        var _this = _super.call(this) || this;
        _this.zOrder = [];
        return _this;
    }
    ZOrderFrameData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.zOrder.length = 0;
    };
    return ZOrderFrameData;
}(FrameData));
exports.ZOrderFrameData = ZOrderFrameData;
/**
 * @private
 */
var BoneFrameData = /** @class */ (function (_super) {
    tslib_1.__extends(BoneFrameData, _super);
    function BoneFrameData() {
        var _this = _super.call(this) || this;
        _this.transform = new Transform_1.Transform();
        return _this;
    }
    BoneFrameData.toString = function () {
        return "[class dragonBones.BoneFrameData]";
    };
    BoneFrameData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.tweenScale = false;
        this.tweenRotate = 0.0;
        this.transform.identity();
    };
    return BoneFrameData;
}(TweenFrameData));
exports.BoneFrameData = BoneFrameData;
/**
 * @private
 */
var SlotFrameData = /** @class */ (function (_super) {
    tslib_1.__extends(SlotFrameData, _super);
    function SlotFrameData() {
        return _super.call(this) || this;
    }
    SlotFrameData.generateColor = function () {
        return new ColorTransform_1.ColorTransform();
    };
    SlotFrameData.toString = function () {
        return "[class dragonBones.SlotFrameData]";
    };
    SlotFrameData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.displayIndex = 0;
        this.color = null;
    };
    SlotFrameData.DEFAULT_COLOR = new ColorTransform_1.ColorTransform();
    return SlotFrameData;
}(TweenFrameData));
exports.SlotFrameData = SlotFrameData;
/**
 * @private
 */
var ExtensionFrameData = /** @class */ (function (_super) {
    tslib_1.__extends(ExtensionFrameData, _super);
    function ExtensionFrameData() {
        var _this = _super.call(this) || this;
        _this.tweens = [];
        return _this;
    }
    ExtensionFrameData.toString = function () {
        return "[class dragonBones.ExtensionFrameData]";
    };
    ExtensionFrameData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.tweens.length = 0;
    };
    return ExtensionFrameData;
}(TweenFrameData));
exports.ExtensionFrameData = ExtensionFrameData;
