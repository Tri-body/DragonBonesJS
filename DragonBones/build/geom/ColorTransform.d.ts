/**
 * @private
 */
export declare class ColorTransform {
    alphaMultiplier: number;
    redMultiplier: number;
    greenMultiplier: number;
    blueMultiplier: number;
    alphaOffset: number;
    redOffset: number;
    greenOffset: number;
    blueOffset: number;
    constructor(alphaMultiplier?: number, redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaOffset?: number, redOffset?: number, greenOffset?: number, blueOffset?: number);
    copyFrom(value: ColorTransform): void;
    identity(): void;
}
