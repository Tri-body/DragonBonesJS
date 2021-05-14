import { BaseObject } from "../core/BaseObject";
import { ActionData, EventData } from "./DragonBonesData";
import { Transform } from "../geom/Transform";
import { ColorTransform } from "../geom/ColorTransform";
/**
 * @private
 */
export declare abstract class FrameData<T> extends BaseObject {
    position: number;
    duration: number;
    prev: T;
    next: T;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare abstract class TweenFrameData<T> extends FrameData<T> {
    private static _getCurvePoint;
    static samplingEasingCurve(curve: Array<number>, samples: Array<number>): void;
    tweenEasing: number;
    curve: Array<number>;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class AnimationFrameData extends FrameData<AnimationFrameData> {
    static toString(): string;
    actions: Array<ActionData>;
    events: Array<EventData>;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class ZOrderFrameData extends FrameData<ZOrderFrameData> {
    zOrder: Array<number>;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class BoneFrameData extends TweenFrameData<BoneFrameData> {
    static toString(): string;
    tweenScale: boolean;
    tweenRotate: number;
    transform: Transform;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class SlotFrameData extends TweenFrameData<SlotFrameData> {
    static DEFAULT_COLOR: ColorTransform;
    static generateColor(): ColorTransform;
    static toString(): string;
    displayIndex: number;
    color: ColorTransform;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class ExtensionFrameData extends TweenFrameData<ExtensionFrameData> {
    static toString(): string;
    tweens: Array<number>;
    constructor();
    protected _onClear(): void;
}
