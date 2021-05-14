import { Matrix } from "./Matrix";
/**
 * @language zh_CN
 * 2D 变换。
 * @version DragonBones 3.0
 */
export declare class Transform {
    /**
     * @language zh_CN
     * 水平位移。
     * @version DragonBones 3.0
     */
    x: number;
    /**
     * @language zh_CN
     * 垂直位移。
     * @version DragonBones 3.0
     */
    y: number;
    /**
     * @language zh_CN
     * 水平倾斜。 (以弧度为单位)
     * @version DragonBones 3.0
     */
    skewX: number;
    /**
     * @language zh_CN
     * 垂直倾斜。 (以弧度为单位)
     * @version DragonBones 3.0
     */
    skewY: number;
    /**
     * @language zh_CN
     * 水平缩放。
     * @version DragonBones 3.0
     */
    scaleX: number;
    /**
     * @language zh_CN
     * 垂直缩放。
     * @version DragonBones 3.0
     */
    scaleY: number;
    /**
     * @private
     */
    static normalizeRadian(value: number): number;
    constructor(
        /**
         * @language zh_CN
         * 水平位移。
         * @version DragonBones 3.0
         */
        x?: number, 
        /**
         * @language zh_CN
         * 垂直位移。
         * @version DragonBones 3.0
         */
        y?: number, 
        /**
         * @language zh_CN
         * 水平倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewX?: number, 
        /**
         * @language zh_CN
         * 垂直倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewY?: number, 
        /**
         * @language zh_CN
         * 水平缩放。
         * @version DragonBones 3.0
         */
        scaleX?: number, 
        /**
         * @language zh_CN
         * 垂直缩放。
         * @version DragonBones 3.0
         */
        scaleY?: number);
    /**
     * @private
     */
    toString(): string;
    /**
     * @private
     */
    copyFrom(value: Transform): Transform;
    /**
     * @private
     */
    identity(): Transform;
    /**
     * @private
     */
    add(value: Transform): Transform;
    /**
     * @private
     */
    minus(value: Transform): Transform;
    /**
     * @language zh_CN
     * 矩阵转换为变换。
     * @param 矩阵。
     * @version DragonBones 3.0
     */
    fromMatrix(matrix: Matrix): Transform;
    /**
     * @language zh_CN
     * 转换为矩阵。
     * @param 矩阵。
     * @version DragonBones 3.0
     */
    toMatrix(matrix: Matrix): Transform;
    /**
     * @language zh_CN
     * 旋转。 (以弧度为单位)
     * @version DragonBones 3.0
     */
    rotation: number;
}
