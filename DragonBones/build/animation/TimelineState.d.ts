import { TimelineState, TweenTimelineState } from "./BaseTimelineState";
import { AnimationFrameData, BoneFrameData, ZOrderFrameData, SlotFrameData, ExtensionFrameData } from "../model/FrameData";
import { AnimationData } from "../model/AnimationData";
import { BoneTimelineData, ZOrderTimelineData, SlotTimelineData, FFDTimelineData } from "../model/TimelineData";
import { Bone } from "../armature/Bone";
import { Armature } from "../armature/Armature";
import { AnimationState } from "./AnimationState";
import { Slot } from "../armature/Slot";
/**
 * @internal
 * @private
 */
export declare class AnimationTimelineState extends TimelineState<AnimationFrameData, AnimationData> {
    static toString(): string;
    constructor();
    protected _onCrossFrame(frame: AnimationFrameData): void;
    update(passedTime: number): void;
    setCurrentTime(value: number): void;
}
/**
 * @internal
 * @private
 */
export declare class ZOrderTimelineState extends TimelineState<ZOrderFrameData, ZOrderTimelineData> {
    static toString(): string;
    constructor();
    protected _onArriveAtFrame(): void;
}
/**
 * @internal
 * @private
 */
export declare class BoneTimelineState extends TweenTimelineState<BoneFrameData, BoneTimelineData> {
    static toString(): string;
    bone: Bone;
    private _transformDirty;
    private _tweenTransform;
    private _tweenRotate;
    private _tweenScale;
    private _transform;
    private _durationTransform;
    private _boneTransform;
    private _originalTransform;
    constructor();
    protected _onClear(): void;
    protected _onArriveAtFrame(): void;
    protected _onUpdateFrame(): void;
    _init(armature: Armature, animationState: AnimationState, timelineData: BoneTimelineData): void;
    fadeOut(): void;
    update(passedTime: number): void;
}
/**
 * @internal
 * @private
 */
export declare class SlotTimelineState extends TweenTimelineState<SlotFrameData, SlotTimelineData> {
    static toString(): string;
    slot: Slot;
    private _colorDirty;
    private _tweenColor;
    private _color;
    private _durationColor;
    private _slotColor;
    constructor();
    protected _onClear(): void;
    protected _onArriveAtFrame(): void;
    protected _onUpdateFrame(): void;
    _init(armature: Armature, animationState: AnimationState, timelineData: SlotTimelineData): void;
    fadeOut(): void;
    update(passedTime: number): void;
}
/**
 * @internal
 * @private
 */
export declare class FFDTimelineState extends TweenTimelineState<ExtensionFrameData, FFDTimelineData> {
    static toString(): string;
    slot: Slot;
    private _ffdDirty;
    private _tweenFFD;
    private _ffdVertices;
    private _durationFFDVertices;
    private _slotFFDVertices;
    constructor();
    protected _onClear(): void;
    protected _onArriveAtFrame(): void;
    protected _onUpdateFrame(): void;
    _init(armature: Armature, animationState: AnimationState, timelineData: FFDTimelineData): void;
    fadeOut(): void;
    update(passedTime: number): void;
}
