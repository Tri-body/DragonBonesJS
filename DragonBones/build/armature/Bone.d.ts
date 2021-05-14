import { TransformObject } from "./TransformObject";
import { Transform } from "../geom/Transform";
import { Slot } from "./Slot";
import { BoneData } from "../model/ArmatureData";
import { Armature } from "./Armature";
/**
 * @language zh_CN
 * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
 * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
 * @see dragonBones.BoneData
 * @see dragonBones.Armature
 * @see dragonBones.Slot
 * @version DragonBones 3.0
 */
export declare class Bone extends TransformObject {
    /**
     * @private
     */
    static toString(): string;
    /**
     * @private
     */
    ikBendPositive: boolean;
    /**
     * @private
     */
    ikWeight: number;
    private _ikChain;
    private _ikChainIndex;
    private _ik;
    private _transformDirty;
    /**
     * @internal
     * @private
     */
    _childrenTransformDirty: boolean;
    /**
     * @internal
     * @private
     */
    _blendDirty: boolean;
    private _visible;
    private _cachedFrameIndex;
    /**
     * @internal
     * @private
     */
    _blendLayer: number;
    /**
     * @internal
     * @private
     */
    _blendLeftWeight: number;
    /**
     * @internal
     * @private
     */
    _blendTotalWeight: number;
    /**
     * @internal
     * @private
     */
    _animationPose: Transform;
    private _bones;
    private _slots;
    private _boneData;
    /**
     * @internal
     * @private
     */
    /**
     * @internal
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
    private _updateGlobalTransformMatrix;
    /**
     * @private
     */
    private _computeIKA;
    /**
     * @private
     */
    private _computeIKB;
    /**
     * @internal
     * @private
     */
    _init(boneData: BoneData): void;
    /**
     * @internal
     * @private
     */
    _setArmature(value: Armature): void;
    /**
     * @internal
     * @private
     */
    _setIK(value: Bone, chain: number, chainIndex: number): void;
    /**
     * @internal
     * @private
     */
    _update(cacheFrameIndex: number): void;
    /**
     * @language zh_CN
     * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
     * @version DragonBones 3.0
     */
    invalidUpdate(): void;
    /**
     * @language zh_CN
     * 是否包含骨骼或插槽。
     * @returns
     * @see dragonBones.TransformObject
     * @version DragonBones 3.0
     */
    contains(child: TransformObject): boolean;
    /**
     * @language zh_CN
     * 所有的子骨骼。
     * @version DragonBones 3.0
     */
    getBones(): Array<Bone>;
    /**
     * @language zh_CN
     * 所有的插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    getSlots(): Array<Slot>;
    /**
     * @private
     */
    readonly boneData: BoneData;
    /**
     * @language zh_CN
     * 控制此骨骼所有插槽的可见。
     * @default true
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    visible: boolean;
    /**
     * @deprecated
     * @see #boneData
     * @see #dragonBones.BoneData#length
     */
    readonly length: number;
    /**
     * @deprecated
     * @see dragonBones.Armature#getSlot()
     */
    readonly slot: Slot;
    /**
     * @deprecated
     */
    readonly ikChain: number;
    /**
     * @deprecated
     */
    readonly ikChainIndex: number;
    /**
     * @deprecated
     */
    readonly ik: Bone;
}
