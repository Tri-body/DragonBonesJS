import { BaseObject } from "../core/BaseObject";
import { AnimationState } from "./AnimationState";
import { AnimationData } from "../model/AnimationData";
import { Map, AnimationFadeOutMode } from "../core/DragonBones";
import { Armature } from "../armature/Armature";
import { AnimationConfig } from "../model/AnimationConfig";
/**
 * @language zh_CN
 * 动画控制器，用来播放动画数据，管理动画状态。
 * @see dragonBones.AnimationData
 * @see dragonBones.AnimationState
 * @version DragonBones 3.0
 */
export declare class Animation extends BaseObject {
    private static _sortAnimationState;
    /**
     * @private
     */
    static toString(): string;
    /**
     * @language zh_CN
     * 播放速度。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
     * @default 1
     * @version DragonBones 3.0
     */
    timeScale: number;
    private _isPlaying;
    private _animationStateDirty;
    /**
     * @internal
     * @private
     */
    _timelineStateDirty: boolean;
    /**
     * @private
     */
    _cacheFrameIndex: number;
    private _animationNames;
    private _animations;
    private _animationStates;
    private _armature;
    private _lastAnimationState;
    private _animationConfig;
    /**
     * @internal
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _onClear(): void;
    private _fadeOut;
    /**
     * @internal
     * @private
     */
    _init(armature: Armature): void;
    /**
     * @internal
     * @private
     */
    _advanceTime(passedTime: number): void;
    /**
     * @language zh_CN
     * 清除所有动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    reset(): void;
    /**
     * @language zh_CN
     * 暂停播放动画。
     * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    stop(animationName?: string): void;
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
    playConfig(animationConfig: AnimationConfig): AnimationState;
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
    fadeIn(animationName: string, fadeInTime?: number, playTimes?: number, layer?: number, group?: string, fadeOutMode?: AnimationFadeOutMode): AnimationState;
    /**
     * @language zh_CN
     * 播放动画。
     * @param animationName 动画数据名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
     * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    play(animationName?: string, playTimes?: number): AnimationState;
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
    gotoAndPlayByTime(animationName: string, time?: number, playTimes?: number): AnimationState;
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
    gotoAndPlayByFrame(animationName: string, frame?: number, playTimes?: number): AnimationState;
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
    gotoAndPlayByProgress(animationName: string, progress?: number, playTimes?: number): AnimationState;
    /**
     * @language zh_CN
     * 将动画停止到指定的时间。
     * @param animationName 动画数据的名称。
     * @param time 时间。 (以秒为单位)
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    gotoAndStopByTime(animationName: string, time?: number): AnimationState;
    /**
     * @language zh_CN
     * 将动画停止到指定的帧。
     * @param animationName 动画数据的名称。
     * @param frame 帧。
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    gotoAndStopByFrame(animationName: string, frame?: number): AnimationState;
    /**
     * @language zh_CN
     * 将动画停止到指定的进度。
     * @param animationName 动画数据的名称。
     * @param progress 进度。 [0 ~ 1]
     * @returns 对应的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 4.5
     */
    gotoAndStopByProgress(animationName: string, progress?: number): AnimationState;
    /**
     * @language zh_CN
     * 获取动画状态。
     * @param animationName 动画状态的名称。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    getState(animationName: string): AnimationState;
    /**
     * @language zh_CN
     * 是否包含动画数据。
     * @param animationName 动画数据的名称。
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    hasAnimation(animationName: string): boolean;
    /**
     * @language zh_CN
     * 动画是否处于播放状态。
     * @version DragonBones 3.0
     */
    readonly isPlaying: boolean;
    /**
     * @language zh_CN
     * 所有动画状态是否均已播放完毕。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    readonly isCompleted: boolean;
    /**
     * @language zh_CN
     * 上一个正在播放的动画状态名称。
     * @see #lastAnimationState
     * @version DragonBones 3.0
     */
    readonly lastAnimationName: string;
    /**
     * @language zh_CN
     * 上一个正在播放的动画状态。
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    readonly lastAnimationState: AnimationState;
    /**
     * @language zh_CN
     * 一个可以快速使用的动画配置实例。
     * @see dragonBones.AnimationConfig
     * @version DragonBones 5.0
     */
    readonly animationConfig: AnimationConfig;
    /**
     * @language zh_CN
     * 所有动画数据名称。
     * @see #animations
     * @version DragonBones 4.5
     */
    readonly animationNames: Array<string>;
    /**
     * @language zh_CN
     * 所有动画数据。
     * @see dragonBones.AnimationData
     * @version DragonBones 4.5
     */
    animations: Map<AnimationData>;
    /**
     * @deprecated
     * @see #play()
     * @see #fadeIn()
     * @see #gotoAndPlayByTime()
     * @see #gotoAndPlayByFrame()
     * @see #gotoAndPlayByProgress()
     */
    gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, playTimes?: number, layer?: number, group?: string, fadeOutMode?: AnimationFadeOutMode, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState;
    /**
     * @deprecated
     * @see #gotoAndStopByTime()
     * @see #gotoAndStopByFrame()
     * @see #gotoAndStopByProgress()
     */
    gotoAndStop(animationName: string, time?: number): AnimationState;
    /**
     * @deprecated
     * @see #animationNames
     * @see #animations
     */
    readonly animationList: Array<string>;
    /**
     * @deprecated
     * @see #animationNames
     * @see #animations
     */
    readonly animationDataList: Array<AnimationData>;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.None
     */
    static None: AnimationFadeOutMode;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameLayer
     */
    static SameLayer: AnimationFadeOutMode;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameGroup
     */
    static SameGroup: AnimationFadeOutMode;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.SameLayerAndGroup
     */
    static SameLayerAndGroup: AnimationFadeOutMode;
    /**
     * @deprecated
     * @see dragonBones.AnimationFadeOutMode.All
     */
    static All: AnimationFadeOutMode;
}
