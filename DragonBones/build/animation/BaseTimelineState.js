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
var DragonBones_1 = require("../core/DragonBones");
/**
 * @internal
 * @private
 */
var TimelineState = /** @class */ (function (_super) {
    __extends(TimelineState, _super);
    function TimelineState() {
        return _super.call(this) || this;
    }
    TimelineState.prototype._onClear = function () {
        this._playState = -1;
        this._currentPlayTimes = 0;
        this._currentTime = -1.0;
        this._timelineData = null;
        this._frameRate = 0;
        this._frameCount = 0;
        this._position = 0.0;
        this._duration = 0.0;
        this._animationDutation = 0.0;
        this._timeScale = 1.0;
        this._timeOffset = 0.0;
        this._currentFrame = null;
        this._armature = null;
        this._animationState = null;
        this._mainTimeline = null;
    };
    TimelineState.prototype._onUpdateFrame = function () { };
    TimelineState.prototype._onArriveAtFrame = function () { };
    TimelineState.prototype._setCurrentTime = function (passedTime) {
        var prevState = this._playState;
        var currentPlayTimes = 0;
        var currentTime = 0.0;
        if (this._mainTimeline && this._frameCount === 1) {
            this._playState = this._mainTimeline._playState >= 0 ? 1 : -1;
            currentPlayTimes = 1;
            currentTime = this._mainTimeline._currentTime;
        }
        else if (!this._mainTimeline || this._timeScale !== 1.0 || this._timeOffset !== 0.0) {
            var playTimes = this._animationState.playTimes;
            var totalTime = playTimes * this._duration;
            passedTime *= this._timeScale;
            if (this._timeOffset !== 0.0) {
                passedTime += this._timeOffset * this._animationDutation;
            }
            if (playTimes > 0 && (passedTime >= totalTime || passedTime <= -totalTime)) {
                if (this._playState <= 0 && this._animationState._playheadState === 3) {
                    this._playState = 1;
                }
                currentPlayTimes = playTimes;
                if (passedTime < 0.0) {
                    currentTime = 0.0;
                }
                else {
                    currentTime = this._duration;
                }
            }
            else {
                if (this._playState !== 0 && this._animationState._playheadState === 3) {
                    this._playState = 0;
                }
                if (passedTime < 0.0) {
                    passedTime = -passedTime;
                    currentPlayTimes = Math.floor(passedTime / this._duration);
                    currentTime = this._duration - (passedTime % this._duration);
                }
                else {
                    currentPlayTimes = Math.floor(passedTime / this._duration);
                    currentTime = passedTime % this._duration;
                }
            }
            currentTime += this._position;
        }
        else {
            this._playState = this._mainTimeline._playState;
            currentPlayTimes = this._mainTimeline._currentPlayTimes;
            currentTime = this._mainTimeline._currentTime;
        }
        if (this._currentPlayTimes === currentPlayTimes && this._currentTime === currentTime) {
            return false;
        }
        // Clear frame flag when timeline start or loopComplete.
        if ((prevState < 0 && this._playState !== prevState) ||
            (this._playState <= 0 && this._currentPlayTimes !== currentPlayTimes)) {
            this._currentFrame = null;
        }
        this._currentPlayTimes = currentPlayTimes;
        this._currentTime = currentTime;
        return true;
    };
    TimelineState.prototype._init = function (armature, animationState, timelineData) {
        this._armature = armature;
        this._animationState = animationState;
        this._timelineData = timelineData;
        this._mainTimeline = this._animationState._timeline;
        if (this === this._mainTimeline) {
            this._mainTimeline = null;
        }
        this._frameRate = this._armature.armatureData.frameRate;
        this._frameCount = this._timelineData.frames.length;
        this._position = this._animationState._position;
        this._duration = this._animationState._duration;
        this._animationDutation = this._animationState.animationData.duration;
        this._timeScale = !this._mainTimeline ? 1.0 : (1.0 / this._timelineData.scale);
        this._timeOffset = !this._mainTimeline ? 0.0 : this._timelineData.offset;
    };
    TimelineState.prototype.fadeOut = function () { };
    TimelineState.prototype.update = function (passedTime) {
        if (this._playState <= 0 && this._setCurrentTime(passedTime)) {
            var currentFrameIndex = this._frameCount > 1 ? Math.floor(this._currentTime * this._frameRate) : 0; // uint
            var currentFrame = this._timelineData.frames[currentFrameIndex];
            if (this._currentFrame !== currentFrame) {
                this._currentFrame = currentFrame;
                this._onArriveAtFrame();
            }
            this._onUpdateFrame();
        }
    };
    return TimelineState;
}(BaseObject_1.BaseObject));
exports.TimelineState = TimelineState;
/**
 * @internal
 * @private
 */
