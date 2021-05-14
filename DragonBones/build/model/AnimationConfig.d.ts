import { BaseObject } from "../core/BaseObject";
import { AnimationFadeOutMode } from "../core/DragonBones";
import { Armature } from "../armature/Armature";
/**
 * @language zh_CN
 * @beta
 * 动画配置，描述播放一个动画所需要的全部信息。
 * @see dragonBones.AnimationState
 * @version DragonBones 5.0
 */
export declare class AnimationConfig extends BaseObject {
    static toString(): string;
    /**
     * @language zh_CN
     * 是否暂停淡出的动画。
     * @default true
     * @version DragonBones 5.0
     */
    pauseFadeOut: boolean;
    /**
     * @language zh_CN
     * 淡出模式。
     * @default dragonBones.AnimationFadeOutMode.All
     * @see dragonBones.AnimationFadeOutMode
     * @version DragonBones 5.0
     */
    fadeOutMode: AnimationFadeOutMode;
    /**
     * @language zh_CN
     * 淡出时间。 [-1: 与淡入时间同步, [0~N]: 淡出时间] (以秒为单位)
     * @default -1
     * @version DragonBones 5.0
     */
    fadeOutTime: number;
    /**
     * @language zh_CN
     * 淡出缓动方式。
     * @default 0
     * @version DragonBones 5.0
     */
    fadeOutEasing: number;
    /**
     * @language zh_CN
     * 是否以增加的方式混合。
     * @default false
     * @version DragonBones 5.0
     */
    additiveBlending: boolean;
    /**
     * @language zh_CN
     * 是否对插槽的显示对象有控制权。
     * @default true
     * @version DragonBones 5.0
     */
    displayControl: boolean;
    /**
     * @language zh_CN
     * 是否暂停淡入的动画，直到淡入过程结束。
     * @default true
     * @version DragonBones 5.0
     */
    pauseFadeIn: boolean;
    /**
     * @language zh_CN
     * 否能触发行为。
     * @default true
     * @version DragonBones 5.0
     */
    actionEnabled: boolean;
    /**
     * @language zh_CN
     * 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @default -1
     * @version DragonBones 5.0
     */
    playTimes: number;
    /**
     * @language zh_CN
     * 混合图层，图层高会优先获取混合权重。
     * @default 0
     * @version DragonBones 5.0
     */
    layer: number;
    /**
     * @language zh_CN
     * 开始时间。 (以秒为单位)
     * @default 0
     * @version DragonBones 5.0
     */
    position: number;
    /**
     * @language zh_CN
     * 持续时间。 [-1: 使用动画数据默认值, 0: 动画停止, (0~N]: 持续时间] (以秒为单位)
     * @default -1
     * @version DragonBones 5.0
     */
    duration: number;
    /**
     * @language zh_CN
     * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
     * @default 1
     * @version DragonBones 3.0
     */
    timeScale: number;
    /**
     * @language zh_CN
     * 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
     * @default -1
     * @version DragonBones 5.0
     */
    fadeInTime: number;
    /**
     * @language zh_CN
     * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
     * @default -1
     * @version DragonBones 5.0
     */
    autoFadeOutTime: number;
    /**
     * @language zh_CN
     * 淡入缓动方式。
     * @default 0
     * @version DragonBones 5.0
     */
    fadeInEasing: number;
    /**
     * @language zh_CN
     * 权重。
     * @default 1
     * @version DragonBones 5.0
     */
    weight: number;
    /**
     * @language zh_CN
     * 动画状态名。
     * @version DragonBones 5.0
     */
    name: string;
    /**
     * @language zh_CN
     * 动画数据名。
     * @version DragonBones 5.0
     */
    animation: string;
    /**
     * @language zh_CN
     * 混合组，用于动画状态编组，方便控制淡出。
     * @version DragonBones 5.0
     */
    group: string;
    /**
     * @language zh_CN
     * 骨骼遮罩。
     * @version DragonBones 5.0
     */
    boneMask: Array<string>;
    /**
     * @language zh_CN
     * @version DragonBones 5.0
     */
    animationNames: Array<string>;
    /**
     * @internal
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _onClear(): void;
    clear(): void;
    copyFrom(value: AnimationConfig): void;
    containsBoneMask(name: string): boolean;
    addBoneMask(armature: Armature, name: string, recursive?: boolean): void;
    removeBoneMask(armature: Armature, name: string, recursive?: boolean): void;
}
