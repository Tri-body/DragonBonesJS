"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TimelineData_1 = require("./TimelineData");
var DragonBones_1 = require("../core/DragonBones");
/**
 * @language zh_CN
 * 动画数据。
 * @version DragonBones 3.0
 */
var AnimationData = /** @class */ (function (_super) {
    __extends(AnimationData, _super);
    /**
     * @internal
     * @private
     */
    function AnimationData() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.boneTimelines = {};
        /**
         * @private
         */
        _this.slotTimelines = {};
        /**
         * @private
         */
        _this.ffdTimelines = {}; // skin slot mesh
        /**
         * @private
         */
        _this.cachedFrames = [];
        /**
         * @private
         */
        _this.boneCachedFrameIndices = {};
        /**
         * @private
         */
        _this.slotCachedFrameIndices = {};
        return _this;
    }
    /**
     * @private
     */
    AnimationData.toString = function () {
        return "[class dragonBones.AnimationData]";
    };
    /**
     * @private
     */
    AnimationData.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        for (var k in this.boneTimelines) {
            this.boneTimelines[k].returnToPool();
            delete this.boneTimelines[k];
        }
        for (var k in this.slotTimelines) {
            this.slotTimelines[k].returnToPool();
            delete this.slotTimelines[k];
        }
        for (var k in this.ffdTimelines) {
            for (var kA in this.ffdTimelines[k]) {
                for (var kB in this.ffdTimelines[k][kA]) {
                    this.ffdTimelines[k][kA][kB].returnToPool();
                }
            }
            delete this.ffdTimelines[k];
        }
        for (var k in this.boneCachedFrameIndices) {
            // this.boneCachedFrameIndices[i].length = 0;
            delete this.boneCachedFrameIndices[k];
        }
        for (var k in this.slotCachedFrameIndices) {
            // this.slotCachedFrameIndices[i].length = 0;
            delete this.slotCachedFrameIndices[k];
        }
        if (this.zOrderTimeline) {
            this.zOrderTimeline.returnToPool();
        }
        this.frameCount = 0;
        this.playTimes = 0;
        this.duration = 0.0;
        this.fadeInTime = 0.0;
        this.cacheFrameRate = 0.0;
        this.name = null;
        //this.boneTimelines.clear();
        //this.slotTimelines.clear();
        //this.ffdTimelines.clear();
        this.cachedFrames.length = 0;
        //this.boneCachedFrameIndices.clear();
        //this.boneCachedFrameIndices.clear();
        this.zOrderTimeline = null;
    };
    /**
     * @private
     */
    AnimationData.prototype.cacheFrames = function (frameRate) {
        if (this.cacheFrameRate > 0.0) {
            return;
        }
        this.cacheFrameRate = Math.max(Math.ceil(frameRate * this.scale), 1.0);
        var cacheFrameCount = Math.ceil(this.cacheFrameRate * this.duration) + 1; // uint
        this.cachedFrames.length = 0;
        this.cachedFrames.length = cacheFrameCount;
        for (var k in this.boneTimelines) {
            var indices = new Array(cacheFrameCount);
            for (var i = 0, l = indices.length; i < l; ++i) {
                indices[i] = -1;
            }
            this.boneCachedFrameIndices[k] = indices;
        }
        for (var k in this.slotTimelines) {
            var indices = new Array(cacheFrameCount);
            for (var i = 0, l = indices.length; i < l; ++i) {
                indices[i] = -1;
            }
            this.slotCachedFrameIndices[k] = indices;
        }
    };
    /**
     * @private
     */
    AnimationData.prototype.addBoneTimeline = function (value) {
        if (value && value.bone && !this.boneTimelines[value.bone.name]) {
            this.boneTimelines[value.bone.name] = value;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @private
     */
    AnimationData.prototype.addSlotTimeline = function (value) {
        if (value && value.slot && !this.slotTimelines[value.slot.name]) {
            this.slotTimelines[value.slot.name] = value;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @private
     */
    AnimationData.prototype.addFFDTimeline = function (value) {
        if (value && value.skin && value.slot && value.display) {
            var skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
            var slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};
            if (!slot[value.display.name]) {
                slot[value.display.name] = value;
            }
            else {
                throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
            }
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @private
     */
    AnimationData.prototype.getBoneTimeline = function (name) {
        return this.boneTimelines[name];
    };
    /**
     * @private
     */
    AnimationData.prototype.getSlotTimeline = function (name) {
        return this.slotTimelines[name];
    };
    /**
     * @private
     */
    AnimationData.prototype.getFFDTimeline = function (skinName, slotName) {
        var skin = this.ffdTimelines[skinName];
        if (skin) {
            return skin[slotName];
        }
        return null;
    };
    /**
     * @private
     */
    AnimationData.prototype.getBoneCachedFrameIndices = function (name) {
        return this.boneCachedFrameIndices[name];
    };
    /**
     * @private
     */
    AnimationData.prototype.getSlotCachedFrameIndices = function (name) {
        return this.slotCachedFrameIndices[name];
    };
    return AnimationData;
}(TimelineData_1.TimelineData));
exports.AnimationData = AnimationData;
