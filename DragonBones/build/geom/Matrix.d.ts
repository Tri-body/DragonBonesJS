/**
 * @language zh_CN
 * 2D 矩阵。
 * @version DragonBones 3.0
 */
export declare class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    tx: number;
    ty: number;
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
    /**
     * @private
     */
    toString(): string;
    /**
     * @language zh_CN
     * 复制矩阵。
     * @param value 需要复制的矩阵。
     * @version DragonBones 3.0
     */
    copyFrom(value: Matrix): Matrix;
    /**
     * @private
     */
    copyFromArray(value: Array<number>, offset?: number): Matrix;
    /**
     * @language zh_CN
     * 转换为恒等矩阵。
     * @version DragonBones 3.0
     */
    identity(): Matrix;
    /**
     * @language zh_CN
     * 将当前矩阵与另一个矩阵相乘。
     * @param value 需要相乘的矩阵。
     * @version DragonBones 3.0
     */
    concat(value: Matrix): Matrix;
    /**
     * @language zh_CN
     * 转换为逆矩阵。
     * @version DragonBones 3.0
     */
    invert(): Matrix;
    /**
     * @language zh_CN
     * 将矩阵转换应用于指定点。
     * @param x 横坐标。
     * @param y 纵坐标。
     * @param result 应用转换之后的坐标。
     * @params delta 是否忽略 tx，ty 对坐标的转换。
     * @version DragonBones 3.0
     */
    transformPoint(x: number, y: number, result: {
        x: number;
        y: number;
    }, delta?: boolean): void;
}
