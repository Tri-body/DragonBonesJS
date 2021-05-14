import { Armature } from "../armature/Armature";
/**
 * @private
 */
export declare const enum ArmatureType {
    None = -1,
    Armature = 0,
    MovieClip = 1,
    Stage = 2,
}
/**
 * @private
 */
export declare const enum DisplayType {
    None = -1,
    Image = 0,
    Armature = 1,
    Mesh = 2,
    BoundingBox = 3,
}
/**
 * @language zh_CN
 * 包围盒类型。
 * @version DragonBones 5.0
 */
export declare const enum BoundingBoxType {
    None = -1,
    Rectangle = 0,
    Ellipse = 1,
    Polygon = 2,
}
/**
 * @private
 */
export declare const enum EventType {
    None = -1,
    Frame = 10,
    Sound = 11,
}
/**
 * @private
 */
export declare const enum ActionType {
    None = -1,
    Play = 0,
    Fade = 4,
}
/**
 * @private
 */
export declare const enum BlendMode {
    None = -1,
    Normal = 0,
    Add = 1,
    Alpha = 2,
    Darken = 3,
    Difference = 4,
    Erase = 5,
    HardLight = 6,
    Invert = 7,
    Layer = 8,
    Lighten = 9,
    Multiply = 10,
    Overlay = 11,
    Screen = 12,
    Subtract = 13,
}
/**
 * @language zh_CN
 * 动画混合的淡出方式。
 * @version DragonBones 4.5
 */
export declare const enum AnimationFadeOutMode {
    /**
     * @language zh_CN
     * 不淡出动画。
     * @version DragonBones 4.5
     */
    None = 0,
    /**
    * @language zh_CN
     * 淡出同层的动画。
     * @version DragonBones 4.5
     */
    SameLayer = 1,
    /**
     * @language zh_CN
     * 淡出同组的动画。
     * @version DragonBones 4.5
     */
    SameGroup = 2,
    /**
     * @language zh_CN
     * 淡出同层并且同组的动画。
     * @version DragonBones 4.5
     */
    SameLayerAndGroup = 3,
    /**
     * @language zh_CN
     * 淡出所有动画。
     * @version DragonBones 4.5
     */
    All = 4,
}
/**
 * @private
 */
export interface Map<T> {
    [key: string]: T;
}
/**
 * DragonBones
 */
export declare class DragonBones {
    /**
     * @private
     */
    static PI_D: number;
    /**
     * @private
     */
    static PI_H: number;
    /**
     * @private
     */
    static PI_Q: number;
    /**
     * @private
     */
    static ANGLE_TO_RADIAN: number;
    /**
     * @private
     */
    static RADIAN_TO_ANGLE: number;
    /**
     * @private
     */
    static SECOND_TO_MILLISECOND: number;
    /**
     * @internal
     * @private
     */
    static NO_TWEEN: number;
    static VERSION: string;
    /**
     * @internal
     * @private
     */
    static ARGUMENT_ERROR: string;
    /**
     * @private
     */
    static yDown: boolean;
    /**
     * @private
     */
    static debug: boolean;
    /**
     * @private
     */
    static debugDraw: boolean;
    /**
     * @internal
     * @private
     */
    static _armatures: Array<Armature>;
    /**
     * @internal
     * @private
     */
    static hasArmature(value: Armature): boolean;
    /**
     * @internal
     * @private
     */
    static addArmature(value: Armature): void;
    /**
     * @internal
     * @private
     */
    static removeArmature(value: Armature): void;
}
