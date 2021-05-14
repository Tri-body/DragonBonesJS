"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseTimelineState_1 = require("./BaseTimelineState");
var DragonBones_1 = require("../core/DragonBones");
var EventObject_1 = require("../event/EventObject");
var BaseObject_1 = require("../core/BaseObject");
var Transform_1 = require("../geom/Transform");
var ColorTransform_1 = require("../geom/ColorTransform");
/**
 * @internal
 * @private
 */
var AnimationTimelineState = /** @class */ (function (_super) {
    tslib_1.__extends(AnimationTimelineState, _super);
    function AnimationTimelineState() {
        return _super.call(this) || this;
    }
    AnimationTimelineState.toString = function () {
        return "[class dragonBones.AnimationTimelineState]";
    };
    AnimationTimelineState.prototype._onCrossFrame = function (frame) {
        if (this._animationState.actionEnabled) {
            var actions = frame.actions;
            for (var i = 0, l = actions.length; i < l; ++i) {
                this._armature._bufferAction(actions[i]);
            }
        }
        var eventDispatcher = this._armature.eventDispatcher;
        var events = frame.events;
        for (var i = 0, l = events.length; i < l; ++i) {
            var eventData = events[i];
            var eventType = null;
            switch (eventData.type) {
                case 10 /* Frame */:
                    eventType = EventObject_1.EventObject.FRAME_EVENT;
                    break;
                case 11 /* Sound */:
                    eventType = EventObject_1.EventObject.SOUND_EVENT;
                    break;
            }
            if (eventDispatcher.hasEvent(eventType) || eventData.type === 11 /* Sound */) {
                var eventObject = BaseObject_1.BaseObject.borrowObject(EventObject_1.EventObject);
                eventObject.name = eventData.name;
                eventObject.frame = frame;
                eventObject.data = eventData.data;
                eventObject.animationState = this._animationState;
                if (eventData.bone) {
                    eventObject.bone = this._armature.getBone(eventData.bone.name);
                }
                if (eventData.slot) {
                    eventObject.slot = this._armature.getSlot(eventData.slot.name);
                }
                this._armature._bufferEvent(eventObject, eventType);
            }
        }
    };
    AnimationTimelineState.prototype.update = function (passedTime) {
        var prevState = this._playState;
        var prevPlayTimes = this._currentPlayTimes;
        var prevTime = this._currentTime;
        if (this._playState <= 0 && this._setCurrentTime(passedTime)) {
            var eventDispatcher = this._armature.eventDispatcher;
            if (prevState < 0 && this._playState !== prevState) {
                if (this._animationState.displayControl) {
                    this._armature._sortZOrder(null);
                }
                if (eventDispatcher.hasEvent(EventObject_1.EventObject.START)) {
                    var eventObject = BaseObject_1.BaseObject.borrowObject(EventObject_1.EventObject);
                    eventObject.animationState = this._animationState;
                    this._armature._bufferEvent(eventObject, EventObject_1.EventObject.START);
                }
            }
            if (prevTime < 0.0) {
                return;
            }
            var isReverse = false;
            var loopCompleteEvent = null;
            var completeEvent = null;
            if (this._currentPlayTimes !== prevPlayTimes) {
                if (eventDispatcher.hasEvent(EventObject_1.EventObject.LOOP_COMPLETE)) {
                    loopCompleteEvent = BaseObject_1.BaseObject.borrowObject(EventObject_1.EventObject);
                    loopCompleteEvent.animationState = this._animationState;
                }
                if (this._playState > 0) {
                    if (eventDispatcher.hasEvent(EventObject_1.EventObject.COMPLETE)) {
                        completeEvent = BaseObject_1.BaseObject.borrowObject(EventObject_1.EventObject);
                        completeEvent.animationState = this._animationState;
                    }
                    isReverse = prevTime > this._currentTime;
                }
                else {
                    isReverse = prevTime < this._currentTime;
                }
            }
            else {
                isReverse = prevTime > this._currentTime;
            }
            if (this._frameCount > 1) {
                var currentFrameIndex = Math.floor(this._currentTime * this._frameRate); // uint
                var currentFrame = this._timelineData.frames[currentFrameIndex];
                if (this._currentFrame !== currentFrame) {
                    var crossedFrame = this._currentFrame;
                    this._currentFrame = currentFrame;
                    if (isReverse) {
                        if (!crossedFrame) {
                            var prevFrameIndex = Math.floor(prevTime * this._frameRate);
                            crossedFrame = this._timelineData.frames[prevFrameIndex];
                            if (this._currentPlayTimes === prevPlayTimes) { // Start.
                                if (crossedFrame === currentFrame) { // Uncrossed.
                                    crossedFrame = null;
                                }
                            }
                        }
                        while (crossedFrame) {
                            if (this._position <= crossedFrame.position &&
                                crossedFrame.position <= this._position + this._duration) { // Support interval play.
                                this._onCrossFrame(crossedFrame);
                            }
                            if (loopCompleteEvent && crossedFrame === this._timelineData.frames[0]) { // Add loop complete event after first frame.
                                this._armature._bufferEvent(loopCompleteEvent, EventObject_1.EventObject.LOOP_COMPLETE);
                                loopCompleteEvent = null;
                            }
                            crossedFrame = crossedFrame.prev;
                            if (crossedFrame === currentFrame) {
                                break;
                            }
                        }
                    }
                    else {
                        if (!crossedFrame) {
                            var prevFrameIndex = Math.floor(prevTime * this._frameRate);
                            crossedFrame = this._timelineData.frames[prevFrameIndex];
                            if (this._currentPlayTimes === prevPlayTimes) { // Start.
                                if (prevTime <= crossedFrame.position) { // Crossed.
                                    crossedFrame = crossedFrame.prev;
                                }
                                else if (crossedFrame === currentFrame) { // Uncrossed.
                                    crossedFrame = null;
                                }
                            }
                        }
                        while (crossedFrame) {
                            crossedFrame = crossedFrame.next;
                            if (loopCompleteEvent && crossedFrame === this._timelineData.frames[0]) { // Add loop complete event before first frame.
                                this._armature._bufferEvent(loopCompleteEvent, EventObject_1.EventObject.LOOP_COMPLETE);
                                loopCompleteEvent = null;
                            }
                            if (this._position <= crossedFrame.position &&
                                crossedFrame.position <= this._position + this._duration) { // Support interval play.
                                this._onCrossFrame(crossedFrame);
                            }
                            if (crossedFrame === currentFrame) {
                                break;
                            }
                        }
                    }
                }
            }
            else if (this._frameCount > 0 && !this._currentFrame) {
                this._currentFrame = this._timelineData.frames[0];
                if (this._currentPlayTimes === prevPlayTimes) { // Start.
                    if (prevTime <= this._currentFrame.position) {
                        this._onCrossFrame(this._currentFrame);
                    }
                }
                else if (this._position <= this._currentFrame.position) { // Loop complete.
                    if (!isReverse && loopCompleteEvent) { // Add loop complete event before first frame.
                        this._armature._bufferEvent(loopCompleteEvent, EventObject_1.EventObject.LOOP_COMPLETE);
                        loopCompleteEvent = null;
                    }
                    this._onCrossFrame(this._currentFrame);
                }
            }
            if (loopCompleteEvent) {
                this._armature._bufferEvent(loopCompleteEvent, EventObject_1.EventObject.LOOP_COMPLETE);
                loopCompleteEvent = null;
            }
            if (completeEvent) {
                this._armature._bufferEvent(completeEvent, EventObject_1.EventObject.COMPLETE);
                completeEvent = null;
            }
        }
    };
    AnimationTimelineState.prototype.setCurrentTime = function (value) {
        this._setCurrentTime(value);
        this._currentFrame = null;
    };
    return AnimationTimelineState;
}(BaseTimelineState_1.TimelineState));
exports.AnimationTimelineState = AnimationTimelineState;
/**
 * @internal
 * @private
 */