var TweenTimelineState = /** @class */ (function (_super) {
    __extends(TweenTimelineState, _super);
    function TweenTimelineState() {
        return _super.call(this) || this;
    }
    TweenTimelineState._getEasingValue = function (progress, easing) {
        if (progress <= 0.0) {
            return 0.0;
        }
        else if (progress >= 1.0) {
            return 1.0;
        }
        var value = 1.0;
        if (easing > 2.0) {
            return progress;
        }
        else if (easing > 1.0) {
            value = 0.5 * (1.0 - Math.cos(progress * Math.PI));
            easing -= 1.0;
        }
        else if (easing > 0.0) {
            value = 1.0 - Math.pow(1.0 - progress, 2.0);
        }
        else if (easing >= -1.0) {
            easing *= -1.0;
            value = Math.pow(progress, 2.0);
        }
        else if (easing >= -2.0) {
            easing *= -1.0;
            value = Math.acos(1.0 - progress * 2.0) / Math.PI;
            easing -= 1.0;
        }
        else {
            return progress;
        }
        return (value - progress) * easing + progress;
    };
    TweenTimelineState._getEasingCurveValue = function (progress, samples) {
        if (progress <= 0.0) {
            return 0.0;
        }
        else if (progress >= 1.0) {
            return 1.0;
        }
        var segmentCount = samples.length + 1; // + 2 - 1
        var valueIndex = Math.floor(progress * segmentCount);
        var fromValue = valueIndex === 0 ? 0.0 : samples[valueIndex - 1];
        var toValue = (valueIndex === segmentCount - 1) ? 1.0 : samples[valueIndex];
        return fromValue + (toValue - fromValue) * (progress * segmentCount - valueIndex);
    };
    TweenTimelineState.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this._tweenProgress = 0.0;
        this._tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
        this._curve = null;
    };
    TweenTimelineState.prototype._onArriveAtFrame = function () {
        if (this._frameCount > 1 &&
            (this._currentFrame.next !== this._timelineData.frames[0] ||
                this._animationState.playTimes === 0 ||
                this._animationState.currentPlayTimes < this._animationState.playTimes - 1)) {
            this._tweenEasing = this._currentFrame.tweenEasing;
            this._curve = this._currentFrame.curve;
        }
        else {
            this._tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
            this._curve = null;
        }
    };
    TweenTimelineState.prototype._onUpdateFrame = function () {
        if (this._tweenEasing !== DragonBones_1.DragonBones.NO_TWEEN) {
            this._tweenProgress = (this._currentTime - this._currentFrame.position) / this._currentFrame.duration;
            if (this._tweenEasing !== 0.0) {
                this._tweenProgress = TweenTimelineState._getEasingValue(this._tweenProgress, this._tweenEasing);
            }
        }
        else if (this._curve) {
            this._tweenProgress = (this._currentTime - this._currentFrame.position) / this._currentFrame.duration;
            this._tweenProgress = TweenTimelineState._getEasingCurveValue(this._tweenProgress, this._curve);
        }
        else {
            this._tweenProgress = 0.0;
        }
    };
    return TweenTimelineState;
}(TimelineState));
exports.TweenTimelineState = TweenTimelineState;
