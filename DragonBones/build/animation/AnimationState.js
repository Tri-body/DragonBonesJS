"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseObject_1 = require("../core/BaseObject");
var TimelineState_1 = require("./TimelineState");
var EventObject_1 = require("../event/EventObject");
/**
 * @language zh_CN
 * 动画状态，播放动画时产生，可以对每个播放的动画进行更细致的控制和调节。
 * @see dragonBones.Animation
 * @see dragonBones.AnimationData
 * @version DragonBones 3.0
 */
var AnimationState = /** @class */ (function (_super) {
    tslib_1.__extends(AnimationState, _super);
    /**
     * @internal
     * @private
     */
    function AnimationState() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this._boneMask = [];
        /**
         * @private
         */
        _this._animationNames = [];
        /**
         * @private
         */
        _this._boneTimelines = [];
        /**
         * @private
         */
        _this._slotTimelines = [];
        /**
         * @private
         */
        _this._ffdTimelines = [];
        /**
         * @deprecated
         */
        _this.autoTween = false;
        return _this;
    }
    /**
     * @private
     */
    AnimationState.toString = function () {
        return "[class dragonBones.AnimationState]";
    };
    /**
     * @private
     */
    AnimationState.prototype._onClear = function () {
        for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
            this._boneTimelines[i].returnToPool();
        }
        for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
            this._slotTimelines[i].returnToPool();
        }
        for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
            this._ffdTimelines[i].returnToPool();
        }
        if (this._timeline) {
            this._timeline.returnToPool();
        }
        if (this._zOrderTimeline) {
            this._zOrderTimeline.returnToPool();
        }
        this.displayControl = true;
        this.additiveBlending = false;
        this.actionEnabled = false;
        this.playTimes = 1;
        this.timeScale = 1.0;
        this.weight = 1.0;
        this.autoFadeOutTime = -1.0;
        this.fadeTotalTime = 0.0;
        this._playheadState = 0;
        this._fadeState = -1;
        this._subFadeState = -1;
        this._layer = 0;
        this._position = 0.0;
        this._duration = 0.0;
        this._fadeTime = 0.0;
        this._time = 0.0;
        this._fadeProgress = 0.0;
        this._weightResult = 0.0;
        this._name = null;
        this._group = null;
        this._boneMask.length = 0;
        this._animationNames.length = 0;
        this._boneTimelines.length = 0;
        this._slotTimelines.length = 0;
        this._ffdTimelines.length = 0;
        this._animationData = null;
        this._armature = null;
        this._timeline = null;
        this._zOrderTimeline = null;
    };
    AnimationState.prototype._advanceFadeTime = function (passedTime) {
        var isFadeOut = this._fadeState > 0;
        if (this._subFadeState < 0) { // Fade start event.
            this._subFadeState = 0;
            var eventType = isFadeOut ? EventObject_1.EventObject.FADE_OUT : EventObject_1.EventObject.FADE_IN;
            if (this._armature.eventDispatcher.hasEvent(eventType)) {
                var eventObject = BaseObject_1.BaseObject.borrowObject(EventObject_1.EventObject);
                eventObject.animationState = this;
                this._armature._bufferEvent(eventObject, eventType);
            }
        }
        if (passedTime < 0.0) {
            passedTime = -passedTime;
        }
        this._fadeTime += passedTime;
        if (this._fadeTime >= this.fadeTotalTime) { // Fade complete.
            this._subFadeState = 1;
            this._fadeProgress = isFadeOut ? 0.0 : 1.0;
        }
        else if (this._fadeTime > 0.0) { // Fading.
            this._fadeProgress = isFadeOut ? (1.0 - this._fadeTime / this.fadeTotalTime) : (this._fadeTime / this.fadeTotalTime);
        }
        else { // Before fade.
            this._fadeProgress = isFadeOut ? 1.0 : 0.0;
        }
        if (this._subFadeState > 0) { // Fade complete event.
            if (!isFadeOut) {
                this._playheadState |= 1; // x1
                this._fadeState = 0;
            }
            var eventType = isFadeOut ? EventObject_1.EventObject.FADE_OUT_COMPLETE : EventObject_1.EventObject.FADE_IN_COMPLETE;
            if (this._armature.eventDispatcher.hasEvent(eventType)) {
                var eventObject = BaseObject_1.BaseObject.borrowObject(EventObject_1.EventObject);
                eventObject.animationState = this;
                this._armature._bufferEvent(eventObject, eventType);
            }
        }
    };
    /**
     * @internal
     * @private
     */
    AnimationState.prototype._init = function (armature, animationData, animationConfig) {
        this._armature = armature;
        this._animationData = animationData;
        this._name = animationConfig.name ? animationConfig.name : animationConfig.animation;
        this.actionEnabled = animationConfig.actionEnabled;
        this.additiveBlending = animationConfig.additiveBlending;
        this.displayControl = animationConfig.displayControl;
        this.playTimes = animationConfig.playTimes;
        this.timeScale = animationConfig.timeScale;
        this.fadeTotalTime = animationConfig.fadeInTime;
        this.autoFadeOutTime = animationConfig.autoFadeOutTime;
        this.weight = animationConfig.weight;
        if (animationConfig.pauseFadeIn) {
            this._playheadState = 2; // 10
        }
        else {
            this._playheadState = 3; // 11
        }
        this._fadeState = -1;
        this._subFadeState = -1;
        this._layer = animationConfig.layer;
        this._group = animationConfig.group;
        if (animationConfig.duration < 0.0) {
            this._position = 0.0;
            this._duration = this._animationData.duration;
            if (animationConfig.position !== 0.0) {
                if (this.timeScale >= 0.0) {
                    this._time = animationConfig.position;
                }
                else {
                    this._time = animationConfig.position - this._duration;
                }
            }
            else {
                this._time = 0.0;
            }
        }
        else {
            this._position = animationConfig.position;
            this._duration = animationConfig.duration;
            this._time = 0.0;
        }
        if (this.timeScale < 0.0 && this._time === 0.0) {
            this._time = -0.000001; // Can not cross last frame event.
        }
        if (this.fadeTotalTime <= 0.0) {
            this._fadeProgress = 0.999999;
        }
        if (animationConfig.boneMask.length > 0) {
            this._boneMask.length = animationConfig.boneMask.length;
            for (var i = 0, l = this._boneMask.length; i < l; ++i) {
                this._boneMask[i] = animationConfig.boneMask[i];
            }
        }
        if (animationConfig.animationNames.length > 0) {
            this._animationNames.length = animationConfig.animationNames.length;
            for (var i = 0, l = this._animationNames.length; i < l; ++i) {
                this._animationNames[i] = animationConfig.animationNames[i];
            }
        }
        this._timeline = BaseObject_1.BaseObject.borrowObject(TimelineState_1.AnimationTimelineState);
        this._timeline._init(this._armature, this, this._animationData);
        if (this._animationData.zOrderTimeline) {
            this._zOrderTimeline = BaseObject_1.BaseObject.borrowObject(TimelineState_1.ZOrderTimelineState);
            this._zOrderTimeline._init(this._armature, this, this._animationData.zOrderTimeline);
        }
        this._updateTimelineStates();
    };
    /**
     * @internal
     * @private
     */
    AnimationState.prototype._updateTimelineStates = function () {
        var boneTimelineStates = {};
        var slotTimelineStates = {};
        var ffdTimelineStates = {};
        for (var i = 0, l = this._boneTimelines.length; i < l; ++i) { // Creat bone timelines map.
            var boneTimelineState = this._boneTimelines[i];
            boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
        }
        var bones = this._armature.getBones();
        for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            var boneTimelineName = bone.name;
            if (this.containsBoneMask(boneTimelineName)) {
                var boneTimelineData = this._animationData.getBoneTimeline(boneTimelineName);
                if (boneTimelineData) {
                    if (boneTimelineStates[boneTimelineName]) { // Remove bone timeline from map.
                        delete boneTimelineStates[boneTimelineName];
                    }
                    else { // Create new bone timeline.
                        var boneTimelineState = BaseObject_1.BaseObject.borrowObject(TimelineState_1.BoneTimelineState);
                        boneTimelineState.bone = bone;
                        boneTimelineState._init(this._armature, this, boneTimelineData);
                        this._boneTimelines.push(boneTimelineState);
                    }
                }
            }
        }
        for (var k in boneTimelineStates) { // Remove bone timelines.
            var boneTimelineState = boneTimelineStates[k];
            boneTimelineState.bone.invalidUpdate(); //
            this._boneTimelines.splice(this._boneTimelines.indexOf(boneTimelineState), 1);
            boneTimelineState.returnToPool();
        }
        for (var i = 0, l = this._slotTimelines.length; i < l; ++i) { // Create slot timelines map.
            var slotTimelineState = this._slotTimelines[i];
            slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
        }
        for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) { // Create ffd timelines map.
            var ffdTimelineState = this._ffdTimelines[i];
            var display = ffdTimelineState._timelineData.display;
            var meshName = display.inheritAnimation ? display.mesh.name : display.name;
            ffdTimelineStates[meshName] = ffdTimelineState;
        }
        var slots = this._armature.getSlots();
        for (var i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            var slotTimelineName = slot.name;
            var parentTimelineName = slot.parent.name;
            var resetFFDVertices = false;
            if (this.containsBoneMask(parentTimelineName)) {
                var slotTimelineData = this._animationData.getSlotTimeline(slotTimelineName);
                if (slotTimelineData) {
                    if (slotTimelineStates[slotTimelineName]) { // Remove slot timeline from map.
                        delete slotTimelineStates[slotTimelineName];
                    }
                    else { // Create new slot timeline.
                        var slotTimelineState = BaseObject_1.BaseObject.borrowObject(TimelineState_1.SlotTimelineState);
                        slotTimelineState.slot = slot;
                        slotTimelineState._init(this._armature, this, slotTimelineData);
                        this._slotTimelines.push(slotTimelineState);
                    }
                }
                var ffdTimelineDatas = this._animationData.getFFDTimeline(this._armature._skinData.name, slotTimelineName);
                if (ffdTimelineDatas) {
                    for (var k in ffdTimelineDatas) {
                        if (ffdTimelineStates[k]) { // Remove ffd timeline from map.
                            delete ffdTimelineStates[k];
                        }
                        else { // Create new ffd timeline.
                            var ffdTimelineState = BaseObject_1.BaseObject.borrowObject(TimelineState_1.FFDTimelineState);
                            ffdTimelineState.slot = slot;
                            ffdTimelineState._init(this._armature, this, ffdTimelineDatas[k]);
                            this._ffdTimelines.push(ffdTimelineState);
                        }
                    }
                }
                else {
                    resetFFDVertices = true;
                }
            }
            else {
                resetFFDVertices = true;
            }
            if (resetFFDVertices) {
                for (var iA = 0, lA = slot._ffdVertices.length; iA < lA; ++iA) {
                    slot._ffdVertices[iA] = 0.0;
                }
                slot._meshDirty = true;
            }
        }
        for (var k in slotTimelineStates) { // Remove slot timelines.
            var slotTimelineState = slotTimelineStates[k];
            this._slotTimelines.splice(this._slotTimelines.indexOf(slotTimelineState), 1);
            slotTimelineState.returnToPool();
        }
        for (var k in ffdTimelineStates) { // Remove ffd timelines.
            var ffdTimelineState = ffdTimelineStates[k];
            this._ffdTimelines.splice(this._ffdTimelines.indexOf(ffdTimelineState), 1);
            ffdTimelineState.returnToPool();
        }
    };
    /**
     * @internal
     * @private
     */
    AnimationState.prototype._advanceTime = function (passedTime, cacheFrameRate) {
        // Update fade time.
        if (this._fadeState !== 0 || this._subFadeState !== 0) {
            this._advanceFadeTime(passedTime);
        }
        // Update time.
        if (this.timeScale !== 1.0) {
            passedTime *= this.timeScale;
        }
        if (passedTime !== 0.0 && this._playheadState === 3) { // 11
            this._time += passedTime;
        }
        // Weight.
        if (this.weight !== 0.0) {
            var isCacheEnabled = this._fadeState === 0 && cacheFrameRate > 0.0;
            var isUpdatesTimeline = true;
            var isUpdatesBoneTimeline = true;
            var time = this._time;
            this._weightResult = this.weight * this._fadeProgress;
            // Update main timeline.
            this._timeline.update(time);
            // Cache time internval.
            if (isCacheEnabled) {
                var internval = cacheFrameRate * 2.0;
                this._timeline._currentTime = Math.floor(this._timeline._currentTime * internval) / internval;
            }
            // Update zOrder timeline.
            if (this._zOrderTimeline) {
                this._zOrderTimeline.update(time);
            }
            // Update cache.
            if (isCacheEnabled) {
                var cacheFrameIndex = Math.floor(this._timeline._currentTime * cacheFrameRate); // uint
                if (this._armature.animation._cacheFrameIndex === cacheFrameIndex) { // Same cache.
                    isUpdatesTimeline = false;
                    isUpdatesBoneTimeline = false;
                }
                else {
                    this._armature.animation._cacheFrameIndex = cacheFrameIndex;
                    if (this._animationData.cachedFrames[cacheFrameIndex]) { // Cached.
                        isUpdatesBoneTimeline = false;
                    }
                    else { // Cache.
                        this._animationData.cachedFrames[cacheFrameIndex] = true;
                    }
                }
            }
            // Update timelines.
            if (isUpdatesTimeline) {
                if (isUpdatesBoneTimeline) {
                    for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                        this._boneTimelines[i].update(time);
                    }
                }
                for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                    this._slotTimelines[i].update(time);
                }
                for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                    this._ffdTimelines[i].update(time);
                }
            }
        }
        if (this._fadeState === 0) {
            if (this._subFadeState > 0) {
                this._subFadeState = 0;
            }
            if (this._timeline._playState > 0) {
                // Auto fade out.
                if (this.autoFadeOutTime >= 0.0) {
                    this.fadeOut(this.autoFadeOutTime);
                }
                if (this._animationNames.length > 0) {
                    // TODO
                }
            }
        }
    };
    /**
     * @internal
     * @private
     */
    AnimationState.prototype._isDisabled = function (slot) {
        if (this.displayControl &&
            (!slot.displayController ||
                slot.displayController === this._name ||
                slot.displayController === this._group)) {
            return false;
        }
        return true;
    };
    /**
     * @language zh_CN
     * 继续播放。
     * @version DragonBones 3.0
     */
    AnimationState.prototype.play = function () {
        this._playheadState = 3; // 11
    };
    /**
     * @language zh_CN
     * 暂停播放。
     * @version DragonBones 3.0
     */
    AnimationState.prototype.stop = function () {
        this._playheadState &= 1; // 0x
    };
    /**
     * @language zh_CN
     * 淡出动画。
     * @param fadeOutTime 淡出时间。 (以秒为单位)
     * @param pausePlayhead 淡出时是否暂停动画。
     * @version DragonBones 3.0
     */
    AnimationState.prototype.fadeOut = function (fadeOutTime, pausePlayhead) {
        if (pausePlayhead === void 0) { pausePlayhead = true; }
        if (fadeOutTime < 0.0 || fadeOutTime !== fadeOutTime) {
            fadeOutTime = 0.0;
        }
        if (pausePlayhead) {
            this._playheadState &= 2; // x0
        }
        if (this._fadeState > 0) {
            if (fadeOutTime > this.fadeTotalTime - this._fadeTime) {
                // If the animation is already in fade out, the new fade out will be ignored.
                return;
            }
        }
        else {
            this._fadeState = 1;
            this._subFadeState = -1;
            if (fadeOutTime <= 0.0 || this._fadeProgress <= 0.0) {
                this._fadeProgress = 0.000001; // Modify _fadeProgress to different value.
            }
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i].fadeOut();
            }
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i].fadeOut();
            }
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i].fadeOut();
            }
        }
        this.displayControl = false; //
        this.fadeTotalTime = this._fadeProgress > 0.000001 ? fadeOutTime / this._fadeProgress : 0.0;
        this._fadeTime = this.fadeTotalTime * (1.0 - this._fadeProgress);
    };
    /**
     * @language zh_CN
     * 是否包含骨骼遮罩。
     * @param name 指定的骨骼名称。
     * @version DragonBones 3.0
     */
    AnimationState.prototype.containsBoneMask = function (name) {
        return this._boneMask.length === 0 || this._boneMask.indexOf(name) >= 0;
    };
    /**
     * @language zh_CN
     * 添加骨骼遮罩。
     * @param boneName 指定的骨骼名称。
     * @param recursive 是否为该骨骼的子骨骼添加遮罩。
     * @version DragonBones 3.0
     */
    AnimationState.prototype.addBoneMask = function (name, recursive) {
        if (recursive === void 0) { recursive = true; }
        var currentBone = this._armature.getBone(name);
        if (!currentBone) {
            return;
        }
        if (this._boneMask.indexOf(name) < 0) { // Add mixing
            this._boneMask.push(name);
        }
        if (recursive) { // Add recursive mixing.
            var bones = this._armature.getBones();
            for (var i = 0, l = bones.length; i < l; ++i) {
                var bone = bones[i];
                if (this._boneMask.indexOf(bone.name) < 0 && currentBone.contains(bone)) {
                    this._boneMask.push(bone.name);
                }
            }
        }
        this._updateTimelineStates();
    };
    /**
     * @language zh_CN
     * 删除骨骼遮罩。
     * @param boneName 指定的骨骼名称。
     * @param recursive 是否删除该骨骼的子骨骼遮罩。
     * @version DragonBones 3.0
     */
    AnimationState.prototype.removeBoneMask = function (name, recursive) {
        if (recursive === void 0) { recursive = true; }
        var index = this._boneMask.indexOf(name);
        if (index >= 0) { // Remove mixing.
            this._boneMask.splice(index, 1);
        }
        if (recursive) {
            var currentBone = this._armature.getBone(name);
            if (currentBone) {
                var bones = this._armature.getBones();
                if (this._boneMask.length > 0) {
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        var index_1 = this._boneMask.indexOf(bone.name);
                        if (index_1 >= 0 && currentBone.contains(bone)) { // Remove recursive mixing.
                            this._boneMask.splice(index_1, 1);
                        }
                    }
                }
                else {
                    for (var i = 0, l = bones.length; i < l; ++i) {
                        var bone = bones[i];
                        if (!currentBone.contains(bone)) { // Add unrecursive mixing.
                            this._boneMask.push(bone.name);
                        }
                    }
                }
            }
        }
        this._updateTimelineStates();
    };
    /**
     * @language zh_CN
     * 删除所有骨骼遮罩。
     * @version DragonBones 3.0
     */
    AnimationState.prototype.removeAllBoneMask = function () {
        this._boneMask.length = 0;
        this._updateTimelineStates();
    };
    Object.defineProperty(AnimationState.prototype, "layer", {
        /**
         * @language zh_CN
         * 混合图层。
         * @version DragonBones 3.0
         */
        get: function () {
            return this._layer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "group", {
        /**
         * @language zh_CN
         * 混合组。
         * @version DragonBones 3.0
         */
        get: function () {
            return this._group;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "name", {
        /**
         * @language zh_CN
         * 动画名称。
         * @version DragonBones 3.0
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "animationData", {
        /**
         * @language zh_CN
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        get: function () {
            return this._animationData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "isCompleted", {
        /**
         * @language zh_CN
         * 是否播放完毕。
         * @version DragonBones 3.0
         */
        get: function () {
            return this._timeline._playState > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "isPlaying", {
        /**
         * @language zh_CN
         * 是否正在播放。
         * @version DragonBones 3.0
         */
        get: function () {
            return (this._playheadState & 2) && this._timeline._playState <= 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "currentPlayTimes", {
        /**
         * @language zh_CN
         * 当前播放次数。
         * @version DragonBones 3.0
         */
        get: function () {
            return this._timeline._currentPlayTimes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "totalTime", {
        /**
         * @language zh_CN
         * 动画的总时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        get: function () {
            return this._duration;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "currentTime", {
        /**
         * @language zh_CN
         * 动画播放的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        get: function () {
            return this._timeline._currentTime;
        },
        set: function (value) {
            if (value !== value) {
                value = 0.0;
            }
            var currentPlayTimes = this._timeline._currentPlayTimes - (this._timeline._playState > 0 ? 1 : 0);
            value = (value % this._duration) + currentPlayTimes * this._duration;
            if (value < 0 || this._duration < value) {
                value = (value % this._duration) + currentPlayTimes * this._duration;
                if (value < 0) {
                    value += this._duration;
                }
            }
            if (this._time === value) {
                return;
            }
            this._time = value;
            this._timeline.setCurrentTime(this._time);
            if (this._zOrderTimeline) {
                this._zOrderTimeline._playState = -1;
            }
            for (var i = 0, l = this._boneTimelines.length; i < l; ++i) {
                this._boneTimelines[i]._playState = -1;
            }
            for (var i = 0, l = this._slotTimelines.length; i < l; ++i) {
                this._slotTimelines[i]._playState = -1;
            }
            for (var i = 0, l = this._ffdTimelines.length; i < l; ++i) {
                this._ffdTimelines[i]._playState = -1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnimationState.prototype, "clip", {
        /**
         * @deprecated
         * @see #animationData
         */
        get: function () {
            return this._animationData;
        },
        enumerable: true,
        configurable: true
    });
    return AnimationState;
}(BaseObject_1.BaseObject));
exports.AnimationState = AnimationState;
