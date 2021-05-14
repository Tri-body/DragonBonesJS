import { BaseObject } from "../core/BaseObject";
import { Map } from "../core/DragonBones";
import { Rectangle } from "../geom/Rectangle";
/**
 * @language zh_CN
 * 贴图集数据。
 * @version DragonBones 3.0
 */
export declare abstract class TextureAtlasData extends BaseObject {
    /**
     * @language zh_CN
     * 是否开启共享搜索。
     * @default false
     * @version DragonBones 4.5
     */
    autoSearch: boolean;
    /**
     * @language zh_CN
     * 贴图集缩放系数。
     * @version DragonBones 3.0
     */
    scale: number;
    /**
     * @private
     */
    width: number;
    /**
     * @private
     */
    height: number;
    /**
     * @language zh_CN
     * 贴图集名称。
     * @version DragonBones 3.0
     */
    name: string;
    /**
     * @language zh_CN
     * 贴图集图片路径。
     * @version DragonBones 3.0
     */
    imagePath: string;
    /**
     * @private
     */
    textures: Map<TextureData>;
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
    abstract generateTexture(): TextureData;
    /**
     * @private
     */
    addTexture(value: TextureData): void;
    /**
     * @private
     */
    getTexture(name: string): TextureData;
    /**
     * @private
     */
    copyFrom(value: TextureAtlasData): void;
}
/**
 * @private
 */
export declare abstract class TextureData extends BaseObject {
    static generateRectangle(): Rectangle;
    rotated: boolean;
    name: string;
    region: Rectangle;
    frame: Rectangle;
    parent: TextureAtlasData;
    constructor();
    protected _onClear(): void;
    copyFrom(value: TextureData): void;
}
