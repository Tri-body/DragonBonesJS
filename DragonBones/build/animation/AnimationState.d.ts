import { BaseObject } from "../core/BaseObject";
import { AnimationTimelineState } from "./TimelineState";
import { AnimationData } from "../model/AnimationData";
import { Armature } from "../armature/Armature";
import { AnimationConfig } from "../model/AnimationConfig";
import { Slot } from "../armature/Slot";
/**
 * @language zh_CN
 * 动画状态，播放动画时产生，可以对每个播放的动画进行更细致的控制和调节。
 * @see dragonBones.Animation
 * @see dragonBones.AnimationData
 * @version DragonBones 3.0
 */
export declare class AnimationState extends BaseObject {
    /**
     * @private
     */
    static toString(): string;
    /**
     * @language zh_CN
     * 是否对插槽的显示对象有控制权。
     * @see dragonBones.Slot#displayController
     * @version DragonBones 3.0
     */
    displayControl: boolean;
    /**
     * @language zh_CN
     * 是否以增加的方式混合。
     * @version DragonBones 3.0
     */
    additiveBlending: boolean;
    /**
     * @language zh_CN
     * 是否能触发行为。
     * @version DragonBones 5.0
     */
    actionEnabled: boolean;
    /**
     * @language zh_CN
     * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @version DragonBones 3.0
     */
    playTimes: number;
    /**
     * @language zh_CN
     * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
     * @version DragonBones 3.0
     */
    timeScale: number;
    /**
     * @language zh_CN
     * 混合权重。
     * @version DragonBones 3.0
     */
    weight: number;
    /**
     * @language zh_CN
     * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
     * 当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。
     * @version DragonBones 3.0
     */
    autoFadeOutTime: number;
    /**
     * @private
     */
    fadeTotalTime: number;
    /**
     * @internal
     * @private
     */
    _playheadState: number;
    /**
     * @internal
     * @private
     */
    _fadeState: number;
    /**
     * @internal
     * @private
     */
    _subFadeState: number;
    /**
     * @internal
     * @private
     */
    _layer: number;
    /**
     * @internal
     * @private
     */
    _position: number;
    /**
     * @internal
     * @private
     */
    _duration: number;
    /**
     * @private
     */
    private _fadeTime;
    /**
     * @private
     */
    private _time;
    /**
     * @internal
     * @private
     */
    _fadeProgress: number;
    /**
     * @internal
     * @private
     */
    _weightResult: number;
    /**
     * @private
     */
    private _name;
    /**
     * @private
     */
    private _group;
    /**
     * @private
     */
    private _boneMask;
    /**
     * @private
     */
    private _animationNames;
    /**
     * @private
     */
    private _boneTimelines;
    /**
     * @private
     */
    private _slotTimelines;
    /**
     * @private
     */
    private _ffdTimelines;
    /**
     * @private
     */
    private _animationData;
    /**
     * @private
     */
    private _armature;
    /**
     * @internal
     * @private
     */
    _timeline: AnimationTimelineState;
    /**
     * @private
     */
    private _zOrderTimeline;
    /**
     * @internal
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _onClear(): void;
    private _advanceFadeTime(passedTime);
    /**
     * @internal
     * @private
     */
    _init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void;
    /**
     * @internal
     * @private
     */
    _updateTimelineStates(): void;
    /**
     * @internal
     * @private
     */
    _advanceTime(passedTime: number, cacheFrameRate: number): void;
    /**
     * @internal
     * @private
     */
    _isDisabled(slot: Slot): boolean;
    /**
     * @language zh_CN
     * 继续播放。
     * @version DragonBones 3.0
     */
    play(): void;
    /**
     * @language zh_CN
     * 暂停播放。
     * @version DragonBones 3.0
     */
    stop(): void;
    /**
     * @language zh_CN
     * 淡出动画。
     * @param fadeOutTime 淡出时间。 (以秒为单位)
     * @param pausePlayhead 淡出时是否暂停动画。
     * @version DragonBones 3.0
     */
    fadeOut(fadeOutTime: number, pausePlayhead?: boolean): void;
    /**
     * @language zh_CN
     * 是否包含骨骼遮罩。
     * @param name 指定的骨骼名称。
     * @version DragonBones 3.0
     */
    containsBoneMask(name: string): boolean;
    /**
     * @language zh_CN
     * 添加骨骼遮罩。
     * @param boneName 指定的骨骼名称。
     * @param recursive 是否为该骨骼的子骨骼添加遮罩。
     * @version DragonBones 3.0
     */
    addBoneMask(name: string, recursive?: boolean): void;
    /**
     * @language zh_CN
     * 删除骨骼遮罩。
     * @param boneName 指定的骨骼名称。
     * @param recursive 是否删除该骨骼的子骨骼遮罩。
     * @version DragonBones 3.0
     */
    removeBoneMask(name: string, recursive?: boolean): void;
    /**
     * @language zh_CN
     * 删除所有骨骼遮罩。
     * @version DragonBones 3.0
     */
    removeAllBoneMask(): void;
    /**
     * @language zh_CN
     * 混合图层。
     * @version DragonBones 3.0
     */
    readonly layer: number;
    /**
     * @language zh_CN
     * 混合组。
     * @version DragonBones 3.0
     */
    readonly group: string;
    /**
     * @language zh_CN
     * 动画名称。
     * @version DragonBones 3.0
     */
    readonly name: string;
    /**
     * @language zh_CN
     * 动画数据。
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    readonly animationData: AnimationData;
    /**
     * @language zh_CN
     * 是否播放完毕。
     * @version DragonBones 3.0
     */
    readonly isCompleted: boolean;
    /**
     * @language zh_CN
     * 是否正在播放。
     * @version DragonBones 3.0
     */
    readonly isPlaying: boolean;
    /**
     * @language zh_CN
     * 当前播放次数。
     * @version DragonBones 3.0
     */
    readonly currentPlayTimes: number;
    /**
     * @language zh_CN
     * 动画的总时间。 (以秒为单位)
     * @version DragonBones 3.0
     */
    readonly totalTime: number;
    /**
     * @language zh_CN
     * 动画播放的时间。 (以秒为单位)
     * @version DragonBones 3.0
     */
    currentTime: number;
    /**
     * @deprecated
     */
    autoTween: boolean;
    /**
     * @deprecated
     * @see #animationData
     */
    readonly clip: AnimationData;
}
