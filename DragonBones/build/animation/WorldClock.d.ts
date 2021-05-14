import { IAnimateble } from "./IAnimateble";
/**
 * @language zh_CN
 * WorldClock 提供时钟支持，为每个加入到时钟的 IAnimatable 对象更新时间。
 * @see dragonBones.IAnimateble
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 */
export declare class WorldClock implements IAnimateble {
    private static _clock;
    /**
     * @language zh_CN
     * 一个可以直接使用的全局 WorldClock 实例.
     * @version DragonBones 3.0
     */
    static readonly clock: WorldClock;
    /**
     * @language zh_CN
     * 当前时间。 (以秒为单位)
     * @version DragonBones 3.0
     */
    time: number;
    /**
     * @language zh_CN
     * 时间流逝速度，用于控制动画变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
     * @default 1
     * @version DragonBones 3.0
     */
    timeScale: number;
    private _animatebles;
    private _clock;
    /**
     * @language zh_CN
     * 创建一个新的 WorldClock 实例。
     * 通常并不需要单独创建 WorldClock 实例，可以直接使用 WorldClock.clock 静态实例。
     * (创建更多独立的 WorldClock 实例可以更灵活的为需要更新的 IAnimateble 实例分组，用于控制不同组不同的播放速度)
     * @version DragonBones 3.0
     */
    constructor();
    /**
     * @language zh_CN
     * 为所有的 IAnimatable 实例更新时间。
     * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
     * @version DragonBones 3.0
     */
    advanceTime(passedTime: number): void;
    /**
     * 是否包含 IAnimatable 实例
     * @param value IAnimatable 实例。
     * @version DragonBones 3.0
     */
    contains(value: IAnimateble): boolean;
    /**
     * @language zh_CN
     * 添加 IAnimatable 实例。
     * @param value IAnimatable 实例。
     * @version DragonBones 3.0
     */
    add(value: IAnimateble): void;
    /**
     * @language zh_CN
     * 移除 IAnimatable 实例。
     * @param value IAnimatable 实例。
     * @version DragonBones 3.0
     */
    remove(value: IAnimateble): void;
    /**
     * @language zh_CN
     * 清除所有的 IAnimatable 实例。
     * @version DragonBones 3.0
     */
    clear(): void;
    /**
     * @inheritDoc
     */
    clock: WorldClock;
}
