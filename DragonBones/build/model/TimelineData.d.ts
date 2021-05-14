import { FrameData, ZOrderFrameData, BoneFrameData, SlotFrameData, ExtensionFrameData } from "./FrameData";
import { BaseObject } from "../core/BaseObject";
import { Transform } from "../geom/Transform";
import { BoneData, SlotData, SkinData, SkinSlotData, DisplayData } from "./ArmatureData";
/**
 * @private
 */
export declare abstract class TimelineData<T extends FrameData<T>> extends BaseObject {
    /**
     * @private
     */
    static toString(): string;
    scale: number;
    /**
     * @private
     */
    offset: number;
    /**
     * @private
     */
    frames: Array<T>;
    /**
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class ZOrderTimelineData extends TimelineData<ZOrderFrameData> {
    static toString(): string;
}
/**
 * @private
 */
export declare class BoneTimelineData extends TimelineData<BoneFrameData> {
    static toString(): string;
    originalTransform: Transform;
    bone: BoneData;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class SlotTimelineData extends TimelineData<SlotFrameData> {
    static toString(): string;
    slot: SlotData;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class FFDTimelineData extends TimelineData<ExtensionFrameData> {
    static toString(): string;
    skin: SkinData;
    slot: SkinSlotData;
    display: DisplayData;
    constructor();
    protected _onClear(): void;
}
