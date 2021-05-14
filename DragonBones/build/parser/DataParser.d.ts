import { ArmatureType, DisplayType, BoundingBoxType, BlendMode, ActionType } from "../core/DragonBones";
import { Point } from "../geom/Point";
import { Transform } from "../geom/Transform";
import { Matrix } from "../geom/Matrix";
import { BoneData, ArmatureData, SkinData, SkinSlotData } from "../model/ArmatureData";
import { DragonBonesData, ActionData, EventData } from "../model/DragonBonesData";
import { AnimationData } from "../model/AnimationData";
import { TextureAtlasData } from "../texture/TextureData";
/**
 * @private
 */
export declare abstract class DataParser {
    protected static DATA_VERSION_2_3: string;
    protected static DATA_VERSION_3_0: string;
    protected static DATA_VERSION_4_0: string;
    protected static DATA_VERSION_4_5: string;
    protected static DATA_VERSION_5_0: string;
    protected static DATA_VERSION: string;
    protected static DATA_VERSIONS: Array<string>;
    protected static TEXTURE_ATLAS: string;
    protected static SUB_TEXTURE: string;
    protected static FORMAT: string;
    protected static IMAGE_PATH: string;
    protected static WIDTH: string;
    protected static HEIGHT: string;
    protected static ROTATED: string;
    protected static FRAME_X: string;
    protected static FRAME_Y: string;
    protected static FRAME_WIDTH: string;
    protected static FRAME_HEIGHT: string;
    protected static DRADON_BONES: string;
    protected static ARMATURE: string;
    protected static BONE: string;
    protected static IK: string;
    protected static SLOT: string;
    protected static SKIN: string;
    protected static DISPLAY: string;
    protected static ANIMATION: string;
    protected static Z_ORDER: string;
    protected static FFD: string;
    protected static FRAME: string;
    protected static ACTIONS: string;
    protected static EVENTS: string;
    protected static INTS: string;
    protected static FLOATS: string;
    protected static STRINGS: string;
    protected static PIVOT: string;
    protected static TRANSFORM: string;
    protected static AABB: string;
    protected static COLOR: string;
    protected static VERSION: string;
    protected static COMPATIBLE_VERSION: string;
    protected static FRAME_RATE: string;
    protected static TYPE: string;
    protected static SUB_TYPE: string;
    protected static NAME: string;
    protected static PARENT: string;
    protected static TARGET: string;
    protected static SHARE: string;
    protected static PATH: string;
    protected static LENGTH: string;
    protected static DISPLAY_INDEX: string;
    protected static BLEND_MODE: string;
    protected static INHERIT_TRANSLATION: string;
    protected static INHERIT_ROTATION: string;
    protected static INHERIT_SCALE: string;
    protected static INHERIT_REFLECTION: string;
    protected static INHERIT_ANIMATION: string;
    protected static INHERIT_FFD: string;
    protected static BEND_POSITIVE: string;
    protected static CHAIN: string;
    protected static WEIGHT: string;
    protected static FADE_IN_TIME: string;
    protected static PLAY_TIMES: string;
    protected static SCALE: string;
    protected static OFFSET: string;
    protected static POSITION: string;
    protected static DURATION: string;
    protected static TWEEN_TYPE: string;
    protected static TWEEN_EASING: string;
    protected static TWEEN_ROTATE: string;
    protected static TWEEN_SCALE: string;
    protected static CURVE: string;
    protected static EVENT: string;
    protected static SOUND: string;
    protected static ACTION: string;
    protected static DEFAULT_ACTIONS: string;
    protected static X: string;
    protected static Y: string;
    protected static SKEW_X: string;
    protected static SKEW_Y: string;
    protected static SCALE_X: string;
    protected static SCALE_Y: string;
    protected static ALPHA_OFFSET: string;
    protected static RED_OFFSET: string;
    protected static GREEN_OFFSET: string;
    protected static BLUE_OFFSET: string;
    protected static ALPHA_MULTIPLIER: string;
    protected static RED_MULTIPLIER: string;
    protected static GREEN_MULTIPLIER: string;
    protected static BLUE_MULTIPLIER: string;
    protected static UVS: string;
    protected static VERTICES: string;
    protected static TRIANGLES: string;
    protected static WEIGHTS: string;
    protected static SLOT_POSE: string;
    protected static BONE_POSE: string;
    protected static COLOR_TRANSFORM: string;
    protected static TIMELINE: string;
    protected static IS_GLOBAL: string;
    protected static PIVOT_X: string;
    protected static PIVOT_Y: string;
    protected static Z: string;
    protected static LOOP: string;
    protected static AUTO_TWEEN: string;
    protected static HIDE: string;
    protected static DEFAULT_NAME: string;
    protected static _getArmatureType(value: string): ArmatureType;
    protected static _getDisplayType(value: string): DisplayType;
    protected static _getBoundingBoxType(value: string): BoundingBoxType;
    protected static _getBlendMode(value: string): BlendMode;
    protected static _getActionType(value: string): ActionType;
    protected _isOldData: boolean;
    protected _isGlobalTransform: boolean;
    protected _isAutoTween: boolean;
    protected _animationTweenEasing: number;
    protected _timelinePivot: Point;
    protected _helpPoint: Point;
    protected _helpTransformA: Transform;
    protected _helpTransformB: Transform;
    protected _helpMatrix: Matrix;
    protected _rawBones: Array<BoneData>;
    protected _data: DragonBonesData;
    protected _armature: ArmatureData;
    protected _skin: SkinData;
    protected _skinSlotData: SkinSlotData;
    protected _animation: AnimationData;
    protected _timeline: any;
    constructor();
    /**
     * @private
     */
    abstract parseDragonBonesData(rawData: any, scale: number): DragonBonesData;
    /**
     * @private
     */
    abstract parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number): void;
    private _getTimelineFrameMatrix(animation, timeline, position, transform);
    protected _globalToLocal(armature: ArmatureData): void;
    protected _mergeFrameToAnimationTimeline(framePostion: number, actions: Array<ActionData>, events: Array<EventData>): void;
    /**
     * @deprecated
     * @see dragonBones.BaseFactory#parseDragonBonesData()
     */
    static parseDragonBonesData(rawData: any): DragonBonesData;
    /**
     * @deprecated
     * @see dragonBones.BaseFactory#parsetTextureAtlasData()
     */
    static parseTextureAtlasData(rawData: any, scale?: number): any;
}
