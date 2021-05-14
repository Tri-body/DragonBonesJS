"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseObject_1 = require("../core/BaseObject");
var DragonBones_1 = require("../core/DragonBones");
var Rectangle_1 = require("../geom/Rectangle");
/**
 * @language zh_CN
 * 贴图集数据。
 * @version DragonBones 3.0
 */
var TextureAtlasData = /** @class */ (function (_super) {
    __extends(TextureAtlasData, _super);
    /**
     * @internal
     * @private
     */
    function TextureAtlasData() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.textures = {};
        return _this;
    }
    /**
     * @private
     */
    TextureAtlasData.prototype._onClear = function () {
        for (var k in this.textures) {
            this.textures[k].returnToPool();
            delete this.textures[k];
        }
        this.autoSearch = false;
        this.scale = 1.0;
        this.width = 0.0;
        this.height = 0.0;
        //this.textures.clear();
        this.name = null;
        this.imagePath = null;
    };
    /**
     * @private
     */
    TextureAtlasData.prototype.addTexture = function (value) {
        if (value && value.name && !this.textures[value.name]) {
            this.textures[value.name] = value;
            value.parent = this;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @private
     */
    TextureAtlasData.prototype.getTexture = function (name) {
        return this.textures[name];
    };
    /**
     * @private
     */
    TextureAtlasData.prototype.copyFrom = function (value) {
        this.autoSearch = value.autoSearch;
        this.scale = value.scale;
        this.width = value.width;
        this.height = value.height;
        this.name = value.name;
        this.imagePath = value.imagePath;
        for (var k in this.textures) {
            this.textures[k].returnToPool();
            delete this.textures[k];
        }
        for (var k in value.textures) {
            var texture = this.generateTexture();
            texture.copyFrom(value.textures[k]);
            this.textures[k] = texture;
        }
    };
    return TextureAtlasData;
}(BaseObject_1.BaseObject));
exports.TextureAtlasData = TextureAtlasData;
/**
 * @private
 */
var TextureData = /** @class */ (function (_super) {
    __extends(TextureData, _super);
    function TextureData() {
        var _this = _super.call(this) || this;
        _this.region = new Rectangle_1.Rectangle();
        return _this;
    }
    TextureData.generateRectangle = function () {
        return new Rectangle_1.Rectangle();
    };
    TextureData.prototype._onClear = function () {
        this.rotated = false;
        this.name = null;
        this.region.clear();
        this.frame = null;
        this.parent = null;
    };
    TextureData.prototype.copyFrom = function (value) {
        this.rotated = value.rotated;
        this.name = value.name;
        if (!this.frame && value.frame) {
            this.frame = TextureData.generateRectangle();
        }
        else if (this.frame && !value.frame) {
            this.frame = null;
        }
        if (this.frame && value.frame) {
            this.frame.copyFrom(value.frame);
        }
        this.parent = value.parent;
        this.region.copyFrom(value.region);
    };
    return TextureData;
}(BaseObject_1.BaseObject));
exports.TextureData = TextureData;
