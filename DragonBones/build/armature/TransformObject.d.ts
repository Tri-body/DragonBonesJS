import { BaseObject } from "../core/BaseObject";
import { Point } from "../geom/Point";
import { Transform } from "../geom/Transform";
import { Matrix } from "../geom/Matrix";
import { Armature } from "./Armature";
import { Bone } from "./Bone";
/**
 * @language zh_CN
 * 基础变换对象。
 * @version DragonBones 4.5
 */
export declare abstract class TransformObject extends BaseObject {
    /**
     * @private
     */
    protected static _helpPoint: Point;
    /**
     * @private
     */
    protected static _helpTransform: Transform;
    /**
     * @private
     */
    protected static _helpMatrix: Matrix;
    /**
     * @language zh_CN
     * 对象的名称。
     * @readOnly
     * @version DragonBones 3.0
     */
    name: string;
    /**
     * @language zh_CN
     * 相对于骨架坐标系的矩阵。
     * @readOnly
     * @version DragonBones 3.0
     */
    globalTransformMatrix: Matrix;
    /**
     * @language zh_CN
     * 相对于骨架坐标系的变换。
     * @see dragonBones.Transform
     * @readOnly
     * @version DragonBones 3.0
     */
    global: Transform;
    /**
     * @language zh_CN
     * 相对于骨架或父骨骼坐标系的偏移变换。
     * @see dragonBones.Transform
     * @version DragonBones 3.0
     */
    offset: Transform;
    /**
     * @language zh_CN
     * 相对于骨架或父骨骼坐标系的绑定变换。
     * @readOnly
     * @see dragonBones.Transform
     * @version DragonBones 3.0
     */
    origin: Transform;
    /**
     * @language zh_CN
     * 可以用于存储临时数据。
     * @version DragonBones 3.0
     */
    userData: any;
    /**
     * @private
     */
    _armature: Armature;
    /**
     * @private
     */
    _parent: Bone;
    /**
     * @private
     */
    protected _globalDirty: boolean;
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
     * @internal
     * @private
     */
    _setArmature(value: Armature): void;
    /**
     * @internal
     * @private
     */
    _setParent(value: Bone): void;
    /**
     * @private
     */
    updateGlobalTransform(): void;
    /**
     * @language zh_CN
     * 所属的骨架。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    readonly armature: Armature;
    /**
     * @language zh_CN
     * 所属的父骨骼。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    readonly parent: Bone;
}
