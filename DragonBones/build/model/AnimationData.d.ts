import { TimelineData, BoneTimelineData, SlotTimelineData, FFDTimelineData } from "./TimelineData";
import { AnimationFrameData, ZOrderFrameData } from "./FrameData";
import { Map } from "../core/DragonBones";
/**
 * @language zh_CN
 * 动画数据。
 * @version DragonBones 3.0
 */
export declare class AnimationData extends TimelineData<AnimationFrameData> {
    /**
     * @private
     */
    static toString(): string;
    /**
     * @language zh_CN
     * 持续的帧数。
     * @version DragonBones 3.0
     */
    frameCount: number;
    /**
     * @language zh_CN
     * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
     * @version DragonBones 3.0
     */
    playTimes: number;
    /**
     * @language zh_CN
     * 持续时间。 (以秒为单位)
     * @version DragonBones 3.0
     */
    duration: number;
    /**
     * @language zh_CN
     * 淡入时间。 (以秒为单位)
     * @version DragonBones 3.0
     */
    fadeInTime: number;
    /**
     * @private
     */
    cacheFrameRate: number;
    /**
     * @language zh_CN
     * 数据名称。
     * @version DragonBones 3.0
     */
    name: string;
    /**
     * @private
     */
    zOrderTimeline: TimelineData<ZOrderFrameData>;
    /**
     * @private
     */
    boneTimelines: Map<BoneTimelineData>;
    /**
     * @private
     */
    slotTimelines: Map<SlotTimelineData>;
    /**
     * @private
     */
    ffdTimelines: Map<Map<Map<FFDTimelineData>>>;
    /**
     * @private
     */
    cachedFrames: Array<boolean>;
    /**
     * @private
     */
    boneCachedFrameIndices: Map<Array<number>>;
    /**
     * @private
     */
    slotCachedFrameIndices: Map<Array<number>>;
    /**
     * @internal
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _onClear(): void;
    /**
     * @private
     */
    cacheFrames(frameRate: number): void;
    /**
     * @private
     */
    addBoneTimeline(value: BoneTimelineData): void;
    /**
     * @private
     */
    addSlotTimeline(value: SlotTimelineData): void;
    /**
     * @private
     */
    addFFDTimeline(value: FFDTimelineData): void;
    /**
     * @private
     */
    getBoneTimeline(name: string): BoneTimelineData;
    /**
     * @private
     */
    getSlotTimeline(name: string): SlotTimelineData;
    /**
     * @private
     */
    getFFDTimeline(skinName: string, slotName: string): Map<FFDTimelineData>;
    /**
     * @private
     */
    getBoneCachedFrameIndices(name: string): Array<number>;
    /**
     * @private
     */
    getSlotCachedFrameIndices(name: string): Array<number>;
}
