import { FrameData, TweenFrameData } from "../model/FrameData";
import { TimelineData } from "../model/TimelineData";
import { BaseObject } from "../core/BaseObject";
import { Armature } from "../armature/Armature";
import { AnimationState } from "./AnimationState";
import { AnimationTimelineState } from "./TimelineState";
/**
 * @internal
 * @private
 */
export declare const enum TweenType {
    None = 0,
    Once = 1,
    Always = 2
}
/**
 * @internal
 * @private
 */
export declare abstract class TimelineState<T extends FrameData<T>, M extends TimelineData<T>> extends BaseObject {
    _playState: number;
    _currentPlayTimes: number;
    _currentTime: number;
    _timelineData: M;
    protected _frameRate: number;
    protected _frameCount: number;
    protected _position: number;
    protected _duration: number;
    protected _animationDutation: number;
    protected _timeScale: number;
    protected _timeOffset: number;
    protected _currentFrame: T;
    protected _armature: Armature;
    protected _animationState: AnimationState;
    protected _mainTimeline: AnimationTimelineState;
    constructor();
    protected _onClear(): void;
    protected _onUpdateFrame(): void;
    protected _onArriveAtFrame(): void;
    protected _setCurrentTime(passedTime: number): boolean;
    _init(armature: Armature, animationState: AnimationState, timelineData: M): void;
    fadeOut(): void;
    update(passedTime: number): void;
}
/**
 * @internal
 * @private
 */
export declare abstract class TweenTimelineState<T extends TweenFrameData<T>, M extends TimelineData<T>> extends TimelineState<T, M> {
    static _getEasingValue(progress: number, easing: number): number;
    static _getEasingCurveValue(progress: number, samples: Array<number>): number;
    protected _tweenProgress: number;
    protected _tweenEasing: number;
    protected _curve: Array<number>;
    constructor();
    protected _onClear(): void;
    protected _onArriveAtFrame(): void;
    protected _onUpdateFrame(): void;
}
