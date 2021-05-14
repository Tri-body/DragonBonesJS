/**
 * @language zh_CN
 * 基础对象。
 * @version DragonBones 4.5
 */
export declare abstract class BaseObject {
    private static _hashCode;
    private static _defaultMaxCount;
    private static _maxCountMap;
    private static _poolsMap;
    private static _returnObject;
    /**
     * @language zh_CN
     * 设置每种对象池的最大缓存数量。
     * @param objectConstructor 对象类。
     * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
     * @version DragonBones 4.5
     */
    static setMaxCount(objectConstructor: typeof BaseObject, maxCount: number): void;
    /**
     * @language zh_CN
     * 清除对象池缓存的对象。
     * @param objectConstructor 对象类。 (不设置则清除所有缓存)
     * @version DragonBones 4.5
     */
    static clearPool(objectConstructor?: typeof BaseObject): void;
    /**
     * @language zh_CN
     * 从对象池中创建指定对象。
     * @param objectConstructor 对象类。
     * @version DragonBones 4.5
     */
    static borrowObject<T extends BaseObject>(objectConstructor: {
        new (): T;
    }): T;
    /**
     * @language zh_CN
     * 对象的唯一标识。
     * @version DragonBones 4.5
     */
    hashCode: number;
    private _isInPool;
    /**
     * @internal
     * @private
     */
    constructor();
    /**
     * @private
     */
    protected abstract _onClear(): void;
    /**
     * @language zh_CN
     * 清除数据并返还对象池。
     * @version DragonBones 4.5
     */
    returnToPool(): void;
}