var ZOrderTimelineState = /** @class */ (function (_super) {
    tslib_1.__extends(ZOrderTimelineState, _super);
    function ZOrderTimelineState() {
        return _super.call(this) || this;
    }
    ZOrderTimelineState.toString = function () {
        return "[class dragonBones.ZOrderTimelineState]";
    };
    ZOrderTimelineState.prototype._onArriveAtFrame = function () {
        _super.prototype._onArriveAtFrame.call(this);
        this._armature._sortZOrder(this._currentFrame.zOrder);
    };
    return ZOrderTimelineState;
}(BaseTimelineState_1.TimelineState));
exports.ZOrderTimelineState = ZOrderTimelineState;
/**
 * @internal
 * @private
 */
var BoneTimelineState = /** @class */ (function (_super) {
    tslib_1.__extends(BoneTimelineState, _super);
    function BoneTimelineState() {
        var _this = _super.call(this) || this;
        _this._transform = new Transform_1.Transform();
        _this._durationTransform = new Transform_1.Transform();
        return _this;
    }
    BoneTimelineState.toString = function () {
        return "[class dragonBones.BoneTimelineState]";
    };
    BoneTimelineState.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.bone = null;
        this._transformDirty = false;
        this._tweenTransform = 0 /* None */;
        this._tweenRotate = 0 /* None */;
        this._tweenScale = 0 /* None */;
        this._transform.identity();
        this._durationTransform.identity();
        this._boneTransform = null;
        this._originalTransform = null;
    };
    BoneTimelineState.prototype._onArriveAtFrame = function () {
        _super.prototype._onArriveAtFrame.call(this);
        this._tweenTransform = 1 /* Once */;
        this._tweenRotate = 1 /* Once */;
        this._tweenScale = 1 /* Once */;
        if (this._frameCount > 1 && (this._tweenEasing !== DragonBones_1.DragonBones.NO_TWEEN || this._curve)) {
            var currentTransform = this._currentFrame.transform;
            var nextFrame = this._currentFrame.next;
            var nextTransform = nextFrame.transform;
            // Transform.
            this._durationTransform.x = nextTransform.x - currentTransform.x;
            this._durationTransform.y = nextTransform.y - currentTransform.y;
            if (this._durationTransform.x !== 0.0 || this._durationTransform.y !== 0.0) {
                this._tweenTransform = 2 /* Always */;
            }
            // Rotate.
            var tweenRotate = this._currentFrame.tweenRotate;
            if (tweenRotate !== DragonBones_1.DragonBones.NO_TWEEN) {
                if (tweenRotate) {
                    if (tweenRotate > 0.0 ? nextTransform.skewY >= currentTransform.skewY : nextTransform.skewY <= currentTransform.skewY) {
                        tweenRotate = tweenRotate > 0.0 ? tweenRotate - 1.0 : tweenRotate + 1.0;
                    }
                    this._durationTransform.skewX = nextTransform.skewX - currentTransform.skewX + DragonBones_1.DragonBones.PI_D * tweenRotate;
                    this._durationTransform.skewY = nextTransform.skewY - currentTransform.skewY + DragonBones_1.DragonBones.PI_D * tweenRotate;
                }
                else {
                    this._durationTransform.skewX = Transform_1.Transform.normalizeRadian(nextTransform.skewX - currentTransform.skewX);
                    this._durationTransform.skewY = Transform_1.Transform.normalizeRadian(nextTransform.skewY - currentTransform.skewY);
                }
                if (this._durationTransform.skewX !== 0.0 || this._durationTransform.skewY !== 0.0) {
                    this._tweenRotate = 2 /* Always */;
                }
            }
            else {
                this._durationTransform.skewX = 0.0;
                this._durationTransform.skewY = 0.0;
            }
            // Scale.
            if (this._currentFrame.tweenScale) {
                this._durationTransform.scaleX = nextTransform.scaleX - currentTransform.scaleX;
                this._durationTransform.scaleY = nextTransform.scaleY - currentTransform.scaleY;
                if (this._durationTransform.scaleX !== 0.0 || this._durationTransform.scaleY !== 0.0) {
                    this._tweenScale = 2 /* Always */;
                }
            }
            else {
                this._durationTransform.scaleX = 0.0;
                this._durationTransform.scaleY = 0.0;
            }
        }
        else {
            this._durationTransform.x = 0.0;
            this._durationTransform.y = 0.0;
            this._durationTransform.skewX = 0.0;
            this._durationTransform.skewY = 0.0;
            this._durationTransform.scaleX = 0.0;
            this._durationTransform.scaleY = 0.0;
        }
    };
    BoneTimelineState.prototype._onUpdateFrame = function () {
        _super.prototype._onUpdateFrame.call(this);
        var tweenProgress = 0.0;
        var currentTransform = this._currentFrame.transform;
        if (this._tweenTransform !== 0 /* None */) {
            if (this._tweenTransform === 1 /* Once */) {
                this._tweenTransform = 0 /* None */;
                tweenProgress = 0.0;
            }
            else {
                tweenProgress = this._tweenProgress;
            }
            if (this._animationState.additiveBlending) { // Additive blending.
                this._transform.x = currentTransform.x + this._durationTransform.x * tweenProgress;
                this._transform.y = currentTransform.y + this._durationTransform.y * tweenProgress;
            }
            else { // Normal blending.
                this._transform.x = this._originalTransform.x + currentTransform.x + this._durationTransform.x * tweenProgress;
                this._transform.y = this._originalTransform.y + currentTransform.y + this._durationTransform.y * tweenProgress;
            }
            this._transformDirty = true;
        }
        if (this._tweenRotate !== 0 /* None */) {
            if (this._tweenRotate === 1 /* Once */) {
                this._tweenRotate = 0 /* None */;
                tweenProgress = 0.0;
            }
            else {
                tweenProgress = this._tweenProgress;
            }
            if (this._animationState.additiveBlending) { // Additive blending.
                this._transform.skewX = currentTransform.skewX + this._durationTransform.skewX * tweenProgress;
                this._transform.skewY = currentTransform.skewY + this._durationTransform.skewY * tweenProgress;
            }
            else { // Normal blending.
                this._transform.skewX = Transform_1.Transform.normalizeRadian(this._originalTransform.skewX + currentTransform.skewX + this._durationTransform.skewX * tweenProgress);
                this._transform.skewY = Transform_1.Transform.normalizeRadian(this._originalTransform.skewY + currentTransform.skewY + this._durationTransform.skewY * tweenProgress);
            }
            this._transformDirty = true;
        }
        if (this._tweenScale !== 0 /* None */) {
            if (this._tweenScale === 1 /* Once */) {
                this._tweenScale = 0 /* None */;
                tweenProgress = 0.0;
            }
            else {
                tweenProgress = this._tweenProgress;
            }
            if (this._animationState.additiveBlending) { // Additive blending.
                this._transform.scaleX = currentTransform.scaleX + this._durationTransform.scaleX * tweenProgress;
                this._transform.scaleY = currentTransform.scaleY + this._durationTransform.scaleY * tweenProgress;
            }
            else { // Normal blending.
                this._transform.scaleX = this._originalTransform.scaleX * (currentTransform.scaleX + this._durationTransform.scaleX * tweenProgress);
                this._transform.scaleY = this._originalTransform.scaleY * (currentTransform.scaleY + this._durationTransform.scaleY * tweenProgress);
            }
            this._transformDirty = true;
        }
    };
    BoneTimelineState.prototype._init = function (armature, animationState, timelineData) {
        _super.prototype._init.call(this, armature, animationState, timelineData);
        this._originalTransform = this._timelineData.originalTransform;
        this._boneTransform = this.bone._animationPose;
    };
    BoneTimelineState.prototype.fadeOut = function () {
        this._transform.skewX = Transform_1.Transform.normalizeRadian(this._transform.skewX);
        this._transform.skewY = Transform_1.Transform.normalizeRadian(this._transform.skewY);
    };
    BoneTimelineState.prototype.update = function (passedTime) {
        // Blend animation state.
        var animationLayer = this._animationState._layer;
        var weight = this._animationState._weightResult;
        if (!this.bone._blendDirty) {
            _super.prototype.update.call(this, passedTime);
            this.bone._blendLayer = animationLayer;
            this.bone._blendLeftWeight = 1.0;
            this.bone._blendTotalWeight = weight;
            this._boneTransform.x = this._transform.x * weight;
            this._boneTransform.y = this._transform.y * weight;
            this._boneTransform.skewX = this._transform.skewX * weight;
            this._boneTransform.skewY = this._transform.skewY * weight;
            this._boneTransform.scaleX = (this._transform.scaleX - 1.0) * weight + 1.0;
            this._boneTransform.scaleY = (this._transform.scaleY - 1.0) * weight + 1.0;
            this.bone._blendDirty = true;
        }
        else if (this.bone._blendLeftWeight > 0.0) {
            if (this.bone._blendLayer !== animationLayer) {
                if (this.bone._blendTotalWeight >= this.bone._blendLeftWeight) {
                    this.bone._blendLeftWeight = 0.0;
                }
                else {
                    this.bone._blendLayer = animationLayer;
                    this.bone._blendLeftWeight -= this.bone._blendTotalWeight;
                    this.bone._blendTotalWeight = 0.0;
                }
            }
            weight *= this.bone._blendLeftWeight;
            if (weight >= 0.0) {
                _super.prototype.update.call(this, passedTime);
                this.bone._blendTotalWeight += weight;
                this._boneTransform.x += this._transform.x * weight;
                this._boneTransform.y += this._transform.y * weight;
                this._boneTransform.skewX += this._transform.skewX * weight;
                this._boneTransform.skewY += this._transform.skewY * weight;
                this._boneTransform.scaleX += (this._transform.scaleX - 1) * weight;
                this._boneTransform.scaleY += (this._transform.scaleY - 1) * weight;
            }
        }
        if (this._transformDirty || this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
            this._transformDirty = false;
            this.bone.invalidUpdate();
        }
    };
    return BoneTimelineState;
}(BaseTimelineState_1.TweenTimelineState));
exports.BoneTimelineState = BoneTimelineState;
/**
 * @internal
 * @private
 */
