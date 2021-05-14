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
var BaseObject_1 = require("../core/BaseObject");
var AnimationState_1 = require("./AnimationState");
var DragonBones_1 = require("../core/DragonBones");
var AnimationConfig_1 = require("../model/AnimationConfig");
/**
 * @language zh_CN
 * 动画控制器，用来播放动画数据，管理动画状态。
 * @see dragonBones.AnimationData
 * @see dragonBones.AnimationState
 * @version DragonBones 3.0
 */
var Animation = /** @class */ (function (_super) {
    __extends(Animation, _super);
    /**
     * @internal
     * @private
     */
    function Animation() {
        var _this = _super.call(this) || this;
        _this._animationNames = [];
        _this._animations = {};
        _this._animationStates = [];
        return _this;
    }
    Animation._sortAnimationState = function (a, b) {
        return a.layer > b.layer ? -1 : 1;
    };
    /**
     * @private
     */
    Animation.toString = function () {
        return "[class dragonBones.Animation]";
    };
    /**
     * @private
     */
    Animation.prototype._onClear = function () {
        for (var i = 0, l = this._animationStates.length; i < l; ++i) {
            this._animationStates[i].returnToPool();
        }
        if (this._animationConfig) {
            this._animationConfig.returnToPool();
        }
        for (var k in this._animations) {
            delete this._animations[k];
        }
        this.timeScale = 1.0;
        this._isPlaying = false;
        this._animationStateDirty = false;
        this._timelineStateDirty = false;
        this._cacheFrameIndex = -1;
        this._animationNames.length = 0;
        //this._animations.clear();
        this._animationStates.length = 0;
        this._armature = null;
        this._lastAnimationState = null;
        this._animationConfig = null;
    };
    Animation.prototype._fadeOut = function (animationConfig) {
        var i = 0, l = this._animationStates.length;
        var animationState = null;
        switch (animationConfig.fadeOutMode) {
            case 1 /* SameLayer */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    if (animationState.layer === animationConfig.layer) {
                        animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                    }
                }
                break;
            case 2 /* SameGroup */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    if (animationState.group === animationConfig.group) {
                        animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                    }
                }
                break;
            case 3 /* SameLayerAndGroup */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    if (animationState.layer === animationConfig.layer &&
                        animationState.group === animationConfig.group) {
                        animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                    }
                }
                break;
            case 4 /* All */:
                for (; i < l; ++i) {
                    animationState = this._animationStates[i];
                    animationState.fadeOut(animationConfig.fadeOutTime, animationConfig.pauseFadeOut);
                }
                break;
            case 0 /* None */:
            default:
                break;
        }
    };
    /**
     * @internal
     * @private
     */
    Animation.prototype._init = function (armature) {
        if (this._armature) {
            return;
        }
        this._armature = armature;
        this._animationConfig = BaseObject_1.BaseObject.borrowObject(AnimationConfig_1.AnimationConfig);
    };
    /**
     * @internal
     * @private
     */
    Animation.prototype._advanceTime = function (passedTime) {
        if (!this._isPlaying) {
            return;
        }
        if (passedTime < 0.0) {
            passedTime = -passedTime;
        }
        if (this._armature.inheritAnimation && this._armature._parent) {
            passedTime *= this._armature._parent._armature.animation.timeScale;
        }
        if (this.timeScale !== 1.0) {
            passedTime *= this.timeScale;
        }
        var animationStateCount = this._animationStates.length;
        if (animationStateCount === 1) {
            var animationState = this._animationStates[0];
            if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                animationState.returnToPool();
                this._animationStates.length = 0;
                this._animationStateDirty = true;
                this._lastAnimationState = null;
            }
            else {
                var animationData = animationState.animationData;
                var cacheFrameRate = animationData.cacheFrameRate;
                if (this._animationStateDirty && cacheFrameRate > 0.0) {
                    this._animationStateDirty = false;
                    var bones = this._armature.getBones();
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        bone._cachedFrameIndices = animationData.getBoneCachedFrameIndices(bone.name);
                    }
                    var slots = this._armature.getSlots();
                    for (var i = 0, l = slots.length; i < l; ++i) {
                        var slot = slots[i];
                        slot._cachedFrameIndices = animationData.getSlotCachedFrameIndices(slot.name);
                    }
                }
                if (this._timelineStateDirty) {
                    animationState._updateTimelineStates();
                }
                animationState._advanceTime(passedTime, cacheFrameRate);
            }
        }
        else if (animationStateCount > 1) {
            for (var i = 0, r = 0; i < animationStateCount; ++i) {
                var animationState = this._animationStates[i];
                if (animationState._fadeState > 0 && animationState._subFadeState > 0) {
                    r++;
                    animationState.returnToPool();
                    this._animationStateDirty = true;
                    if (this._lastAnimationState === animationState) {
                        this._lastAnimationState = null;
                    }
                }
                else {
                    if (r > 0) {
                        this._animationStates[i - r] = animationState;
                    }
                    if (this._timelineStateDirty) {
                        animationState._updateTimelineStates();
                    }
                    animationState._advanceTime(passedTime, 0.0);
                }
                if (i === animationStateCount - 1 && r > 0) {
                    this._animationStates.length -= r;
                    if (!this._lastAnimationState && this._animationStates.length > 0) {
                        this._lastAnimationState = this._animationStates[this._animationStates.length - 1];
                    }
                }
            }
            this._cacheFrameIndex = -1;
        }
        else {
            this._cacheFrameIndex = -1;
        }
        this._timelineStateDirty = false;
    };
    /**
     * @language zh_CN
     * 清除所有动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.reset = function () {
        for (var i = 0, l = this._animationStates.length; i < l; ++i) {
            this._animationStates[i].returnToPool();
        }
        this._isPlaying = false;
        this._animationStateDirty = false;
        this._timelineStateDirty = false;
        this._cacheFrameIndex = -1;
        this._animationConfig.clear();
        this._animationStates.length = 0;
        this._lastAnimationState = null;
    };
    /**
     * @language zh_CN
     * 暂停播放动画。
     * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    Animation.prototype.stop = function (animationName) {
        if (animationName === void 0) { animationName = null; }
        if (animationName) {
            var animationState = this.getState(animationName);
            if (animationState) {
                animationState.stop();
            }
        }
        else {
            this._isPlaying = false;
        }
    };
    /**
     * @language zh_CN
     * @beta
     * 通过动画配置来播放动画。
     * @param animationConfig 动画配置。
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationConfig
     * @see dragonBones.AnimationState
     * @version DragonBones 5.0
     */
    Animation.prototype.playConfig = function (animationConfig) {
        if (!animationConfig) {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
            //return null;
        }
        var animationName = animationConfig.animation ? animationConfig.animation : animationConfig.name;
        var animationData = this._animations[animationName];
        if (!animationData) {
            console.warn("Non-existent animation.\n", "DragonBones name: " + this._armature.armatureData.parent.name, "Armature name: " + this._armature.name, "Animation name: " + animationName);
            return null;
        }
        this._isPlaying = true;
        if (animationConfig.fadeInTime < 0.0 || animationConfig.fadeInTime !== animationConfig.fadeInTime) {
            if (this._lastAnimationState) {
                animationConfig.fadeInTime = animationData.fadeInTime;
            }
            else {
                animationConfig.fadeInTime = 0.0;
            }
        }
        if (animationConfig.fadeOutTime < 0.0 || animationConfig.fadeOutTime !== animationConfig.fadeOutTime) {
            animationConfig.fadeOutTime = animationConfig.fadeInTime;
        }
        if (animationConfig.timeScale <= -100.0 || animationConfig.timeScale !== animationConfig.timeScale) {
            animationConfig.timeScale = 1.0 / animationData.scale;
        }
        if (animationData.frameCount > 1) {
            if (animationConfig.position !== animationConfig.position) {
                animationConfig.position = 0.0;
            }
            else if (animationConfig.position < 0.0) {
                animationConfig.position %= animationData.duration;
                animationConfig.position = animationData.duration - animationConfig.position;
            }
            else if (animationConfig.position === animationData.duration) {
                animationConfig.position -= 0.000001;
            }
            else if (animationConfig.position > animationData.duration) {
                animationConfig.position %= animationData.duration;
            }
            if (animationConfig.duration > 0.0 && animationConfig.position + animationConfig.duration > animationData.duration) {
                animationConfig.duration = animationData.duration - animationConfig.position;
            }
            if (animationConfig.playTimes < 0) {
                animationConfig.playTimes = animationData.playTimes;
            }
        }
        else {
            animationConfig.playTimes = 1;
            animationConfig.position = 0.0;
            if (animationConfig.duration > 0.0) {
                animationConfig.duration = 0.0;
            }
        }
        var isStop = false;
        if (animationConfig.duration === 0.0) {
            animationConfig.duration = -1.0;
            isStop = true;
        }
        this._fadeOut(animationConfig);
        this._lastAnimationState = BaseObject_1.BaseObject.borrowObject(AnimationState_1.AnimationState);
        this._lastAnimationState._init(this._armature, animationData, animationConfig);
        this._animationStates.push(this._lastAnimationState);
        this._animationStateDirty = true;
        this._cacheFrameIndex = -1;
        if (this._animationStates.length > 1) {
            this._animationStates.sort(Animation._sortAnimationState);
        }
        // Child armature play same name animation.
        var slots = this._armature.getSlots();
        for (var i = 0, l = slots.length; i < l; ++i) {
            var childArmature = slots[i].childArmature;
            if (childArmature && childArmature.inheritAnimation &&
                childArmature.animation.hasAnimation(animationName) &&
                !childArmature.animation.getState(animationName)) {
                childArmature.animation.fadeIn(animationName); //
            }
        }
        if (animationConfig.fadeInTime <= 0.0) {
            this._armature.advanceTime(0.0);
        }
        if (isStop) {
            this._lastAnimationState.stop();
        }
        return this._lastAnimationState;
    };
    /**
     * @language zh_CN
     * 淡入播放动画。
     * @param animationName 动画数据名称。
     * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @param fadeInTime 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
     * @param layer 混合图层，图层高会优先获取混合权重。
     * @param group 混合组，用于动画状态编组，方便控制淡出。
     * @param fadeOutMode 淡出模式。
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationFadeOutMode
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.fadeIn = function (animationName, fadeInTime, playTimes, layer, group, fadeOutMode) {
        if (fadeInTime === void 0) { fadeInTime = -1.0; }
        if (playTimes === void 0) { playTimes = -1; }
        if (layer === void 0) { layer = 0; }
        if (group === void 0) { group = null; }
        if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
        this._animationConfig.clear();
        this._animationConfig.fadeOutMode = fadeOutMode;
        this._animationConfig.playTimes = playTimes;
        this._animationConfig.layer = layer;
        this._animationConfig.fadeInTime = fadeInTime;
        this._animationConfig.animation = animationName;
        this._animationConfig.group = group;
        return this.playConfig(this._animationConfig);
    };
    /**
     * @language zh_CN
     * 播放动画。
     * @param animationName 动画数据名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
     * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    Animation.prototype.play = function (animationName, playTimes) {
        if (animationName === void 0) { animationName = null; }
        if (playTimes === void 0) { playTimes = -1; }
        this._animationConfig.clear();
        this._animationConfig.playTimes = playTimes;
        this._animationConfig.fadeInTime = 0.0;
        this._animationConfig.animation = animationName;
        if (animationName) {
            this.playConfig(this._animationConfig);
        }
        else if (!this._lastAnimationState) {
            var defaultAnimation = this._armature.armatureData.defaultAnimation;
            if (defaultAnimation) {
                this._animationConfig.animation = defaultAnimation.name;
                this.playConfig(this._animationConfig);
            }
        }
        else if (!this._isPlaying || (!this._lastAnimationState.isPlaying && !this._lastAnimationState.isCompleted)) {
            this._isPlaying = true;
            this._lastAnimationState.play();
        }
        else {
            this._animationConfig.animation = this._lastAnimationState.name;
            this.playConfig(this._animationConfig);
        }
        return this._lastAnimationState;
    };
    /**
     * @language zh_CN
     * 从指定时间开始播放动画。
     * @param animationName 动画数据的名称。
     * @param time 开始时间。 (以秒为单位)
     * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.gotoAndPlayByTime = function (animationName, time, playTimes) {
        if (time === void 0) { time = 0.0; }
        if (playTimes === void 0) { playTimes = -1; }
        this._animationConfig.clear();
        this._animationConfig.playTimes = playTimes;
        this._animationConfig.position = time;
        this._animationConfig.fadeInTime = 0.0;
        this._animationConfig.animation = animationName;
        return this.playConfig(this._animationConfig);
    };
    /**
     * @language zh_CN
     * 从指定帧开始播放动画。
     * @param animationName 动画数据的名称。
     * @param frame 帧。
     * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.gotoAndPlayByFrame = function (animationName, frame, playTimes) {
        if (frame === void 0) { frame = 0; }
        if (playTimes === void 0) { playTimes = -1; }
        this._animationConfig.clear();
        this._animationConfig.playTimes = playTimes;
        this._animationConfig.fadeInTime = 0.0;
        this._animationConfig.animation = animationName;
        var animationData = this._animations[animationName];
        if (animationData) {
            this._animationConfig.position = animationData.duration * frame / animationData.frameCount;
        }
        return this.playConfig(this._animationConfig);
    };
    /**
     * @language zh_CN
     * 从指定进度开始播放动画。
     * @param animationName 动画数据的名称。
     * @param progress 进度。 [0~1]
     * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.gotoAndPlayByProgress = function (animationName, progress, playTimes) {
        if (progress === void 0) { progress = 0.0; }
        if (playTimes === void 0) { playTimes = -1; }
        this._animationConfig.clear();
        this._animationConfig.playTimes = playTimes;
        this._animationConfig.fadeInTime = 0.0;
        this._animationConfig.animation = animationName;
        var animationData = this._animations[animationName];
        if (animationData) {
            this._animationConfig.position = animationData.duration * (progress > 0.0 ? progress : 0.0);
        }
        return this.playConfig(this._animationConfig);
    };
    /**
     * @language zh_CN
     * 将动画停止到指定的时间。
     * @param animationName 动画数据的名称。
     * @param time 时间。 (以秒为单位)
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.gotoAndStopByTime = function (animationName, time) {
        if (time === void 0) { time = 0.0; }
        var animationState = this.gotoAndPlayByTime(animationName, time, 1);
        if (animationState) {
            animationState.stop();
        }
        return animationState;
    };
    /**
     * @language zh_CN
     * 将动画停止到指定的帧。
     * @param animationName 动画数据的名称。
     * @param frame 帧。
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.gotoAndStopByFrame = function (animationName, frame) {
        if (frame === void 0) { frame = 0; }
        var animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
        if (animationState) {
            animationState.stop();
        }
        return animationState;
    };
    /**
     * @language zh_CN
     * 将动画停止到指定的进度。
     * @param animationName 动画数据的名称。
     * @param progress 进度。 [0 ~ 1]
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    Animation.prototype.gotoAndStopByProgress = function (animationName, progress) {
        if (progress === void 0) { progress = 0.0; }
        var animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
        if (animationState) {
            animationState.stop();
        }
        return animationState;
    };
    /**
     * @language zh_CN
     * 获取动画状态。
     * @param animationName 动画状态的名称。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    Animation.prototype.getState = function (animationName) {
        for (var i = 0, l = this._animationStates.length; i < l; ++i) {
            var animationState = this._animationStates[i];
            if (animationState.name === animationName) {
                return animationState;
            }
        }
        return null;
    };
    /**
     * @language zh_CN
     * 是否包含动画数据。
     * @param animationName 动画数据的名称。
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    Animation.prototype.hasAnimation = function (animationName) {
        return this._animations[animationName] != null;
    };
    Object.defineProperty(Animation.prototype, "isPlaying", {
        /**
         * @language zh_CN
         * 动画是否处于播放状态。
         * @version DragonBones 3.0
         */
        get: function () {
            if (this._animationStates.length > 1) {
                return this._isPlaying && !this.isCompleted;
            }
            else if (this._lastAnimationState) {
                return this._isPlaying && this._lastAnimationState.isPlaying;
            }
            return this._isPlaying;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "isCompleted", {
        /**
         * @language zh_CN
         * 所有动画状态是否均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        get: function () {
            if (this._lastAnimationState) {
                if (!this._lastAnimationState.isCompleted) {
                    return false;
                }
                for (var i = 0, l = this._animationStates.length; i < l; ++i) {
                    if (!this._animationStates[i].isCompleted) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "lastAnimationName", {
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态名称。
         * @see #lastAnimationState
         * @version DragonBones 3.0
         */
        get: function () {
            return this._lastAnimationState ? this._lastAnimationState.name : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "lastAnimationState", {
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        get: function () {
            return this._lastAnimationState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "animationConfig", {
        /**
         * @language zh_CN
         * 一个可以快速使用的动画配置实例。
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         */
        get: function () {
            this._animationConfig.clear();
            return this._animationConfig;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "animationNames", {
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #animations
         * @version DragonBones 4.5
         */
        get: function () {
            return this._animationNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "animations", {
        /**
         * @language zh_CN
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        get: function () {
            return this._animations;
        },
        set: function (value) {
            if (this._animations === value) {
                return;
            }
            this._animationNames.length = 0;
            for (var k in this._animations) {
                delete this._animations[k];
            }
            if (value) {
                for (var k in value) {
                    this._animations[k] = value[k];
                    this._animationNames.push(k);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @deprecated
     * @see #play()
     * @see #fadeIn()
     * @see #gotoAndPlayByTime()
     * @see #gotoAndPlayByFrame()
     * @see #gotoAndPlayByProgress()
     */
    Animation.prototype.gotoAndPlay = function (animationName, fadeInTime, duration, playTimes, layer, group, fadeOutMode, pauseFadeOut, pauseFadeIn) {
        if (fadeInTime === void 0) { fadeInTime = -1; }
        if (duration === void 0) { duration = -1; }
        if (playTimes === void 0) { playTimes = -1; }
        if (layer === void 0) { layer = 0; }
        if (group === void 0) { group = null; }
        if (fadeOutMode === void 0) { fadeOutMode = 3 /* SameLayerAndGroup */; }
        if (pauseFadeOut === void 0) { pauseFadeOut = true; }
        if (pauseFadeIn === void 0) { pauseFadeIn = true; }
        this._animationConfig.clear();
        this._animationConfig.fadeOutMode = fadeOutMode;
        this._animationConfig.playTimes = playTimes;
        this._animationConfig.layer = layer;
        this._animationConfig.fadeInTime = fadeInTime;
        this._animationConfig.animation = animationName;
        this._animationConfig.group = group;
        var animationData = this._animations[animationName];
        if (animationData && duration > 0.0) {
            this._animationConfig.timeScale = animationData.duration / duration;
        }
        return this.playConfig(this._animationConfig);
    };
    /**
     * @deprecated
     * @see #gotoAndStopByTime()
     * @see #gotoAndStopByFrame()
     * @see #gotoAndStopByProgress()
     */
    Animation.prototype.gotoAndStop = function (animationName, time) {
        if (time === void 0) { time = 0; }
        return this.gotoAndStopByTime(animationName, time);
    };
    Object.defineProperty(Animation.prototype, "animationList", {
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        get: function () {
            return this._animationNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "animationDataList", {
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        get: function () {
            var list = [];
            for (var i = 0, l = this._animationNames.length; i < l; ++i) {
                list.push(this._animations[this._animationNames[i]]);
            }
            return list;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.None
     */
    Animation.None = 0 /* None */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameLayer
     */
    Animation.SameLayer = 1 /* SameLayer */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameGroup
     */
    Animation.SameGroup = 2 /* SameGroup */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameLayerAndGroup
     */
    Animation.SameLayerAndGroup = 3 /* SameLayerAndGroup */;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.All
     */
    Animation.All = 4 /* All */;
    return Animation;
}(BaseObject_1.BaseObject));
exports.Animation = Animation;
