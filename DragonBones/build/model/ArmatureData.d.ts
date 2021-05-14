import { BaseObject } from "../core/BaseObject";
import { ArmatureType, Map, BlendMode, DisplayType, BoundingBoxType } from "../core/DragonBones";
import { Rectangle } from "../geom/Rectangle";
import { AnimationData } from "./AnimationData";
import { ActionData, DragonBonesData, CustomData } from "./DragonBonesData";
import { Matrix } from "../geom/Matrix";
import { Transform } from "../geom/Transform";
import { ColorTransform } from "../geom/ColorTransform";
import { Point } from "../geom/Point";
import { TextureData } from "../texture/TextureData";
/**
 * @language zh_CN
 * 骨架数据。
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 */
export declare class ArmatureData extends BaseObject {
    /**
     * @private
     */
    static toString(): string;
    private static _onSortSlots(a, b);
    /**
     * @private
     */
    isRightTransform: boolean;
    /**
     * @language zh_CN
     * 动画帧率。
     * @version DragonBones 3.0
     */
    frameRate: number;
    /**
     * @private
     */
    type: ArmatureType;
    /**
     * @private
     */
    cacheFrameRate: number;
    /**
     * @private
     */
    scale: number;
    /**
     * @language zh_CN
     * 数据名称。
     * @version DragonBones 3.0
     */
    name: string;
    /**
     * @private
     */
    aabb: Rectangle;
    /**
     * @language zh_CN
     * 所有骨骼数据。
     * @see dragonBones.BoneData
     * @version DragonBones 3.0
     */
    bones: Map<BoneData>;
    /**
     * @language zh_CN
     * 所有插槽数据。
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    slots: Map<SlotData>;
    /**
     * @private
     */
    skins: Map<SkinData>;
    /**
     * @language zh_CN
     * 所有动画数据。
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    animations: Map<AnimationData>;
    /**
     * @private
     */
    actions: Array<ActionData>;
    /**
     * @language zh_CN
     * 所属的龙骨数据。
     * @see dragonBones.DragonBonesData
     * @version DragonBones 4.5
     */
    parent: DragonBonesData;
    /**
     * @private
     */
    userData: CustomData;
    private _boneDirty;
    private _slotDirty;
    private _animationNames;
    private _sortedBones;
    private _sortedSlots;
    private _bonesChildren;
    private _defaultSkin;
    private _defaultAnimation;
    /**
     * @internal
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected _onClear(): void;
    private _sortBones();
    private _sortSlots();
    /**
     * @private
     */
    cacheFrames(frameRate: number): void;
    /**
     * @private
     */
    setCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset?: number): number;
    /**
     * @private
     */
    getCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset: number): void;
    /**
     * @private
     */
    addBone(value: BoneData, parentName: string): void;
    /**
     * @private
     */
    addSlot(value: SlotData): void;
    /**
     * @private
     */
    addSkin(value: SkinData): void;
    /**
     * @private
     */
    addAnimation(value: AnimationData): void;
    /**
     * @language zh_CN
     * 获取骨骼数据。
     * @param name 骨骼数据名称。
     * @see dragonBones.BoneData
     * @version DragonBones 3.0
     */
    getBone(name: string): BoneData;
    /**
     * @language zh_CN
     * 获取插槽数据。
     * @param name 插槽数据名称。
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    getSlot(name: string): SlotData;
    /**
     * @private
     */
    getSkin(name: string): SkinData;
    /**
     * @language zh_CN
     * 获取动画数据。
     * @param name 动画数据名称。
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    getAnimation(name: string): AnimationData;
    /**
     * @language zh_CN
     * 所有动画数据名称。
     * @see #armatures
     * @version DragonBones 3.0
     */
    readonly animationNames: Array<string>;
    /**
     * @private
     */
    readonly sortedBones: Array<BoneData>;
    /**
     * @private
     */
    readonly sortedSlots: Array<SlotData>;
    /**
     * @private
     */
    readonly defaultSkin: SkinData;
    /**
     * @language zh_CN
     * 获取默认动画数据。
     * @see dragonBones.AnimationData
     * @version DragonBones 4.5
     */
    readonly defaultAnimation: AnimationData;
}
/**
 * @language zh_CN
 * 骨骼数据。
 * @see dragonBones.Bone
 * @version DragonBones 3.0
 */
