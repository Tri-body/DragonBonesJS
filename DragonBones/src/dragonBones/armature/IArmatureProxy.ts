import { IEventDispatcher } from "../event/IEventDispatcher";
import { Armature } from "./Armature";
import { Animation } from "../animation/Animation";

/**
 * @language zh_CN
 * 骨架代理接口。
 * @version DragonBones 5.0
 */
export interface IArmatureProxy extends IEventDispatcher {
    /**
     * @private
     */
    _onClear(): void;
    /**
     * @private
     */
    _debugDraw(isEnabled: boolean): void;
    /**
     * @language zh_CN
     * 释放代理和骨架。 (骨架会回收到对象池)
     * @version DragonBones 4.5
     */
    dispose(disposeProxy: boolean): void;
    /**
     * @language zh_CN
     * 获取骨架。
     * @readOnly
     * @see dragonBones.Armature
     * @version DragonBones 4.5
     */
    armature: Armature;
    /**
     * @language zh_CN
     * 获取动画控制器。
     * @readOnly
     * @see dragonBones.Animation
     * @version DragonBones 4.5
     */
    animation: Animation;
}