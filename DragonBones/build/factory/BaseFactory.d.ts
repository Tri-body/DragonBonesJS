import { DragonBonesData } from "../model/DragonBonesData";
import { ArmatureData, SkinData, SkinSlotData, DisplayData } from "../model/ArmatureData";
import { ObjectDataParser } from "../parser/ObjectDataParser";
import { Map } from "../core/DragonBones";
import { TextureAtlasData, TextureData } from "../texture/TextureData";
import { DataParser } from "../parser/DataParser";
import { Armature } from "../armature/Armature";
import { Slot } from "../armature/Slot";
/**
 * @private
 */
export declare type BuildArmaturePackage = {
    dataName?: string;
    textureAtlasName?: string;
    data?: DragonBonesData;
    armature?: ArmatureData;
    skin?: SkinData;
};
/**
 * @language zh_CN
 * 创建骨架的基础工厂。 (通常只需要一个全局工厂实例)
 * @see dragonBones.DragonBonesData
 * @see dragonBones.TextureAtlasData
 * @see dragonBones.ArmatureData
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 */
export declare abstract class BaseFactory {
    /**
     * @private
     */
    protected static _defaultParser: ObjectDataParser;
    /**
     * @language zh_CN
     * 是否开启共享搜索。
     * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
     * @see dragonBones.DragonBonesData#autoSearch
     * @see dragonBones.TextureAtlasData#autoSearch
     * @version DragonBones 4.5
     */
    autoSearch: boolean;
    /**
     * @private
     */
    protected _dragonBonesDataMap: Map<DragonBonesData>;
    /**
     * @private
     */
    protected _textureAtlasDataMap: Map<Array<TextureAtlasData>>;
    /**
     * @private
     */
    protected _dataParser: DataParser;
    /**
     * @private
     */
    constructor(dataParser?: DataParser);
    /**
     * @private
     */
    protected _getTextureData(textureAtlasName: string, textureName: string): TextureData;
    /**
     * @private
     */
    protected _fillBuildArmaturePackage(dataPackage: BuildArmaturePackage, dragonBonesName: string, armatureName: string, skinName: string, textureAtlasName: string): boolean;
    /**
     * @private
     */
    protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void;
    /**
     * @private
     */
    protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void;
    /**
     * @private
     */
    protected _replaceSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData, slot: Slot, displayIndex: number): void;
    /**
     * @private
     */
    protected abstract _generateTextureAtlasData(textureAtlasData: TextureAtlasData, textureAtlas: any): TextureAtlasData;
    /**
     * @private
     */
    protected abstract _generateArmature(dataPackage: BuildArmaturePackage): Armature;
    /**
     * @private
     */
    protected abstract _generateSlot(dataPackage: BuildArmaturePackage, skinSlotData: SkinSlotData, armature: Armature): Slot;
    /**
     * @language zh_CN
     * 解析并添加龙骨数据。
     * @param rawData 需要解析的原始数据。 (JSON)
     * @param name 为数据提供一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
     * @returns DragonBonesData
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 4.5
     */
    parseDragonBonesData(rawData: any, name?: string, scale?: number): DragonBonesData;
    /**
     * @language zh_CN
     * 解析并添加贴图集数据。
     * @param rawData 需要解析的原始数据。 (JSON)
     * @param textureAtlas 贴图。
     * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
     * @param scale 为贴图集设置一个缩放值。
     * @returns 贴图集数据
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.TextureAtlasData
     * @version DragonBones 4.5
     */
    parseTextureAtlasData(rawData: any, textureAtlas: any, name?: string, scale?: number): TextureAtlasData;
    /**
     * @language zh_CN
     * 获取指定名称的龙骨数据。
     * @param name 数据名称。
     * @returns DragonBonesData
     * @see #parseDragonBonesData()
     * @see #addDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     */
    getDragonBonesData(name: string): DragonBonesData;
    /**
     * @language zh_CN
     * 添加龙骨数据。
     * @param data 龙骨数据。
     * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #removeDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     */
    addDragonBonesData(data: DragonBonesData, name?: string): void;
    /**
     * @language zh_CN
     * 移除龙骨数据。
     * @param name 数据名称。
     * @param disposeData 是否释放数据。
     * @see #parseDragonBonesData()
     * @see #getDragonBonesData()
     * @see #addDragonBonesData()
     * @see dragonBones.DragonBonesData
     * @version DragonBones 3.0
     */
    removeDragonBonesData(name: string, disposeData?: boolean): void;
    /**
     * @language zh_CN
     * 获取指定名称的贴图集数据列表。
     * @param name 数据名称。
     * @returns 贴图集数据列表。
     * @see #parseTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.textures.TextureAtlasData
     * @version DragonBones 3.0
     */
    getTextureAtlasData(name: string): Array<TextureAtlasData>;
    /**
     * @language zh_CN
     * 添加贴图集数据。
     * @param data 贴图集数据。
     * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #removeTextureAtlasData()
     * @see dragonBones.textures.TextureAtlasData
     * @version DragonBones 3.0
     */
    addTextureAtlasData(data: TextureAtlasData, name?: string): void;
    /**
     * @language zh_CN
     * 移除贴图集数据。
     * @param name 数据名称。
     * @param disposeData 是否释放数据。
     * @see #parseTextureAtlasData()
     * @see #getTextureAtlasData()
     * @see #addTextureAtlasData()
     * @see dragonBones.textures.TextureAtlasData
     * @version DragonBones 3.0
     */
    removeTextureAtlasData(name: string, disposeData?: boolean): void;
    /**
     * @language zh_CN
     * 清除所有的数据。
     * @param disposeData 是否释放数据。
     * @version DragonBones 4.5
     */
    clear(disposeData?: boolean): void;
    /**
     * @language zh_CN
     * 创建一个骨架。
     * @param armatureName 骨架数据名称。
     * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
     * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
     * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据名称。
     * @returns 骨架
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    buildArmature(armatureName: string, dragonBonesName?: string, skinName?: string, textureAtlasName?: string): Armature;
    /**
     * @language zh_CN
     * 将骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
     * @param toArmature 指定的骨架。
     * @param fromArmatreName 其他骨架的名称。
     * @param fromSkinName 其他骨架的皮肤名称，如果未设置，则使用默认皮肤。
     * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称，如果未设置，则检索所有的龙骨数据。
     * @param replaceOriginalAnimation 是否替换原有的同名动画。
     * @returns 是否替换成功。
     * @see dragonBones.Armature
     * @see dragonBones.ArmatureData
     * @version DragonBones 4.5
     */
    copyAnimationsToArmature(toArmature: Armature, fromArmatreName: string, fromSkinName?: string, fromDragonBonesDataName?: string, replaceOriginalAnimation?: boolean): boolean;
    /**
     * @language zh_CN
     * 用指定资源替换指定插槽的显示对象。(用 "dragonBonesName/armatureName/slotName/displayName" 的资源替换 "slot" 的显示对象)
     * @param dragonBonesName 指定的龙骨数据名称。
     * @param armatureName 指定的骨架名称。
     * @param slotName 指定的插槽名称。
     * @param displayName 指定的显示对象名称。
     * @param slot 指定的插槽实例。
     * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
     * @version DragonBones 4.5
     */
    replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex?: number): void;
    /**
     * @language zh_CN
     * 用指定资源列表替换插槽的显示对象列表。
     * @param dragonBonesName 指定的 DragonBonesData 名称。
     * @param armatureName 指定的骨架名称。
     * @param slotName 指定的插槽名称。
     * @param slot 指定的插槽实例。
     * @version DragonBones 4.5
     */
    replaceSlotDisplayList(dragonBonesName: string, armatureName: string, slotName: string, slot: Slot): void;
    /**
     * @private
     */
    getAllDragonBonesData(): Map<DragonBonesData>;
    /**
     * @private
     */
    getAllTextureAtlasData(): Map<Array<TextureAtlasData>>;
}
