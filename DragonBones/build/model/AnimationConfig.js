"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseObject_1 = require("../core/BaseObject");
/**
 * @language zh_CN
 * @beta
 * 动画配置，描述播放一个动画所需要的全部信息。
 * @see dragonBones.AnimationState
 * @version DragonBones 5.0
 */
var AnimationConfig = /** @class */ (function (_super) {
    tslib_1.__extends(AnimationConfig, _super);
    /**
     * @internal
     * @private
     */
    function AnimationConfig() {
        var _this = _super.call(this) || this;
        /**
         * @language zh_CN
         * 骨骼遮罩。
         * @version DragonBones 5.0
         */
        _this.boneMask = [];
        /**
         * @language zh_CN
         * @version DragonBones 5.0
         */
        _this.animationNames = [];
        return _this;
    }
    AnimationConfig.toString = function () {
        return "[class dragonBones.AnimationConfig]";
    };
    /**
     * @private
     */
    AnimationConfig.prototype._onClear = function () {
        this.pauseFadeOut = true;
        this.fadeOutMode = 4 /* All */;
        this.fadeOutTime = -1.0;
        this.fadeOutEasing = 0.0;
        this.additiveBlending = false;
        this.displayControl = true;
        this.pauseFadeIn = true;
        this.actionEnabled = true;
        this.playTimes = -1;
        this.layer = 0;
        this.position = 0.0;
        this.duration = -1.0;
        this.timeScale = -100.0;
        this.fadeInTime = -1.0;
        this.autoFadeOutTime = -1.0;
        this.fadeInEasing = 0.0;
        this.weight = 1.0;
        this.name = null;
        this.animation = null;
        this.group = null;
        this.boneMask.length = 0;
        this.animationNames.length = 0;
    };
    AnimationConfig.prototype.clear = function () {
        this._onClear();
    };
    AnimationConfig.prototype.copyFrom = function (value) {
        this.pauseFadeOut = value.pauseFadeOut;
        this.fadeOutMode = value.fadeOutMode;
        this.autoFadeOutTime = value.autoFadeOutTime;
        this.fadeOutEasing = value.fadeOutEasing;
        this.additiveBlending = value.additiveBlending;
        this.displayControl = value.displayControl;
        this.pauseFadeIn = value.pauseFadeIn;
        this.actionEnabled = value.actionEnabled;
        this.playTimes = value.playTimes;
        this.layer = value.layer;
        this.position = value.position;
        this.duration = value.duration;
        this.timeScale = value.timeScale;
        this.fadeInTime = value.fadeInTime;
        this.fadeOutTime = value.fadeOutTime;
        this.fadeInEasing = value.fadeInEasing;
        this.weight = value.weight;
        this.name = value.name;
        this.animation = value.animation;
        this.group = value.group;
        this.boneMask.length = value.boneMask.length;
        for (var i = 0, l = this.boneMask.length; i < l; ++i) {
            this.boneMask[i] = value.boneMask[i];
        }
        this.animationNames.length = value.animationNames.length;
        for (var i = 0, l = this.animationNames.length; i < l; ++i) {
            this.animationNames[i] = value.animationNames[i];
        }
    };
    AnimationConfig.prototype.containsBoneMask = function (name) {
        return this.boneMask.length === 0 || this.boneMask.indexOf(name) >= 0;
    };
    AnimationConfig.prototype.addBoneMask = function (armature, name, recursive) {
        if (recursive === void 0) { recursive = true; }
        var currentBone = armature.getBone(name);
        if (!currentBone) {
            return;
        }
        if (this.boneMask.indexOf(name) < 0) { // Add mixing
            this.boneMask.push(name);
        }
        if (recursive) { // Add recursive mixing.
            var bones = armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (this.boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                    this.boneMask.push(bone.name);
                }
            }
        }
    };
    AnimationConfig.prototype.removeBoneMask = function (armature, name, recursive) {
        if (recursive === void 0) { recursive = true; }
        var index = this.boneMask.indexOf(name);
        if (index >= 0) { // Remove mixing.
            this.boneMask.splice(index, 1);
        }
        if (recursive) {
            var currentBone = armature.getBone(name);
            if (currentBone) {
                var bones = armature.getBones();
                if (this.boneMask.length > 0) { // Remove recursive mixing.
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        var index_1 = this.boneMask.indexOf(bone.name);
                        if (index_1 >= 0 && currentBone.contains(bone)) {
                            this.boneMask.splice(index_1, 1);
                        }
                    }
                }
                else { // Add unrecursive mixing.
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        if (!currentBone.contains(bone)) {
                            this.boneMask.push(bone.name);
                        }
                    }
                }
            }
        }
    };
    return AnimationConfig;
}(BaseObject_1.BaseObject));
exports.AnimationConfig = AnimationConfig;
