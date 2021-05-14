"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseObject_1 = require("../core/BaseObject");
var Point_1 = require("../geom/Point");
var Transform_1 = require("../geom/Transform");
var Matrix_1 = require("../geom/Matrix");
/**
 * @language zh_CN
 * 基础变换对象。
 * @version DragonBones 4.5
 */
var TransformObject = /** @class */ (function (_super) {
    tslib_1.__extends(TransformObject, _super);
    /**
     * @internal
     * @private
     */
    function TransformObject() {
        var _this = _super.call(this) || this;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的矩阵。
         * @readOnly
         * @version DragonBones 3.0
         */
        _this.globalTransformMatrix = new Matrix_1.Matrix();
        /**
         * @language zh_CN
         * 相对于骨架坐标系的变换。
         * @see dragonBones.Transform
         * @readOnly
         * @version DragonBones 3.0
         */
        _this.global = new Transform_1.Transform();
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        _this.offset = new Transform_1.Transform();
        return _this;
    }
    /**
     * @private
     */
    TransformObject.prototype._onClear = function () {
        this.name = null;
        this.global.identity();
        this.offset.identity();
        this.globalTransformMatrix.identity();
        this.origin = null;
        this.userData = null;
        this._armature = null;
        this._parent = null;
        this._globalDirty = false;
    };
    /**
     * @internal
     * @private
     */
    TransformObject.prototype._setArmature = function (value) {
        this._armature = value;
    };
    /**
     * @internal
     * @private
     */
    TransformObject.prototype._setParent = function (value) {
        this._parent = value;
    };
    /**
     * @private
     */
    TransformObject.prototype.updateGlobalTransform = function () {
        if (this._globalDirty) {
            this._globalDirty = false;
            this.global.fromMatrix(this.globalTransformMatrix);
        }
    };
    Object.defineProperty(TransformObject.prototype, "armature", {
        /**
         * @language zh_CN
         * 所属的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        get: function () {
            return this._armature;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransformObject.prototype, "parent", {
        /**
         * @language zh_CN
         * 所属的父骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    TransformObject._helpPoint = new Point_1.Point();
    /**
     * @private
     */
    TransformObject._helpTransform = new Transform_1.Transform();
    /**
     * @private
     */
    TransformObject._helpMatrix = new Matrix_1.Matrix();
    return TransformObject;
}(BaseObject_1.BaseObject));
exports.TransformObject = TransformObject;