var SlotTimelineState = /** @class */ (function (_super) {
    tslib_1.__extends(SlotTimelineState, _super);
    function SlotTimelineState() {
        var _this = _super.call(this) || this;
        _this._color = new ColorTransform_1.ColorTransform();
        _this._durationColor = new ColorTransform_1.ColorTransform();
        return _this;
    }
    SlotTimelineState.toString = function () {
        return "[class dragonBones.SlotTimelineState]";
    };
    SlotTimelineState.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.slot = null;
        this._colorDirty = false;
        this._tweenColor = 0 /* None */;
        this._color.identity();
        this._durationColor.identity();
        this._slotColor = null;
    };
    SlotTimelineState.prototype._onArriveAtFrame = function () {
        _super.prototype._onArriveAtFrame.call(this);
        if (this._animationState._isDisabled(this.slot)) {
            this._tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
            this._curve = null;
            this._tweenColor = 0 /* None */;
            return;
        }
        var displayIndex = this._currentFrame.displayIndex;
        if (this._playState >= 0 && this.slot.displayIndex !== displayIndex) {
            this.slot._setDisplayIndex(displayIndex);
        }
        if (displayIndex >= 0) {
            this._tweenColor = 0 /* None */;
            var currentColor = this._currentFrame.color;
            if (this._tweenEasing !== DragonBones_1.DragonBones.NO_TWEEN || this._curve) {
                var nextFrame = this._currentFrame.next;
                var nextColor = nextFrame.color;
                if (currentColor !== nextColor) {
                    this._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                    this._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                    this._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                    this._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                    this._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                    this._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                    this._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                    this._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;
                    if (this._durationColor.alphaMultiplier !== 0.0 ||
                        this._durationColor.redMultiplier !== 0.0 ||
                        this._durationColor.greenMultiplier !== 0.0 ||
                        this._durationColor.blueMultiplier !== 0.0 ||
                        this._durationColor.alphaOffset !== 0 ||
                        this._durationColor.redOffset !== 0 ||
                        this._durationColor.greenOffset !== 0 ||
                        this._durationColor.blueOffset !== 0) {
                        this._tweenColor = 2 /* Always */;
                    }
                }
            }
            if (this._tweenColor === 0 /* None */) {
                if (this._slotColor.alphaMultiplier !== currentColor.alphaMultiplier ||
                    this._slotColor.redMultiplier !== currentColor.redMultiplier ||
                    this._slotColor.greenMultiplier !== currentColor.greenMultiplier ||
                    this._slotColor.blueMultiplier !== currentColor.blueMultiplier ||
                    this._slotColor.alphaOffset !== currentColor.alphaOffset ||
                    this._slotColor.redOffset !== currentColor.redOffset ||
                    this._slotColor.greenOffset !== currentColor.greenOffset ||
                    this._slotColor.blueOffset !== currentColor.blueOffset) {
                    this._tweenColor = 1 /* Once */;
                }
            }
        }
        else {
            this._tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
            this._curve = null;
            this._tweenColor = 0 /* None */;
        }
    };
    SlotTimelineState.prototype._onUpdateFrame = function () {
        _super.prototype._onUpdateFrame.call(this);
        var tweenProgress = 0.0;
        if (this._tweenColor !== 0 /* None */ && this.slot.parent._blendLayer >= this._animationState._layer) {
            if (this._tweenColor === 1 /* Once */) {
                this._tweenColor = 0 /* None */;
                tweenProgress = 0.0;
            }
            else {
                tweenProgress = this._tweenProgress;
            }
            var currentColor = this._currentFrame.color;
            this._color.alphaMultiplier = currentColor.alphaMultiplier + this._durationColor.alphaMultiplier * tweenProgress;
            this._color.redMultiplier = currentColor.redMultiplier + this._durationColor.redMultiplier * tweenProgress;
            this._color.greenMultiplier = currentColor.greenMultiplier + this._durationColor.greenMultiplier * tweenProgress;
            this._color.blueMultiplier = currentColor.blueMultiplier + this._durationColor.blueMultiplier * tweenProgress;
            this._color.alphaOffset = currentColor.alphaOffset + this._durationColor.alphaOffset * tweenProgress;
            this._color.redOffset = currentColor.redOffset + this._durationColor.redOffset * tweenProgress;
            this._color.greenOffset = currentColor.greenOffset + this._durationColor.greenOffset * tweenProgress;
            this._color.blueOffset = currentColor.blueOffset + this._durationColor.blueOffset * tweenProgress;
            this._colorDirty = true;
        }
    };
    SlotTimelineState.prototype._init = function (armature, animationState, timelineData) {
        _super.prototype._init.call(this, armature, animationState, timelineData);
        this._slotColor = this.slot._colorTransform;
    };
    SlotTimelineState.prototype.fadeOut = function () {
        this._tweenColor = 0 /* None */;
    };
    SlotTimelineState.prototype.update = function (passedTime) {
        _super.prototype.update.call(this, passedTime);
        // Fade animation.
        if (this._tweenColor !== 0 /* None */ || this._colorDirty) {
            if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                var fadeProgress = Math.pow(this._animationState._fadeProgress, 4);
                this._slotColor.alphaMultiplier += (this._color.alphaMultiplier - this._slotColor.alphaMultiplier) * fadeProgress;
                this._slotColor.redMultiplier += (this._color.redMultiplier - this._slotColor.redMultiplier) * fadeProgress;
                this._slotColor.greenMultiplier += (this._color.greenMultiplier - this._slotColor.greenMultiplier) * fadeProgress;
                this._slotColor.blueMultiplier += (this._color.blueMultiplier - this._slotColor.blueMultiplier) * fadeProgress;
                this._slotColor.alphaOffset += (this._color.alphaOffset - this._slotColor.alphaOffset) * fadeProgress;
                this._slotColor.redOffset += (this._color.redOffset - this._slotColor.redOffset) * fadeProgress;
                this._slotColor.greenOffset += (this._color.greenOffset - this._slotColor.greenOffset) * fadeProgress;
                this._slotColor.blueOffset += (this._color.blueOffset - this._slotColor.blueOffset) * fadeProgress;
                this.slot._colorDirty = true;
            }
            else if (this._colorDirty) {
                this._colorDirty = false;
                this._slotColor.alphaMultiplier = this._color.alphaMultiplier;
                this._slotColor.redMultiplier = this._color.redMultiplier;
                this._slotColor.greenMultiplier = this._color.greenMultiplier;
                this._slotColor.blueMultiplier = this._color.blueMultiplier;
                this._slotColor.alphaOffset = this._color.alphaOffset;
                this._slotColor.redOffset = this._color.redOffset;
                this._slotColor.greenOffset = this._color.greenOffset;
                this._slotColor.blueOffset = this._color.blueOffset;
                this.slot._colorDirty = true;
            }
        }
    };
    return SlotTimelineState;
}(BaseTimelineState_1.TweenTimelineState));
exports.SlotTimelineState = SlotTimelineState;
/**
 * @internal
 * @private
 */
