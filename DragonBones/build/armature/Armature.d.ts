import { BaseObject } from "../core/BaseObject";
import { IAnimateble } from "../animation/IAnimateble";
import { Slot } from "./Slot";
import { Bone } from "./Bone";
import { ActionData } from "../model/DragonBonesData";
import { EventObject } from "../event/EventObject";
import { ArmatureData, SkinData } from "../model/ArmatureData";
import { IArmatureProxy } from "./IArmatureProxy";
import { IEventDispatcher, EventStringType } from "../event/IEventDispatcher";
import { WorldClock } from "../animation/WorldClock";
import { TextureAtlasData } from "../texture/TextureData";
import { Animation } from "../animation/Animation";
/**
 * @language zh_CN
 * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
 * @see dragonBones.ArmatureData
 * @see dragonBones.Bone
 * @see dragonBones.Slot
 * @see dragonBones.Animation
 * @version DragonBones 3.0
 */
export declare class Armature extends BaseObject implements IAnimateble {
    /**
     * @private
     */
    static toString(): string;
    private static _onSortSlots(a, b);
    /**
     * @language zh_CN
     * 是否继承父骨架的动画状态。
     * @default true
     * @version DragonBones 4.5
     */
    inheritAnimation: boolean;
    /**
     * @private
     */
    debugDraw: boolean;
    /**
     * @language zh_CN
     * 用于存储临时数据。
     * @version DragonBones 3.0
     */
    userData: any;
    private _debugDraw;
    private _delayDispose;
    private _lockDispose;
    /**
     * @internal
     * @private
     */
    _bonesDirty: boolean;
    private _slotsDirty;
    private _zOrderDirty;
    private _flipX;
    private _flipY;
    private _bones;
    private _slots;
    private _actions;
    private _events;
    /**
     * @private
     */
    _armatureData: ArmatureData;
    /**
     * @private
     */
    _skinData: SkinData;
    private _animation;
    private _proxy;
    private _display;
    private _eventManager;
    /**
     * @internal
     * @private
     */
    _parent: Slot;
    private _clock;
    /**
     * @private
     */
    _replaceTextureAtlasData: TextureAtlasData;
    private _replacedTexture;
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
    private _doAction(value);
    /**
     * @private
     */
    _init(armatureData: ArmatureData, skinData: SkinData, proxy: IArmatureProxy, display: any, eventManager: IEventDispatcher): void;
    /**
     * @internal
     * @private
     */
    _addBoneToBoneList(value: Bone): void;
    /**
     * @internal
     * @private
     */
    _removeBoneFromBoneList(value: Bone): void;
    /**
     * @internal
     * @private
     */
    _addSlotToSlotList(value: Slot): void;
    /**
     * @internal
     * @private
     */
    _removeSlotFromSlotList(value: Slot): void;
    /**
     * @private
     */
    _sortZOrder(slotIndices: Array<number>): void;
    /**
     * @private
     */
    _bufferAction(value: ActionData): void;
    /**
     * @internal
     * @private
     */
    _bufferEvent(value: EventObject, type: string): void;
    /**
     * @language zh_CN
     * 释放骨架。 (回收到对象池)
     * @version DragonBones 3.0
     */
    dispose(): void;
    /**
     * @language zh_CN
     * 更新骨架和动画。
     * @param passedTime 两帧之间的时间间隔。 (以秒为单位)
     * @see dragonBones.IAnimateble
     * @see dragonBones.WorldClock
     * @version DragonBones 3.0
     */
    advanceTime(passedTime: number): void;
    /**
     * @language zh_CN
     * 更新骨骼和插槽。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
     * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
     * @param updateSlotDisplay 是否更新插槽的显示对象。
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    invalidUpdate(boneName?: string, updateSlotDisplay?: boolean): void;
    /**
     * @language zh_CN
     * 判断点是否在所有插槽的自定义包围盒内。
     * @param x 点的水平坐标。（骨架内坐标系）
     * @param y 点的垂直坐标。（骨架内坐标系）
     * @version DragonBones 5.0
     */
    containsPoint(x: number, y: number): Slot;
    /**
     * @language zh_CN
     * 判断线段是否与骨架的所有插槽的自定义包围盒相交。
     * @param xA 线段起点的水平坐标。（骨架内坐标系）
     * @param yA 线段起点的垂直坐标。（骨架内坐标系）
     * @param xB 线段终点的水平坐标。（骨架内坐标系）
     * @param yB 线段终点的垂直坐标。（骨架内坐标系）
     * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
     * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
     * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
     * @returns 线段从起点到终点相交的第一个自定义包围盒的插槽。
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
    }): Slot;
    /**
     * @language zh_CN
     * 获取指定名称的骨骼。
     * @param name 骨骼的名称。
     * @returns 骨骼。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    getBone(name: string): Bone;
    /**
     * @language zh_CN
     * 通过显示对象获取骨骼。
     * @param display 显示对象。
     * @returns 包含这个显示对象的骨骼。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    getBoneByDisplay(display: any): Bone;
    /**
     * @language zh_CN
     * 获取插槽。
     * @param name 插槽的名称。
     * @returns 插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    getSlot(name: string): Slot;
    /**
     * @language zh_CN
     * 通过显示对象获取插槽。
     * @param display 显示对象。
     * @returns 包含这个显示对象的插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    getSlotByDisplay(display: any): Slot;
    /**
     * @deprecated
     */
    addBone(value: Bone, parentName?: string): void;
    /**
     * @deprecated
     */
    removeBone(value: Bone): void;
    /**
     * @deprecated
     */
    addSlot(value: Slot, parentName: string): void;
    /**
     * @deprecated
     */
    removeSlot(value: Slot): void;
    /**
     * @language zh_CN
     * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图类型。
     * @param texture 贴图。
     * @version DragonBones 4.5
     */
    replaceTexture(texture: any): void;
    /**
     * @language zh_CN
     * 获取所有骨骼。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    getBones(): Array<Bone>;
    /**
     * @language zh_CN
     * 获取所有插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    getSlots(): Array<Slot>;
    /**
     * @language zh_CN
     * 骨架名称。
     * @see dragonBones.ArmatureData#name
     * @version DragonBones 3.0
     */
    readonly name: string;
    /**
     * @language zh_CN
     * 获取骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 4.5
     */
    readonly armatureData: ArmatureData;
    /**
     * @language zh_CN
     * 获得动画控制器。
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     */
    readonly animation: Animation;
    /**
     * @language zh_CN
     * 获取事件监听器。
     * @version DragonBones 5.0
     */
    readonly eventDispatcher: IEventDispatcher;
    /**
     * @language zh_CN
     * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
     * @version DragonBones 3.0
     */
    readonly display: any;
    /**
     * @language zh_CN
     * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
     * @see dragonBones.Slot
     * @version DragonBones 4.5
     */
    readonly parent: Slot;
    flipX: boolean;
    flipY: boolean;
    /**
     * @language zh_CN
     * 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
     * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
     * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
     * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
     * @see dragonBones.DragonBonesData#frameRate
     * @see dragonBones.ArmatureData#frameRate
     * @version DragonBones 4.5
     */
    cacheFrameRate: number;
    /**
     * @inheritDoc
     */
    clock: WorldClock;
    /**
     * @language zh_CN
     * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
     * @version DragonBones 4.5
     */
    replacedTexture: any;
    /**
     * @deprecated
     * @see dragonBones.Armature#eventDispatcher
     */
    hasEventListener(type: EventStringType): boolean;
    /**
     * @deprecated
     * @see dragonBones.Armature#eventDispatcher
     */
    addEventListener(type: EventStringType, listener: Function, target: any): void;
    /**
     * @deprecated
     * @see dragonBones.Armature#eventDispatcher
     */
    removeEventListener(type: EventStringType, listener: Function, target: any): void;
    /**
     * @deprecated
     * @see #cacheFrameRate
     */
    enableAnimationCache(frameRate: number): void;
    /**
     * @deprecated
     * @see #display
     */
    getDisplay(): any;
    /**
     * @deprecated
     * @see #cacheFrameRate
     */
    enableCache: boolean;
}
