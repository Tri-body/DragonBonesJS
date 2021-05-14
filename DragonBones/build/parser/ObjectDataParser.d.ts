import { DataParser } from "./DataParser";
import { ArmatureData, BoneData, SlotData, SkinData, SkinSlotData, DisplayData, MeshData, BoundingBoxData } from "../model/ArmatureData";
import { AnimationData } from "../model/AnimationData";
import { BoneTimelineData, SlotTimelineData, FFDTimelineData, TimelineData } from "../model/TimelineData";
import { BoneFrameData, SlotFrameData, AnimationFrameData, ZOrderFrameData, ExtensionFrameData, TweenFrameData, FrameData } from "../model/FrameData";
import { ActionData, EventData, DragonBonesData } from "../model/DragonBonesData";
import { Transform } from "../geom/Transform";
import { ColorTransform } from "../geom/ColorTransform";
import { TextureAtlasData } from "../texture/TextureData";
/**
 * @private
 */
export declare class ObjectDataParser extends DataParser {
    /**
     * @private
     */
    protected static _getBoolean(rawData: any, key: string, defaultValue: boolean): boolean;
    /**
     * @private
     */
    protected static _getNumber(rawData: any, key: string, defaultValue: number): number;
    /**
     * @private
     */
    protected static _getString(rawData: any, key: string, defaultValue: string): string;
    /**
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _parseArmature(rawData: any, scale: number): ArmatureData;
    /**
     * @private
     */
    protected _parseBone(rawData: any): BoneData;
    /**
     * @private
     */
    protected _parseIK(rawData: any): void;
    /**
     * @private
     */
    protected _parseSlot(rawData: any, zOrder: number): SlotData;
    /**
     * @private
     */
    protected _parseSkin(rawData: any): SkinData;
    /**
     * @private
     */
    protected _parseSkinSlotData(rawData: any): SkinSlotData;
    /**
     * @private
     */
    protected _parseDisplay(rawData: any): DisplayData;
    /**
     * @private
     */
    protected _parseMesh(rawData: any): MeshData;
    /**
     * @private
     */
    protected _parseBoundingBox(rawData: any): BoundingBoxData;
    /**
     * @private
     */
    protected _parseAnimation(rawData: any): AnimationData;
    /**
     * @private
     */
    protected _parseBoneTimeline(rawData: any): BoneTimelineData;
    /**
     * @private
     */
    protected _parseSlotTimeline(rawData: any): SlotTimelineData;
    /**
     * @private
     */
    protected _parseFFDTimeline(rawData: any): FFDTimelineData;
    /**
     * @private
     */
    protected _parseAnimationFrame(rawData: any, frameStart: number, frameCount: number): AnimationFrameData;
    /**
     * @private
     */
    protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): ZOrderFrameData;
    /**
     * @private
     */
    protected _parseBoneFrame(rawData: any, frameStart: number, frameCount: number): BoneFrameData;
    /**
     * @private
     */
    protected _parseSlotFrame(rawData: any, frameStart: number, frameCount: number): SlotFrameData;
    /**
     * @private
     */
    protected _parseFFDFrame(rawData: any, frameStart: number, frameCount: number): ExtensionFrameData;
    /**
     * @private
     */
    protected _parseTweenFrame<T extends TweenFrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void;
    /**
     * @private
     */
    protected _parseFrame<T extends FrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void;
    /**
     * @private
     */
    protected _parseTimeline<T extends FrameData<T>>(rawData: any, timeline: TimelineData<T>, frameParser: (rawData: any, frameStart: number, frameCount: number) => T): void;
    /**
     * @private
     */
    protected _parseActionData(rawData: any, actions: Array<ActionData>, bone: BoneData, slot: SlotData): void;
    /**
     * @private
     */
    protected _parseEventData(rawData: any, events: Array<EventData>, bone: BoneData, slot: SlotData): void;
    /**
     * @private
     */
    protected _parseTransform(rawData: any, transform: Transform): void;
    /**
     * @private
     */
    protected _parseColorTransform(rawData: any, color: ColorTransform): void;
    /**
     * @inheritDoc
     */
    parseDragonBonesData(rawData: any, scale?: number): DragonBonesData;
    /**
     * @inheritDoc
     */
    parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale?: number): void;
    /**
     * @private
     */
    private static _instance;
    /**
     * @deprecated
     * @see dragonBones.BaseFactory#parseDragonBonesData()
     */
    static getInstance(): ObjectDataParser;
}
