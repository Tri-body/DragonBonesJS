import { BaseObject } from "../core/BaseObject";
import { EventStringType } from "./IEventDispatcher";
import { AnimationFrameData } from "../model/FrameData";
import { CustomData } from "../model/DragonBonesData";
import { Armature } from "../armature/Armature";
import { Bone } from "../armature/Bone";
import { Slot } from "../armature/Slot";
import { AnimationState } from "../animation/AnimationState";
/**
 * @language zh_CN
 * 事件数据。
 * @version DragonBones 4.5
 */
export declare class EventObject extends BaseObject {
    /**
     * @language zh_CN
     * 动画开始。
     * @version DragonBones 4.5
     */
    static START: string;
    /**
     * @language zh_CN
     * 动画循环播放一次完成。
     * @version DragonBones 4.5
     */
    static LOOP_COMPLETE: string;
    /**
     * @language zh_CN
     * 动画播放完成。
     * @version DragonBones 4.5
     */
    static COMPLETE: string;
    /**
     * @language zh_CN
     * 动画淡入开始。
     * @version DragonBones 4.5
     */
    static FADE_IN: string;
    /**
     * @language zh_CN
     * 动画淡入完成。
     * @version DragonBones 4.5
     */
    static FADE_IN_COMPLETE: string;
    /**
     * @language zh_CN
     * 动画淡出开始。
     * @version DragonBones 4.5
     */
    static FADE_OUT: string;
    /**
     * @language zh_CN
     * 动画淡出完成。
     * @version DragonBones 4.5
     */
    static FADE_OUT_COMPLETE: string;
    /**
     * @language zh_CN
     * 动画帧事件。
     * @version DragonBones 4.5
     */
    static FRAME_EVENT: string;
    /**
     * @language zh_CN
     * 动画声音事件。
     * @version DragonBones 4.5
     */
    static SOUND_EVENT: string;
    /**
     * @private
     */
    static toString(): string;
    /**
     * @language zh_CN
     * 事件类型。
     * @version DragonBones 4.5
     */
    type: EventStringType;
    /**
     * @language zh_CN
     * 事件名称。 (帧标签的名称或声音的名称)
     * @version DragonBones 4.5
     */
    name: string;
    /**
     * @private
     */
    frame: AnimationFrameData;
    /**
     * @language zh_CN
     * 自定义数据
     * @see dragonBones.CustomData
     * @version DragonBones 5.0
     */
    data: CustomData;
    /**
     * @language zh_CN
     * 发出事件的骨架。
     * @version DragonBones 4.5
     */
    armature: Armature;
    /**
     * @language zh_CN
     * 发出事件的骨骼。
     * @version DragonBones 4.5
     */
    bone: Bone;
    /**
     * @language zh_CN
     * 发出事件的插槽。
     * @version DragonBones 4.5
     */
    slot: Slot;
    /**
     * @language zh_CN
     * 发出事件的动画状态。
     * @version DragonBones 4.5
     */
    animationState: AnimationState;
    /**
     * @internal
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _onClear(): void;
}
