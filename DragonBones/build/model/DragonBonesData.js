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
/**
 * @language zh_CN
 * 自定义数据。
 * @version DragonBones 5.0
 */
var CustomData = /** @class */ (function (_super) {
    __extends(CustomData, _super);
    /**
     * @internal
     * @private
     */
    function CustomData() {
        var _this = _super.call(this) || this;
        /**
         * @language zh_CN
         * 自定义整数。
         * @version DragonBones 5.0
         */
        _this.ints = [];
        /**
         * @language zh_CN
         * 自定义浮点数。
         * @version DragonBones 5.0
         */
        _this.floats = [];
        /**
         * @language zh_CN
         * 自定义字符串。
         * @version DragonBones 5.0
         */
        _this.strings = [];
        return _this;
    }
    /**
     * @private
     */
    CustomData.toString = function () {
        return "[class dragonBones.CustomData]";
    };
    /**
     * @private
     */
    CustomData.prototype._onClear = function () {
        this.ints.length = 0;
        this.floats.length = 0;
        this.strings.length = 0;
    };
    /**
     * @language zh_CN
     * 获取自定义整数。
     * @version DragonBones 5.0
     */
    CustomData.prototype.getInt = function (index) {
        if (index === void 0) { index = 0; }
        return index >= 0 && index < this.ints.length ? this.ints[index] : 0;
    };
    /**
     * @language zh_CN
     * 获取自定义浮点数。
     * @version DragonBones 5.0
     */
    CustomData.prototype.getFloat = function (index) {
        if (index === void 0) { index = 0; }
        return index >= 0 && index < this.floats.length ? this.floats[index] : 0;
    };
    /**
     * @language zh_CN
     * 获取自定义字符串。
     * @version DragonBones 5.0
     */
    CustomData.prototype.getString = function (index) {
        if (index === void 0) { index = 0; }
        return index >= 0 && index < this.strings.length ? this.strings[index] : null;
    };
    return CustomData;
}(BaseObject_1.BaseObject));
exports.CustomData = CustomData;
/**
 * @private
 */
var EventData = /** @class */ (function (_super) {
    __extends(EventData, _super);
    function EventData() {
        return _super.call(this) || this;
    }
    EventData.toString = function () {
        return "[class dragonBones.EventData]";
    };
    EventData.prototype._onClear = function () {
        if (this.data) {
            this.data.returnToPool();
        }
        this.type = -1 /* None */;
        this.name = null;
        this.bone = null;
        this.slot = null;
        this.data = null;
    };
    return EventData;
}(BaseObject_1.BaseObject));
exports.EventData = EventData;
/**
 * @private
 */
var ActionData = /** @class */ (function (_super) {
    __extends(ActionData, _super);
    function ActionData() {
        return _super.call(this) || this;
    }
    ActionData.toString = function () {
        return "[class dragonBones.ActionData]";
    };
    ActionData.prototype._onClear = function () {
        if (this.animationConfig) {
            this.animationConfig.returnToPool();
        }
        this.type = -1 /* None */;
        this.bone = null;
        this.slot = null;
        this.animationConfig = null;
    };
    return ActionData;
}(BaseObject_1.BaseObject));
exports.ActionData = ActionData;
/**
 * @language zh_CN
 * 龙骨数据。
 * 一个龙骨数据包含多个骨架数据。
 * @see dragonBones.ArmatureData
 * @version DragonBones 3.0
 */
var DragonBonesData = /** @class */ (function (_super) {
    __extends(DragonBonesData, _super);
    /**
     * @internal
     * @private
     */
    function DragonBonesData() {
        var _this = _super.call(this) || this;
        /**
         * @language zh_CN
         * 所有骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        _this.armatures = {};
        /**
         * @private
         */
        _this.cachedFrames = [];
        _this._armatureNames = [];
        return _this;
    }
    /**
     * @private
     */
    DragonBonesData.toString = function () {
        return "[class dragonBones.DragonBonesData]";
    };
    /**
     * @private
     */
    DragonBonesData.prototype._onClear = function () {
        if (DragonBones_1.DragonBones.debug) {
            for (var i = 0, l = DragonBones_1.DragonBones._armatures.length; i < l; ++i) {
                var armature = DragonBones_1.DragonBones._armatures[i];
                if (armature.armatureData.parent === this) {
                    throw new Error("The DragonBonesData is being used, please make sure all armature references to the data have been deleted.");
                }
            }
        }
        for (var k in this.armatures) {
            this.armatures[k].returnToPool();
            delete this.armatures[k];
        }
        if (this.userData) {
            this.userData.returnToPool();
        }
        this.autoSearch = false;
        this.frameRate = 0;
        this.version = null;
        this.name = null;
        //this.armatures.clear();
        this.cachedFrames.length = 0;
        this.userData = null;
        this._armatureNames.length = 0;
    };
    /**
     * @private
     */
    DragonBonesData.prototype.addArmature = function (value) {
        if (value && value.name && !this.armatures[value.name]) {
            this.armatures[value.name] = value;
            this._armatureNames.push(value.name);
            value.parent = this;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @language zh_CN
     * 获取骨架。
     * @param name 骨架数据名称。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    DragonBonesData.prototype.getArmature = function (name) {
        return this.armatures[name];
    };
    Object.defineProperty(DragonBonesData.prototype, "armatureNames", {
        /**
         * @language zh_CN
         * 所有骨架数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         */
        get: function () {
            return this._armatureNames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @deprecated
     * @see dragonBones.BaseFactory#removeDragonBonesData()
     */
    DragonBonesData.prototype.dispose = function () {
        this.returnToPool();
    };
    return DragonBonesData;
}(BaseObject_1.BaseObject));
exports.DragonBonesData = DragonBonesData;