export declare class BoneData extends BaseObject {
    /**
     * @private
     */
    static toString(): string;
    /**
     * @private
     */
    inheritTranslation: boolean;
    /**
     * @private
     */
    inheritRotation: boolean;
    /**
     * @private
     */
    inheritScale: boolean;
    /**
     * @private
     */
    inheritReflection: boolean;
    /**
     * @private
     */
    bendPositive: boolean;
    /**
     * @private
     */
    chain: number;
    /**
     * @private
     */
    chainIndex: number;
    /**
     * @private
     */
    weight: number;
    /**
     * @private
     */
    length: number;
    /**
     * @language zh_CN
     * 数据名称。
     * @version DragonBones 3.0
     */
    name: string;
    /**
     * @private
     */
    transform: Transform;
    /**
     * @language zh_CN
     * 所属的父骨骼数据。
     * @version DragonBones 3.0
     */
    parent: BoneData;
    /**
     * @private
     */
    ik: BoneData;
    /**
     * @private
     */
    userData: CustomData;
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
/**
 * @language zh_CN
 * 插槽数据。
 * @see dragonBones.Slot
 * @version DragonBones 3.0
 */
export declare class SlotData extends BaseObject {
    /**
     * @private
     */
    static DEFAULT_COLOR: ColorTransform;
    /**
     * @private
     */
    static generateColor(): ColorTransform;
    /**
     * @private
     */
    static toString(): string;
    /**
     * @private
     */
    displayIndex: number;
    /**
     * @private
     */
    zOrder: number;
    /**
     * @private
     */
    blendMode: BlendMode;
    /**
     * @language zh_CN
     * 数据名称。
     * @version DragonBones 3.0
     */
    name: string;
    /**
     * @private
     */
    actions: Array<ActionData>;
    /**
     * @language zh_CN
     * 所属的父骨骼数据。
     * @see dragonBones.BoneData
     * @version DragonBones 3.0
     */
    parent: BoneData;
    /**
     * @private
     */
    color: ColorTransform;
    /**
     * @private
     */
    userData: CustomData;
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
/**
 * @private
 */
export declare class SkinData extends BaseObject {
    static toString(): string;
    name: string;
    slots: Map<SkinSlotData>;
    constructor();
    protected _onClear(): void;
    addSlot(value: SkinSlotData): void;
    getSlot(name: string): SkinSlotData;
}
/**
 * @private
 */
export declare class SkinSlotData extends BaseObject {
    static toString(): string;
    displays: Array<DisplayData>;
    meshs: Map<MeshData>;
    slot: SlotData;
    constructor();
    protected _onClear(): void;
    getDisplay(name: string): DisplayData;
    addMesh(value: MeshData): void;
    getMesh(name: string): MeshData;
}
/**
 * @private
 */
export declare class DisplayData extends BaseObject {
    static toString(): string;
    isRelativePivot: boolean;
    type: DisplayType;
    inheritAnimation: boolean;
    name: string;
    path: string;
    share: string;
    pivot: Point;
    transform: Transform;
    texture: TextureData;
    armature: ArmatureData;
    mesh: MeshData;
    boundingBox: BoundingBoxData;
    constructor();
    protected _onClear(): void;
}
/**
 * @private
 */
export declare class MeshData extends BaseObject {
    static toString(): string;
    skinned: boolean;
    name: string;
    slotPose: Matrix;
    uvs: Array<number>;
    vertices: Array<number>;
    vertexIndices: Array<number>;
    boneIndices: Array<Array<number>>;
    weights: Array<Array<number>>;
    boneVertices: Array<Array<number>>;
    bones: Array<BoneData>;
    inverseBindPose: Array<Matrix>;
    constructor();
    protected _onClear(): void;
}
/**
 * @language zh_CN
 * 自定义包围盒数据。
 * @version DragonBones 5.0
 */
export declare class BoundingBoxData extends BaseObject {
    /**
     * @private
     */
    static toString(): string;
    /**
     * Compute the bit code for a point (x, y) using the clip rectangle
     */
    private static _computeOutCode(x, y, xMin, yMin, xMax, yMax);
    /**
     * @private
     */
    static segmentIntersectsRectangle(xA: number, yA: number, xB: number, yB: number, xMin: number, yMin: number, xMax: number, yMax: number, intersectionPointA?: {
        x: number;
        y: number;
    }, intersectionPointB?: {
        x: number;
        y: number;
    }, normalRadians?: {
        x: number;
        y: number;
    }): number;
    /**
     * @private
     */
    static segmentIntersectsEllipse(xA: number, yA: number, xB: number, yB: number, xC: number, yC: number, widthH: number, heightH: number, intersectionPointA?: {
        x: number;
        y: number;
    }, intersectionPointB?: {
        x: number;
        y: number;
    }, normalRadians?: {
        x: number;
        y: number;
    }): number;
    /**
     * @private
     */
    static segmentIntersectsPolygon(xA: number, yA: number, xB: number, yB: number, vertices: Array<number>, intersectionPointA?: {
        x: number;
        y: number;
    }, intersectionPointB?: {
        x: number;
        y: number;
    }, normalRadians?: {
        x: number;
        y: number;
    }): number;
    /**
     * @language zh_CN
     * 包围盒类型。
     * @see dragonBones.BoundingBoxType
     * @version DragonBones 5.0
     */
    type: BoundingBoxType;
    /**
     * @language zh_CN
     * 包围盒颜色。
     * @version DragonBones 5.0
     */
    color: number;
    x: number;
    y: number;
    width: number;
    height: number;
    /**
     * @language zh_CN
     * 自定义多边形顶点。
     * @version DragonBones 5.0
     */
    vertices: Array<number>;
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
     * 是否包含点。
     * @version DragonBones 5.0
     */
    containsPoint(pX: number, pY: number): boolean;
    /**
     * @language zh_CN
     * 是否与线段相交。
     * @version DragonBones 5.0
     */
    intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
        x: number;
        y: number;
    }, intersectionPointB?: {
        x: number;
        y: number;
    }, normalRadians?: {
        x: number;
        y: number;
    }): number;
}
