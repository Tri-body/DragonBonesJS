import { TransformObject } from "./TransformObject";
import { BlendMode } from "../core/DragonBones";
import { Matrix } from "../geom/Matrix";
import { ColorTransform } from "../geom/ColorTransform";
import { Armature } from "./Armature";
import { TextureData } from "../texture/TextureData";
import { DisplayData, SkinSlotData, MeshData, BoundingBoxData } from "../model/ArmatureData";
import { Bone } from "./Bone";
/**
 * @language zh_CN
 * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
 * 一个骨骼上可以包含多个插槽。
 * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
 * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
 * @see dragonBones.Armature
 * @see dragonBones.Bone
 * @see dragonBones.SlotData
 * @version DragonBones 3.0
 */
export declare abstract class Slot extends TransformObject {
    /**
     * @language zh_CN
     * 显示对象受到控制的动画状态或混合组名称，设置为 null 则表示受所有的动画状态控制。
     * @default null
     * @see dragonBones.AnimationState#displayControl
     * @see dragonBones.AnimationState#name
     * @see dragonBones.AnimationState#group
     * @version DragonBones 4.5
     */
    displayController: string;
    /**
     * @private
     */
    protected _displayDirty: boolean;
    /**
     * @private
     */
    protected _zOrderDirty: boolean;
    /**
     * @private
     */
    protected _blendModeDirty: boolean;
    /**
     * @internal
     * @private
     */
    _colorDirty: boolean;
    /**
     * @internal
     * @private
     */
    _meshDirty: boolean;
    /**
     * @private
     */
    protected _transformDirty: boolean;
    /**
     * @private
     */
    protected _blendMode: BlendMode;
    /**
     * @private
     */
    protected _displayIndex: number;
    /**
     * @private
     */
    _zOrder: number;
    /**
     * @private
     */
    protected _cachedFrameIndex: number;
    /**
     * @private
     */
    _pivotX: number;
    /**
     * @private
     */
    _pivotY: number;
    /**
     * @private
     */
    protected _localMatrix: Matrix;
    /**
     * @private
     */
    _colorTransform: ColorTransform;
    /**
     * @private
     */
    _ffdVertices: Array<number>;
    /**
     * @private
     */
    protected _displayList: Array<any | Armature>;
    /**
     * @private
     */
    _textureDatas: Array<TextureData>;
    /**
     * @private
     */
    _replacedDisplayDatas: Array<DisplayData>;
    /**
     * @private
     */
    protected _meshBones: Array<Bone>;
    /**
     * @private
     */
    protected _skinSlotData: SkinSlotData;
    /**
     * @private
     */
    protected _displayData: DisplayData;
    /**
     * @private
     */
    protected _replacedDisplayData: DisplayData;
    /**
     * @private
     */
    protected _textureData: TextureData;
    /**
     * @private
     */
    _meshData: MeshData;
    /**
     * @private
     */
    protected _boundingBoxData: BoundingBoxData;
    /**
     * @private
     */
    protected _rawDisplay: any;
    /**
     * @private
     */
    protected _meshDisplay: any;
    /**
     * @private
     */
    protected _display: any;
    /**
     * @private
     */
    protected _childArmature: Armature;
    /**
     * @private
     */
    _cachedFrameIndices: Array<number>;
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
    protected abstract _initDisplay(value: any): void;
    /**
     * @private
     */
    protected abstract _disposeDisplay(value: any): void;
    /**
     * @private
     */
    protected abstract _onUpdateDisplay(): void;
    /**
     * @private
     */
    protected abstract _addDisplay(): void;
    /**
     * @private
     */
    protected abstract _replaceDisplay(value: any): void;
    /**
     * @private
     */
    protected abstract _removeDisplay(): void;
    /**
     * @private
     */
    protected abstract _updateZOrder(): void;
    /**
     * @internal
     * @private
     */
    abstract _updateVisible(): void;
    /**
     * @private
     */
    protected abstract _updateBlendMode(): void;
    /**
     * @private
     */
    protected abstract _updateColor(): void;
    /**
     * @private
     */
    protected abstract _updateFrame(): void;
    /**
     * @private
     */
    protected abstract _updateMesh(): void;
    /**
     * @private
     */
    protected abstract _updateTransform(isSkinnedMesh: boolean): void;
    /**
     * @private
     */
    protected _isMeshBonesUpdate(): boolean;
    /**
     * @private
     */
    protected _updateDisplayData(): void;
    /**
     * @private
     */
    protected _updateDisplay(): void;
    /**
     * @private
     */
    protected _updateGlobalTransformMatrix(isCache: boolean): void;
    /**
     * @private
     */
    _init(skinSlotData: SkinSlotData, rawDisplay: any, meshDisplay: any): void;
    /**
     * @internal
     * @private
     */
    _setArmature(value: Armature): void;
    /**
     * @internal
     * @private
     */
    _update(cacheFrameIndex: number): void;
    /**
     * @private
     */
    _updateTransformAndMatrix(): void;
    /**
     * @private Factory
     */
    _setDisplayList(value: Array<any>): boolean;
    /**
     * @internal
     * @private
     */
    _setDisplayIndex(value: number): boolean;
    /**
     * @internal
     * @private
     */
    _setZorder(value: number): boolean;
    /**
     * @internal
     * @private
     */
    _setColor(value: ColorTransform): boolean;
    /**
     * @language zh_CN
     * 判断指定的点是否在插槽的自定义包围盒内。
     * @param x 点的水平坐标。（骨架内坐标系）
     * @param y 点的垂直坐标。（骨架内坐标系）
     * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
     * @version DragonBones 5.0
     */
    containsPoint(x: number, y: number): boolean;
    /**
     * @language zh_CN
     * 判断指定的线段与插槽的自定义包围盒是否相交。
     * @param xA 线段起点的水平坐标。（骨架内坐标系）
     * @param yA 线段起点的垂直坐标。（骨架内坐标系）
     * @param xB 线段终点的水平坐标。（骨架内坐标系）
     * @param yB 线段终点的垂直坐标。（骨架内坐标系）
     * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
     * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
     * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
     * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
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
    /**
     * @language zh_CN
     * 在下一帧更新显示对象的状态。
     * @version DragonBones 4.5
     */
    invalidUpdate(): void;
    /**
     * @private
     */
    readonly skinSlotData: SkinSlotData;
    /**
     * @language zh_CN
     * 插槽此时的自定义包围盒数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    readonly boundingBoxData: BoundingBoxData;
    /**
     * @private
     */
    readonly rawDisplay: any;
    /**
     * @private
     */
    readonly meshDisplay: any;
    /**
     * @language zh_CN
     * 此时显示的显示对象在显示列表中的索引。
     * @version DragonBones 4.5
     */
    displayIndex: number;
    /**
     * @language zh_CN
     * 包含显示对象或子骨架的显示列表。
     * @version DragonBones 3.0
     */
    displayList: Array<any>;
    /**
     * @language zh_CN
     * 此时显示的显示对象。
     * @version DragonBones 3.0
     */
    display: any;
    /**
     * @language zh_CN
     * 此时显示的子骨架。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    childArmature: Armature;
    /**
     * @deprecated
     * @see #display
     */
    getDisplay(): any;
    /**
     * @deprecated
     * @see #display
     */
    setDisplay(value: any): void;
}
