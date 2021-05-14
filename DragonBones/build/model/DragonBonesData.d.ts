import { BaseObject } from "../core/BaseObject";
import { EventType, ActionType, Map } from "../core/DragonBones";
import { BoneData, SlotData, ArmatureData } from "./ArmatureData";
import { AnimationConfig } from "./AnimationConfig";
/**
 * @language zh_CN
 * 自定义数据。
 * @version DragonBones 5.0
 */
export declare class CustomData extends BaseObject {
    /**
     * @private
     */
    static toString(): string;
    /**
     * @language zh_CN
     * 自定义整数。
     * @version DragonBones 5.0
     */
    ints: Array<number>;
    /**
     * @language zh_CN
     * 自定义浮点数。
     * @version DragonBones 5.0
     */
    floats: Array<number>;
    /**
     * @language zh_CN
     * 自定义字符串。
     * @version DragonBones 5.0
     */
    strings: Array<string>;
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
     * @language zh_CN
     * 获取自定义整数。
     * @version DragonBones 5.0
     */
    getInt(index?: number): number;
    /**
     * @language zh_CN
     * 获取自定义浮点数。
     * @version DragonBones 5.0
     */
    getFloat(index?: number): number;
    /**
     * @language zh_CN
     * 获取自定义字符串。
     * @version DragonBones 5.0
     */
    getString(index?: number): string;
}
/**
 * @private
 */
export declare class EventData extends BaseObject {
    static toString(): string;
    type: EventType;
    name: string;
    bone: BoneData;
    slot: SlotData;
    data: CustomData;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class ActionData extends BaseObject {
    static toString(): string;
    type: ActionType;
    bone: BoneData;
    slot: SlotData;
    animationConfig: AnimationConfig;
    constructor();
    protected _onClear(): void;
}
/**
 * @language zh_CN
 * 龙骨数据。
 * 一个龙骨数据包含多个骨架数据。
 * @see dragonBones.ArmatureData
 * @version DragonBones 3.0
 */
export declare class DragonBonesData extends BaseObject {
    /**
     * @private
     */
    static toString(): string;
    /**
     * @language zh_CN
     * 是否开启共享搜索。
     * @default false
     * @version DragonBones 4.5
     */
    autoSearch: boolean;
    /**
     * @language zh_CN
     * 动画帧频。
     * @version DragonBones 3.0
     */
    frameRate: number;
    /**
     * @private
     */
    version: string;
    /**
     * @language zh_CN
     * 数据名称。
     * @version DragonBones 3.0
     */
    name: string;
    /**
     * @language zh_CN
     * 所有骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    armatures: Map<ArmatureData>;
    /**
     * @private
     */
    cachedFrames: Array<number>;
    /**
     * @private
     */
    userData: CustomData;
    private _armatureNames;
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
    addArmature(value: ArmatureData): void;
    /**
     * @language zh_CN
     * 获取骨架。
     * @param name 骨架数据名称。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    getArmature(name: string): ArmatureData;
    /**
     * @language zh_CN
     * 所有骨架数据名称。
     * @see #armatures
     * @version DragonBones 3.0
     */
    readonly armatureNames: Array<string>;
    /**
     * @deprecated
     * @see dragonBones.BaseFactory#removeDragonBonesData()
     */
    dispose(): void;
}