var FFDTimelineState = /** @class */ (function (_super) {
    tslib_1.__extends(FFDTimelineState, _super);
    function FFDTimelineState() {
        var _this = _super.call(this) || this;
        _this._ffdVertices = [];
        _this._durationFFDVertices = [];
        return _this;
    }
    FFDTimelineState.toString = function () {
        return "[class dragonBones.FFDTimelineState]";
    };
    FFDTimelineState.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.slot = null;
        this._ffdDirty = false;
        this._tweenFFD = 0 /* None */;
        this._ffdVertices.length = 0;
        this._durationFFDVertices.length = 0;
        this._slotFFDVertices = null;
    };
    FFDTimelineState.prototype._onArriveAtFrame = function () {
        _super.prototype._onArriveAtFrame.call(this);
        if (this.slot.displayIndex >= 0 && this._animationState._isDisabled(this.slot)) {
            this._tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
            this._curve = null;
            this._tweenFFD = 0 /* None */;
            return;
        }
        this._tweenFFD = 0 /* None */;
        if (this._tweenEasing !== DragonBones_1.DragonBones.NO_TWEEN || this._curve) {
            var currentFFDVertices = this._currentFrame.tweens;
            var nextFFDVertices = this._currentFrame.next.tweens;
            for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                var duration = nextFFDVertices[i] - currentFFDVertices[i];
                this._durationFFDVertices[i] = duration;
                if (duration !== 0.0) {
                    this._tweenFFD = 2 /* Always */;
                }
            }
        }
        //
        if (this._tweenFFD === 0 /* None */) {
            this._tweenFFD = 1 /* Once */;
            for (var i = 0, l = this._durationFFDVertices.length; i < l; ++i) {
                this._durationFFDVertices[i] = 0;
            }
        }
    };
    FFDTimelineState.prototype._onUpdateFrame = function () {
        _super.prototype._onUpdateFrame.call(this);
        var tweenProgress = 0.0;
        if (this._tweenFFD !== 0 /* None */ && this.slot.parent._blendLayer >= this._animationState._layer) {
            if (this._tweenFFD === 1 /* Once */) {
                this._tweenFFD = 0 /* None */;
                tweenProgress = 0.0;
            }
            else {
                tweenProgress = this._tweenProgress;
            }
            var currentFFDVertices = this._currentFrame.tweens;
            for (var i = 0, l = currentFFDVertices.length; i < l; ++i) {
                this._ffdVertices[i] = currentFFDVertices[i] + this._durationFFDVertices[i] * tweenProgress;
            }
            this._ffdDirty = true;
        }
    };
    FFDTimelineState.prototype._init = function (armature, animationState, timelineData) {
        _super.prototype._init.call(this, armature, animationState, timelineData);
        this._slotFFDVertices = this.slot._ffdVertices;
        this._ffdVertices.length = this._timelineData.frames[0].tweens.length;
        this._durationFFDVertices.length = this._ffdVertices.length;
        for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
            this._ffdVertices[i] = 0.0;
        }
        for (var i = 0, l = this._durationFFDVertices.length; i < l; ++i) {
            this._durationFFDVertices[i] = 0.0;
        }
    };
    FFDTimelineState.prototype.fadeOut = function () {
        this._tweenFFD = 0 /* None */;
    };
    FFDTimelineState.prototype.update = function (passedTime) {
        _super.prototype.update.call(this, passedTime);
        if (this.slot._meshData !== this._timelineData.display.mesh) {
            return;
        }
        // Fade animation.
        if (this._tweenFFD !== 0 /* None */ || this._ffdDirty) {
            if (this._animationState._fadeState !== 0 || this._animationState._subFadeState !== 0) {
                var fadeProgress = Math.pow(this._animationState._fadeProgress, 4.0);
                for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                    this._slotFFDVertices[i] += (this._ffdVertices[i] - this._slotFFDVertices[i]) * fadeProgress;
                }
                this.slot._meshDirty = true;
            }
            else if (this._ffdDirty) {
                this._ffdDirty = false;
                for (var i = 0, l = this._ffdVertices.length; i < l; ++i) {
                    this._slotFFDVertices[i] = this._ffdVertices[i];
                }
                this.slot._meshDirty = true;
            }
        }
    };
    return FFDTimelineState;
}(BaseTimelineState_1.TweenTimelineState));
exports.FFDTimelineState = FFDTimelineState;
