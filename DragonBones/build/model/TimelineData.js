"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseObject_1 = require("../core/BaseObject");
var Transform_1 = require("../geom/Transform");
/**
 * @private
 */
var TimelineData = /** @class */ (function (_super) {
    tslib_1.__extends(TimelineData, _super);
    /**
     * @private
     */
    function TimelineData() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.frames = [];
        return _this;
    }
    /**
     * @private
     */
    TimelineData.toString = function () {
        return "[class dragonBones.TimelineData]";
    };
    /**
     * @private
     */
    TimelineData.prototype._onClear = function () {
        var prevFrame = null;
        for (var i = 0, l = this.frames.length; i < l; ++i) { // Find key frame data.
            var frame = this.frames[i];
            if (prevFrame && frame !== prevFrame) {
                prevFrame.returnToPool();
            }
            prevFrame = frame;
        }
        this.scale = 1;
        this.offset = 0;
        this.frames.length = 0;
    };
    return TimelineData;
}(BaseObject_1.BaseObject));
exports.TimelineData = TimelineData;
/**
 * @private
 */
var ZOrderTimelineData = /** @class */ (function (_super) {
    tslib_1.__extends(ZOrderTimelineData, _super);
    function ZOrderTimelineData() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZOrderTimelineData.toString = function () {
        return "[class dragonBones.ZOrderTimelineData]";
    };
    return ZOrderTimelineData;
}(TimelineData));
exports.ZOrderTimelineData = ZOrderTimelineData;
/**
 * @private
 */
var BoneTimelineData = /** @class */ (function (_super) {
    tslib_1.__extends(BoneTimelineData, _super);
    function BoneTimelineData() {
        var _this = _super.call(this) || this;
        _this.originalTransform = new Transform_1.Transform();
        return _this;
    }
    BoneTimelineData.toString = function () {
        return "[class dragonBones.BoneTimelineData]";
    };
    BoneTimelineData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.originalTransform.identity();
        this.bone = null;
    };
    return BoneTimelineData;
}(TimelineData));
exports.BoneTimelineData = BoneTimelineData;
/**
 * @private
 */
var SlotTimelineData = /** @class */ (function (_super) {
    tslib_1.__extends(SlotTimelineData, _super);
    function SlotTimelineData() {
        return _super.call(this) || this;
    }
    SlotTimelineData.toString = function () {
        return "[class dragonBones.SlotTimelineData]";
    };
    SlotTimelineData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.slot = null;
    };
    return SlotTimelineData;
}(TimelineData));
exports.SlotTimelineData = SlotTimelineData;
/**
 * @private
 */
var FFDTimelineData = /** @class */ (function (_super) {
    tslib_1.__extends(FFDTimelineData, _super);
    function FFDTimelineData() {
        return _super.call(this) || this;
    }
    FFDTimelineData.toString = function () {
        return "[class dragonBones.FFDTimelineData]";
    };
    FFDTimelineData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.skin = null;
        this.slot = null;
        this.display = null;
    };
    return FFDTimelineData;
}(TimelineData));
exports.FFDTimelineData = FFDTimelineData;
