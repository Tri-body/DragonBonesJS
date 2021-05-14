"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseObject_1 = require("../core/BaseObject");
var DragonBones_1 = require("../core/DragonBones");
var Rectangle_1 = require("../geom/Rectangle");
var Matrix_1 = require("../geom/Matrix");
var Transform_1 = require("../geom/Transform");
var ColorTransform_1 = require("../geom/ColorTransform");
var Point_1 = require("../geom/Point");
/**
 * @language zh_CN
 * 骨架数据。
 * @see dragonBones.Armature
 * @version DragonBones 3.0
 */
var ArmatureData = /** @class */ (function (_super) {
    tslib_1.__extends(ArmatureData, _super);
    /**
     * @internal
     * @private
     */
    function ArmatureData() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.aabb = new Rectangle_1.Rectangle();
        /**
         * @language zh_CN
         * 所有骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        _this.bones = {};
        /**
         * @language zh_CN
         * 所有插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        _this.slots = {};
        /**
         * @private
         */
        _this.skins = {};
        /**
         * @language zh_CN
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        _this.animations = {};
        /**
         * @private
         */
        _this.actions = [];
        _this._animationNames = [];
        _this._sortedBones = [];
        _this._sortedSlots = [];
        _this._bonesChildren = {};
        return _this;
    }
    /**
     * @private
     */
    ArmatureData.toString = function () {
        return "[class dragonBones.ArmatureData]";
    };
    ArmatureData._onSortSlots = function (a, b) {
        return a.zOrder > b.zOrder ? 1 : -1;
    };
    /**
     * @private
     */
    ArmatureData.prototype._onClear = function () {
        for (var k in this.bones) {
            this.bones[k].returnToPool();
            delete this.bones[k];
        }
        for (var k in this.slots) {
            this.slots[k].returnToPool();
            delete this.slots[k];
        }
        for (var k in this.skins) {
            this.skins[k].returnToPool();
            delete this.skins[k];
        }
        for (var k in this.animations) {
            this.animations[k].returnToPool();
            delete this.animations[k];
        }
        for (var i = 0, l = this.actions.length; i < l; ++i) {
            this.actions[i].returnToPool();
        }
        for (var k in this._bonesChildren) {
            delete this._bonesChildren[k];
        }
        if (this.userData) {
            this.userData.returnToPool();
        }
        this.isRightTransform = false;
        this.frameRate = 0;
        this.type = -1 /* None */;
        this.cacheFrameRate = 0;
        this.scale = 1.0;
        this.name = null;
        this.aabb.clear();
        //this.bones.clear();
        //this.slots.clear();
        //this.skins.clear();
        //this.animations.clear();
        this.actions.length = 0;
        this.parent = null;
        this.userData = null;
        this._boneDirty = false;
        this._slotDirty = false;
        this._animationNames.length = 0;
        this._sortedBones.length = 0;
        this._sortedSlots.length = 0;
        this._defaultSkin = null;
        this._defaultAnimation = null;
    };
    ArmatureData.prototype._sortBones = function () {
        var total = this._sortedBones.length;
        if (total < 1) {
            return;
        }
        var sortHelper = this._sortedBones.concat();
        var index = 0;
        var count = 0;
        this._sortedBones.length = 0;
        while (count < total) {
            var bone = sortHelper[index++];
            if (index >= total) {
                index = 0;
            }
            if (this._sortedBones.indexOf(bone) >= 0) {
                continue;
            }
            if (bone.parent && this._sortedBones.indexOf(bone.parent) < 0) {
                continue;
            }
            if (bone.ik && this._sortedBones.indexOf(bone.ik) < 0) {
                continue;
            }
            if (bone.ik && bone.chain > 0 && bone.chainIndex === bone.chain) {
                this._sortedBones.splice(this._sortedBones.indexOf(bone.parent) + 1, 0, bone);
            }
            else {
                this._sortedBones.push(bone);
            }
            count++;
        }
    };
    ArmatureData.prototype._sortSlots = function () {
        this._sortedSlots.sort(ArmatureData._onSortSlots);
    };
    /**
     * @private
     */
    ArmatureData.prototype.cacheFrames = function (frameRate) {
        if (this.cacheFrameRate > 0) {
            return;
        }
        this.cacheFrameRate = frameRate;
        for (var k in this.animations) {
            this.animations[k].cacheFrames(this.cacheFrameRate);
        }
    };
    /**
     * @private
     */
    ArmatureData.prototype.setCacheFrame = function (globalTransformMatrix, transform, arrayOffset) {
        if (arrayOffset === void 0) { arrayOffset = -1; }
        var dataArray = this.parent.cachedFrames;
        if (arrayOffset < 0) {
            arrayOffset = dataArray.length;
        }
        dataArray.length += 10;
        dataArray[arrayOffset] = globalTransformMatrix.a;
        dataArray[arrayOffset + 1] = globalTransformMatrix.b;
        dataArray[arrayOffset + 2] = globalTransformMatrix.c;
        dataArray[arrayOffset + 3] = globalTransformMatrix.d;
        dataArray[arrayOffset + 4] = globalTransformMatrix.tx;
        dataArray[arrayOffset + 5] = globalTransformMatrix.ty;
        dataArray[arrayOffset + 6] = transform.skewX;
        dataArray[arrayOffset + 7] = transform.skewY;
        dataArray[arrayOffset + 8] = transform.scaleX;
        dataArray[arrayOffset + 9] = transform.scaleY;
        return arrayOffset;
    };
    /**
     * @private
     */
    ArmatureData.prototype.getCacheFrame = function (globalTransformMatrix, transform, arrayOffset) {
        var dataArray = this.parent.cachedFrames;
        globalTransformMatrix.a = dataArray[arrayOffset];
        globalTransformMatrix.b = dataArray[arrayOffset + 1];
        globalTransformMatrix.c = dataArray[arrayOffset + 2];
        globalTransformMatrix.d = dataArray[arrayOffset + 3];
        globalTransformMatrix.tx = dataArray[arrayOffset + 4];
        globalTransformMatrix.ty = dataArray[arrayOffset + 5];
        transform.skewX = dataArray[arrayOffset + 6];
        transform.skewY = dataArray[arrayOffset + 7];
        transform.scaleX = dataArray[arrayOffset + 8];
        transform.scaleY = dataArray[arrayOffset + 9];
        transform.x = globalTransformMatrix.tx;
        transform.y = globalTransformMatrix.ty;
    };
    /**
     * @private
     */
    ArmatureData.prototype.addBone = function (value, parentName) {
        if (value && value.name && !this.bones[value.name]) {
            if (parentName) {
                var parent_1 = this.getBone(parentName);
                if (parent_1) {
                    value.parent = parent_1;
                }
                else {
                    (this._bonesChildren[parentName] = this._bonesChildren[parentName] || []).push(value);
                }
            }
            var children = this._bonesChildren[value.name];
            if (children) {
                for (var i = 0, l = children.length; i < l; ++i) {
                    children[i].parent = value;
                }
                delete this._bonesChildren[value.name];
            }
            this.bones[value.name] = value;
            this._sortedBones.push(value);
            this._boneDirty = true;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @private
     */
    ArmatureData.prototype.addSlot = function (value) {
        if (value && value.name && !this.slots[value.name]) {
            this.slots[value.name] = value;
            this._sortedSlots.push(value);
            this._slotDirty = true;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @private
     */
    ArmatureData.prototype.addSkin = function (value) {
        if (value && value.name && !this.skins[value.name]) {
            this.skins[value.name] = value;
            if (!this._defaultSkin) {
                this._defaultSkin = value;
            }
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @private
     */
    ArmatureData.prototype.addAnimation = function (value) {
        if (value && value.name && !this.animations[value.name]) {
            this.animations[value.name] = value;
            this._animationNames.push(value.name);
            if (!this._defaultAnimation) {
                this._defaultAnimation = value;
            }
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @language zh_CN
     * 获取骨骼数据。
     * @param name 骨骼数据名称。
     * @see dragonBones.BoneData
     * @version DragonBones 3.0
     */
    ArmatureData.prototype.getBone = function (name) {
        return this.bones[name];
    };
    /**
     * @language zh_CN
     * 获取插槽数据。
     * @param name 插槽数据名称。
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    ArmatureData.prototype.getSlot = function (name) {
        return this.slots[name];
    };
    /**
     * @private
     */
    ArmatureData.prototype.getSkin = function (name) {
        return name ? this.skins[name] : this._defaultSkin;
    };
    /**
     * @language zh_CN
     * 获取动画数据。
     * @param name 动画数据名称。
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    ArmatureData.prototype.getAnimation = function (name) {
        return name ? this.animations[name] : this._defaultAnimation;
    };
    Object.defineProperty(ArmatureData.prototype, "animationNames", {
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         */
        get: function () {
            return this._animationNames;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArmatureData.prototype, "sortedBones", {
        /**
         * @private
         */
        get: function () {
            if (this._boneDirty) {
                this._boneDirty = false;
                this._sortBones();
            }
            return this._sortedBones;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArmatureData.prototype, "sortedSlots", {
        /**
         * @private
         */
        get: function () {
            if (this._slotDirty) {
                this._slotDirty = false;
                this._sortSlots();
            }
            return this._sortedSlots;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArmatureData.prototype, "defaultSkin", {
        /**
         * @private
         */
        get: function () {
            return this._defaultSkin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArmatureData.prototype, "defaultAnimation", {
        /**
         * @language zh_CN
         * 获取默认动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        get: function () {
            return this._defaultAnimation;
        },
        enumerable: true,
        configurable: true
    });
    return ArmatureData;
}(BaseObject_1.BaseObject));
exports.ArmatureData = ArmatureData;
/**
 * @language zh_CN
 * 骨骼数据。
 * @see dragonBones.Bone
 * @version DragonBones 3.0
 */
var BoneData = /** @class */ (function (_super) {
    tslib_1.__extends(BoneData, _super);
    /**
     * @internal
     * @private
     */
    function BoneData() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.transform = new Transform_1.Transform();
        return _this;
    }
    /**
     * @private
     */
    BoneData.toString = function () {
        return "[class dragonBones.BoneData]";
    };
    /**
     * @private
     */
    BoneData.prototype._onClear = function () {
        if (this.userData) {
            this.userData.returnToPool();
        }
        this.inheritTranslation = false;
        this.inheritRotation = false;
        this.inheritScale = false;
        this.inheritReflection = false;
        this.bendPositive = false;
        this.chain = 0;
        this.chainIndex = 0;
        this.weight = 0.0;
        this.length = 0.0;
        this.name = null;
        this.transform.identity();
        this.parent = null;
        this.ik = null;
        this.userData = null;
    };
    return BoneData;
}(BaseObject_1.BaseObject));
exports.BoneData = BoneData;
/**
 * @language zh_CN
 * 插槽数据。
 * @see dragonBones.Slot
 * @version DragonBones 3.0
 */
var SlotData = /** @class */ (function (_super) {
    tslib_1.__extends(SlotData, _super);
    /**
     * @internal
     * @private
     */
    function SlotData() {
        var _this = _super.call(this) || this;
        /**
         * @private
         */
        _this.actions = [];
        return _this;
    }
    /**
     * @private
     */
    SlotData.generateColor = function () {
        return new ColorTransform_1.ColorTransform();
    };
    /**
     * @private
     */
    SlotData.toString = function () {
        return "[class dragonBones.SlotData]";
    };
    /**
     * @private
     */
    SlotData.prototype._onClear = function () {
        for (var i = 0, l = this.actions.length; i < l; ++i) {
            this.actions[i].returnToPool();
        }
        if (this.userData) {
            this.userData.returnToPool();
        }
        this.displayIndex = -1;
        this.zOrder = 0;
        this.blendMode = -1 /* None */;
        this.name = null;
        this.actions.length = 0;
        this.parent = null;
        this.color = null;
        this.userData = null;
    };
    /**
     * @private
     */
    SlotData.DEFAULT_COLOR = new ColorTransform_1.ColorTransform();
    return SlotData;
}(BaseObject_1.BaseObject));
exports.SlotData = SlotData;
/**
 * @private
 */
var SkinData = /** @class */ (function (_super) {
    tslib_1.__extends(SkinData, _super);
    function SkinData() {
        var _this = _super.call(this) || this;
        _this.slots = {};
        return _this;
    }
    SkinData.toString = function () {
        return "[class dragonBones.SkinData]";
    };
    SkinData.prototype._onClear = function () {
        for (var k in this.slots) {
            this.slots[k].returnToPool();
            delete this.slots[k];
        }
        this.name = null;
        //this.slots.clear();
    };
    SkinData.prototype.addSlot = function (value) {
        if (value && value.slot && !this.slots[value.slot.name]) {
            this.slots[value.slot.name] = value;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    SkinData.prototype.getSlot = function (name) {
        return this.slots[name];
    };
    return SkinData;
}(BaseObject_1.BaseObject));
exports.SkinData = SkinData;
/**
 * @private
 */
var SkinSlotData = /** @class */ (function (_super) {
    tslib_1.__extends(SkinSlotData, _super);
    function SkinSlotData() {
        var _this = _super.call(this) || this;
        _this.displays = [];
        _this.meshs = {};
        return _this;
    }
    SkinSlotData.toString = function () {
        return "[class dragonBones.SkinSlotData]";
    };
    SkinSlotData.prototype._onClear = function () {
        for (var i = 0, l = this.displays.length; i < l; ++i) {
            this.displays[i].returnToPool();
        }
        for (var k in this.meshs) {
            this.meshs[k].returnToPool();
            delete this.meshs[k];
        }
        this.displays.length = 0;
        //this.meshs.clear();
        this.slot = null;
    };
    SkinSlotData.prototype.getDisplay = function (name) {
        for (var i = 0, l = this.displays.length; i < l; ++i) {
            var display = this.displays[i];
            if (display.name === name) {
                return display;
            }
        }
        return null;
    };
    SkinSlotData.prototype.addMesh = function (value) {
        if (value && value.name && !this.meshs[value.name]) {
            this.meshs[value.name] = value;
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    SkinSlotData.prototype.getMesh = function (name) {
        return this.meshs[name];
    };
    return SkinSlotData;
}(BaseObject_1.BaseObject));
exports.SkinSlotData = SkinSlotData;
/**
 * @private
 */
var DisplayData = /** @class */ (function (_super) {
    tslib_1.__extends(DisplayData, _super);
    function DisplayData() {
        var _this = _super.call(this) || this;
        _this.pivot = new Point_1.Point();
        _this.transform = new Transform_1.Transform();
        return _this;
    }
    DisplayData.toString = function () {
        return "[class dragonBones.DisplayData]";
    };
    DisplayData.prototype._onClear = function () {
        if (this.boundingBox) {
            this.boundingBox.returnToPool();
        }
        this.isRelativePivot = false;
        this.type = -1 /* None */;
        this.inheritAnimation = true;
        this.name = null;
        this.path = null;
        this.share = null;
        this.pivot.clear();
        this.transform.identity();
        this.texture = null;
        this.armature = null;
        this.mesh = null;
        this.boundingBox = null;
    };
    return DisplayData;
}(BaseObject_1.BaseObject));
exports.DisplayData = DisplayData;
/**
 * @private
 */
var MeshData = /** @class */ (function (_super) {
    tslib_1.__extends(MeshData, _super);
    function MeshData() {
        var _this = _super.call(this) || this;
        _this.slotPose = new Matrix_1.Matrix();
        _this.uvs = []; // vertices * 2
        _this.vertices = []; // vertices * 2
        _this.vertexIndices = []; // triangles * 3
        _this.boneIndices = []; // vertices bones
        _this.weights = []; // vertices bones
        _this.boneVertices = []; // vertices bones * 2
        _this.bones = []; // bones
        _this.inverseBindPose = []; // bones
        return _this;
    }
    MeshData.toString = function () {
        return "[class dragonBones.MeshData]";
    };
    MeshData.prototype._onClear = function () {
        this.skinned = false;
        this.name = null;
        this.slotPose.identity();
        this.uvs.length = 0;
        this.vertices.length = 0;
        this.vertexIndices.length = 0;
        this.boneIndices.length = 0;
        this.weights.length = 0;
        this.boneVertices.length = 0;
        this.bones.length = 0;
        this.inverseBindPose.length = 0;
    };
    return MeshData;
}(BaseObject_1.BaseObject));
exports.MeshData = MeshData;
/**
 * @language zh_CN
 * 自定义包围盒数据。
 * @version DragonBones 5.0
 */
var BoundingBoxData = /** @class */ (function (_super) {
    tslib_1.__extends(BoundingBoxData, _super);
    /**
     * @internal
     * @private
     */
    function BoundingBoxData() {
        var _this = _super.call(this) || this;
        /**
         * @language zh_CN
         * 自定义多边形顶点。
         * @version DragonBones 5.0
         */
        _this.vertices = [];
        return _this;
    }
    /**
     * @private
     */
    BoundingBoxData.toString = function () {
        return "[class dragonBones.BoundingBoxData]";
    };
    /**
     * Compute the bit code for a point (x, y) using the clip rectangle
     */
    BoundingBoxData._computeOutCode = function (x, y, xMin, yMin, xMax, yMax) {
        var code = 0 /* InSide */; // initialised as being inside of [[clip window]]
        if (x < xMin) { // to the left of clip window
            code |= 1 /* Left */;
        }
        else if (x > xMax) { // to the right of clip window
            code |= 2 /* Right */;
        }
        if (y < yMin) { // below the clip window
            code |= 4 /* Top */;
        }
        else if (y > yMax) { // above the clip window
            code |= 8 /* Bottom */;
        }
        return code;
    };
    /**
     * @private
     */
    BoundingBoxData.segmentIntersectsRectangle = function (xA, yA, xB, yB, xMin, yMin, xMax, yMax, intersectionPointA, intersectionPointB, normalRadians) {
        if (intersectionPointA === void 0) { intersectionPointA = null; }
        if (intersectionPointB === void 0) { intersectionPointB = null; }
        if (normalRadians === void 0) { normalRadians = null; }
        var inSideA = xA > xMin && xA < xMax && yA > yMin && yA < yMax;
        var inSideB = xB > xMin && xB < xMax && yB > yMin && yB < yMax;
        if (inSideA && inSideB) {
            return -1;
        }
        var intersectionCount = 0;
        var outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
        var outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
        while (true) {
            if (!(outcode0 | outcode1)) { // Bitwise OR is 0. Trivially accept and get out of loop
                intersectionCount = 2;
                break;
            }
            else if (outcode0 & outcode1) { // Bitwise AND is not 0. Trivially reject and get out of loop
                break;
            }
            // failed both tests, so calculate the line segment to clip
            // from an outside point to an intersection with clip edge
            var x = 0.0;
            var y = 0.0;
            var normalRadian = 0.0;
            // At least one endpoint is outside the clip rectangle; pick it.
            var outcodeOut = outcode0 ? outcode0 : outcode1;
            // Now find the intersection point;
            if (outcodeOut & 4 /* Top */) { // point is above the clip rectangle
                x = xA + (xB - xA) * (yMin - yA) / (yB - yA);
                y = yMin;
                if (normalRadians) {
                    normalRadian = -Math.PI * 0.5;
                }
            }
            else if (outcodeOut & 8 /* Bottom */) { // point is below the clip rectangle
                x = xA + (xB - xA) * (yMax - yA) / (yB - yA);
                y = yMax;
                if (normalRadians) {
                    normalRadian = Math.PI * 0.5;
                }
            }
            else if (outcodeOut & 2 /* Right */) { // point is to the right of clip rectangle
                y = yA + (yB - yA) * (xMax - xA) / (xB - xA);
                x = xMax;
                if (normalRadians) {
                    normalRadian = 0;
                }
            }
            else if (outcodeOut & 1 /* Left */) { // point is to the left of clip rectangle
                y = yA + (yB - yA) * (xMin - xA) / (xB - xA);
                x = xMin;
                if (normalRadians) {
                    normalRadian = Math.PI;
                }
            }
            // Now we move outside point to intersection point to clip
            // and get ready for next pass.
            if (outcodeOut === outcode0) {
                xA = x;
                yA = y;
                outcode0 = BoundingBoxData._computeOutCode(xA, yA, xMin, yMin, xMax, yMax);
                if (normalRadians) {
                    normalRadians.x = normalRadian;
                }
            }
            else {
                xB = x;
                yB = y;
                outcode1 = BoundingBoxData._computeOutCode(xB, yB, xMin, yMin, xMax, yMax);
                if (normalRadians) {
                    normalRadians.y = normalRadian;
                }
            }
        }
        if (intersectionCount) {
            if (inSideA) {
                intersectionCount = 2; // 10
                if (intersectionPointA) {
                    intersectionPointA.x = xB;
                    intersectionPointA.y = yB;
                }
                if (intersectionPointB) {
                    intersectionPointB.x = xB;
                    intersectionPointB.y = xB;
                }
                if (normalRadians) {
                    normalRadians.x = normalRadians.y + Math.PI;
                }
            }
            else if (inSideB) {
                intersectionCount = 1; // 01
                if (intersectionPointA) {
                    intersectionPointA.x = xA;
                    intersectionPointA.y = yA;
                }
                if (intersectionPointB) {
                    intersectionPointB.x = xA;
                    intersectionPointB.y = yA;
                }
                if (normalRadians) {
                    normalRadians.y = normalRadians.x + Math.PI;
                }
            }
            else {
                intersectionCount = 3; // 11
                if (intersectionPointA) {
                    intersectionPointA.x = xA;
                    intersectionPointA.y = yA;
                }
                if (intersectionPointB) {
                    intersectionPointB.x = xB;
                    intersectionPointB.y = yB;
                }
            }
        }
        return intersectionCount;
    };
    /**
     * @private
     */
    BoundingBoxData.segmentIntersectsEllipse = function (xA, yA, xB, yB, xC, yC, widthH, heightH, intersectionPointA, intersectionPointB, normalRadians) {
        if (intersectionPointA === void 0) { intersectionPointA = null; }
        if (intersectionPointB === void 0) { intersectionPointB = null; }
        if (normalRadians === void 0) { normalRadians = null; }
        var d = widthH / heightH;
        var dd = d * d;
        yA *= d;
        yB *= d;
        var dX = xB - xA;
        var dY = yB - yA;
        var lAB = Math.sqrt(dX * dX + dY * dY);
        var xD = dX / lAB;
        var yD = dY / lAB;
        var a = (xC - xA) * xD + (yC - yA) * yD;
        var aa = a * a;
        var ee = xA * xA + yA * yA;
        var rr = widthH * widthH;
        var dR = rr - ee + aa;
        var intersectionCount = 0;
        if (dR >= 0) {
            var dT = Math.sqrt(dR);
            var sA = a - dT;
            var sB = a + dT;
            var inSideA = sA < 0.0 ? -1 : (sA <= lAB ? 0 : 1);
            var inSideB = sB < 0.0 ? -1 : (sB <= lAB ? 0 : 1);
            var sideAB = inSideA * inSideB;
            if (sideAB < 0) {
                return -1;
            }
            else if (sideAB === 0) {
                if (inSideA === -1) {
                    intersectionCount = 2; // 10
                    xB = xA + sB * xD;
                    yB = (yA + sB * yD) / d;
                    if (intersectionPointA) {
                        intersectionPointA.x = xB;
                        intersectionPointA.y = yB;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xB;
                        intersectionPointB.y = yB;
                    }
                    if (normalRadians) {
                        normalRadians.x = Math.atan2(yB / rr * dd, xB / rr);
                        normalRadians.y = normalRadians.x + Math.PI;
                    }
                }
                else if (inSideB === 1) {
                    intersectionCount = 1; // 01
                    xA = xA + sA * xD;
                    yA = (yA + sA * yD) / d;
                    if (intersectionPointA) {
                        intersectionPointA.x = xA;
                        intersectionPointA.y = yA;
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xA;
                        intersectionPointB.y = yA;
                    }
                    if (normalRadians) {
                        normalRadians.x = Math.atan2(yA / rr * dd, xA / rr);
                        normalRadians.y = normalRadians.x + Math.PI;
                    }
                }
                else {
                    intersectionCount = 3; // 11
                    if (intersectionPointA) {
                        intersectionPointA.x = xA + sA * xD;
                        intersectionPointA.y = (yA + sA * yD) / d;
                        if (normalRadians) {
                            normalRadians.x = Math.atan2(intersectionPointA.y / rr * dd, intersectionPointA.x / rr);
                        }
                    }
                    if (intersectionPointB) {
                        intersectionPointB.x = xA + sB * xD;
                        intersectionPointB.y = (yA + sB * yD) / d;
                        if (normalRadians) {
                            normalRadians.y = Math.atan2(intersectionPointB.y / rr * dd, intersectionPointB.x / rr);
                        }
                    }
                }
            }
        }
        return intersectionCount;
    };
    /**
     * @private
     */
    BoundingBoxData.segmentIntersectsPolygon = function (xA, yA, xB, yB, vertices, intersectionPointA, intersectionPointB, normalRadians) {
        if (intersectionPointA === void 0) { intersectionPointA = null; }
        if (intersectionPointB === void 0) { intersectionPointB = null; }
        if (normalRadians === void 0) { normalRadians = null; }
        if (xA === xB) {
            xA = xB + 0.01;
        }
        if (yA === yB) {
            yA = yB + 0.01;
        }
        var l = vertices.length;
        var dXAB = xA - xB;
        var dYAB = yA - yB;
        var llAB = xA * yB - yA * xB;
        var intersectionCount = 0;
        var xC = vertices[l - 2];
        var yC = vertices[l - 1];
        var dMin = 0.0;
        var dMax = 0.0;
        var xMin = 0.0;
        var yMin = 0.0;
        var xMax = 0.0;
        var yMax = 0.0;
        for (var i = 0; i < l; i += 2) {
            var xD = vertices[i];
            var yD = vertices[i + 1];
            if (xC === xD) {
                xC = xD + 0.01;
            }
            if (yC === yD) {
                yC = yD + 0.01;
            }
            var dXCD = xC - xD;
            var dYCD = yC - yD;
            var llCD = xC * yD - yC * xD;
            var ll = dXAB * dYCD - dYAB * dXCD;
            var x = (llAB * dXCD - dXAB * llCD) / ll;
            if (((x >= xC && x <= xD) || (x >= xD && x <= xC)) && (dXAB === 0 || (x >= xA && x <= xB) || (x >= xB && x <= xA))) {
                var y = (llAB * dYCD - dYAB * llCD) / ll;
                if (((y >= yC && y <= yD) || (y >= yD && y <= yC)) && (dYAB === 0 || (y >= yA && y <= yB) || (y >= yB && y <= yA))) {
                    if (intersectionPointB) {
                        var d = x - xA;
                        if (d < 0.0) {
                            d = -d;
                        }
                        if (intersectionCount === 0) {
                            dMin = d;
                            dMax = d;
                            xMin = x;
                            yMin = y;
                            xMax = x;
                            yMax = y;
                            if (normalRadians) {
                                normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                normalRadians.y = normalRadians.x;
                            }
                        }
                        else {
                            if (d < dMin) {
                                dMin = d;
                                xMin = x;
                                yMin = y;
                                if (normalRadians) {
                                    normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                }
                            }
                            if (d > dMax) {
                                dMax = d;
                                xMax = x;
                                yMax = y;
                                if (normalRadians) {
                                    normalRadians.y = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                                }
                            }
                        }
                        intersectionCount++;
                    }
                    else {
                        xMin = x;
                        yMin = y;
                        xMax = x;
                        yMax = y;
                        intersectionCount++;
                        if (normalRadians) {
                            normalRadians.x = Math.atan2(yD - yC, xD - xC) - Math.PI * 0.5;
                            normalRadians.y = normalRadians.x;
                        }
                        break;
                    }
                }
            }
            xC = xD;
            yC = yD;
        }
        if (intersectionCount === 1) {
            if (intersectionPointA) {
                intersectionPointA.x = xMin;
                intersectionPointA.y = yMin;
            }
            if (intersectionPointB) {
                intersectionPointB.x = xMin;
                intersectionPointB.y = yMin;
            }
            if (normalRadians) {
                normalRadians.y = normalRadians.x + Math.PI;
            }
        }
        else if (intersectionCount > 1) {
            intersectionCount++;
            if (intersectionPointA) {
                intersectionPointA.x = xMin;
                intersectionPointA.y = yMin;
            }
            if (intersectionPointB) {
                intersectionPointB.x = xMax;
                intersectionPointB.y = yMax;
            }
        }
        return intersectionCount;
    };
    /**
     * @private
     */
    BoundingBoxData.prototype._onClear = function () {
        this.type = -1 /* None */;
        this.color = 0x000000;
        this.x = 0.0;
        this.y = 0.0;
        this.width = 0.0;
        this.height = 0.0;
        this.vertices.length = 0;
    };
    /**
     * @language zh_CN
     * 是否包含点。
     * @version DragonBones 5.0
     */
    BoundingBoxData.prototype.containsPoint = function (pX, pY) {
        var isInSide = false;
        if (this.type === 2 /* Polygon */) {
            if (pX >= this.x && pX <= this.width && pY >= this.y && pY <= this.height) {
                for (var i = 0, l = this.vertices.length, iP = l - 2; i < l; i += 2) {
                    var yA = this.vertices[iP + 1];
                    var yB = this.vertices[i + 1];
                    if ((yB < pY && yA >= pY) || (yA < pY && yB >= pY)) {
                        var xA = this.vertices[iP];
                        var xB = this.vertices[i];
                        if ((pY - yB) * (xA - xB) / (yA - yB) + xB < pX) {
                            isInSide = !isInSide;
                        }
                    }
                    iP = i;
                }
            }
        }
        else {
            var widthH = this.width * 0.5;
            if (pX >= -widthH && pX <= widthH) {
                var heightH = this.height * 0.5;
                if (pY >= -heightH && pY <= heightH) {
                    if (this.type === 1 /* Ellipse */) {
                        pY *= widthH / heightH;
                        isInSide = Math.sqrt(pX * pX + pY * pY) <= widthH;
                    }
                    else {
                        isInSide = true;
                    }
                }
            }
        }
        return isInSide;
    };
    /**
     * @language zh_CN
     * 是否与线段相交。
     * @version DragonBones 5.0
     */
    BoundingBoxData.prototype.intersectsSegment = function (xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians) {
        if (intersectionPointA === void 0) { intersectionPointA = null; }
        if (intersectionPointB === void 0) { intersectionPointB = null; }
        if (normalRadians === void 0) { normalRadians = null; }
        var intersectionCount = 0;
        switch (this.type) {
            case 0 /* Rectangle */:
                var widthH = this.width * 0.5;
                var heightH = this.height * 0.5;
                intersectionCount = BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, -widthH, -heightH, widthH, heightH, intersectionPointA, intersectionPointB, normalRadians);
                break;
            case 1 /* Ellipse */:
                intersectionCount = BoundingBoxData.segmentIntersectsEllipse(xA, yA, xB, yB, 0.0, 0.0, this.width * 0.5, this.height * 0.5, intersectionPointA, intersectionPointB, normalRadians);
                break;
            case 2 /* Polygon */:
                if (BoundingBoxData.segmentIntersectsRectangle(xA, yA, xB, yB, this.x, this.y, this.width, this.height, null, null) !== 0) {
                    intersectionCount = BoundingBoxData.segmentIntersectsPolygon(xA, yA, xB, yB, this.vertices, intersectionPointA, intersectionPointB, normalRadians);
                }
                break;
            default:
                break;
        }
        return intersectionCount;
    };
    return BoundingBoxData;
}(BaseObject_1.BaseObject));
exports.BoundingBoxData = BoundingBoxData;
