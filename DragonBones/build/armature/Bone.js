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
var TransformObject_1 = require("./TransformObject");
var Transform_1 = require("../geom/Transform");
var DragonBones_1 = require("../core/DragonBones");
/**
 * @language zh_CN
 * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
 * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
 * @see dragonBones.BoneData
 * @see dragonBones.Armature
 * @see dragonBones.Slot
 * @version DragonBones 3.0
 */
var Bone = /** @class */ (function (_super) {
    __extends(Bone, _super);
    /**
     * @internal
     * @private
     */
    function Bone() {
        var _this = _super.call(this) || this;
        /**
         * @internal
         * @private
         */
        _this._animationPose = new Transform_1.Transform();
        _this._bones = [];
        _this._slots = [];
        return _this;
    }
    /**
     * @private
     */
    Bone.toString = function () {
        return "[class dragonBones.Bone]";
    };
    /**
     * @private
     */
    Bone.prototype._onClear = function () {
        _super.prototype._onClear.call(this);
        this.ikBendPositive = false;
        this.ikWeight = 0.0;
        this._ikChain = 0;
        this._ikChainIndex = 0;
        this._ik = null;
        this._transformDirty = false;
        this._childrenTransformDirty = false;
        this._blendDirty = false;
        this._visible = true;
        this._cachedFrameIndex = -1;
        this._blendLayer = 0;
        this._blendLeftWeight = 1.0;
        this._blendTotalWeight = 0.0;
        this._animationPose.identity();
        this._bones.length = 0;
        this._slots.length = 0;
        this._boneData = null;
        this._cachedFrameIndices = null;
    };
    /**
     * @private
     */
    Bone.prototype._updateGlobalTransformMatrix = function (isCache) {
        var flipX = this._armature.flipX;
        var flipY = this._armature.flipY === DragonBones_1.DragonBones.yDown;
        var dR = 0.0;
        this.global.x = this.origin.x + this.offset.x + this._animationPose.x;
        this.global.y = this.origin.y + this.offset.y + this._animationPose.y;
        this.global.skewX = this.origin.skewX + this.offset.skewX + this._animationPose.skewX;
        this.global.skewY = this.origin.skewY + this.offset.skewY + this._animationPose.skewY;
        this.global.scaleX = this.origin.scaleX * this.offset.scaleX * this._animationPose.scaleX;
        this.global.scaleY = this.origin.scaleY * this.offset.scaleY * this._animationPose.scaleY;
        if (this._parent) {
            var parentMatrix = this._parent.globalTransformMatrix;
            if (this._boneData.inheritScale) {
                if (!this._boneData.inheritRotation) {
                    this._parent.updateGlobalTransform();
                    dR = this._parent.global.skewY; //
                    this.global.skewX -= dR;
                    this.global.skewY -= dR;
                }
                this.global.toMatrix(this.globalTransformMatrix);
                this.globalTransformMatrix.concat(parentMatrix);
                if (this._boneData.inheritTranslation) {
                    this.global.x = this.globalTransformMatrix.tx;
                    this.global.y = this.globalTransformMatrix.ty;
                }
                else {
                    this.globalTransformMatrix.tx = this.global.x;
                    this.globalTransformMatrix.ty = this.global.y;
                }
                if (isCache) {
                    this.global.fromMatrix(this.globalTransformMatrix);
                }
                else {
                    this._globalDirty = true;
                }
            }
            else {
                if (this._boneData.inheritTranslation) {
                    var x = this.global.x;
                    var y = this.global.y;
                    this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                    this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                }
                else {
                    if (flipX) {
                        this.global.x = -this.global.x;
                    }
                    if (flipY) {
                        this.global.y = -this.global.y;
                    }
                }
                if (this._boneData.inheritRotation) {
                    this._parent.updateGlobalTransform();
                    dR = this._parent.global.skewY;
                    if (this._armature._armatureData.isRightTransform && parentMatrix.a * parentMatrix.d - parentMatrix.b * parentMatrix.c < 0.0) {
                        dR -= this.global.skewY * 2.0;
                        if (this._parent.global.scaleX < 0.0) {
                            dR += Math.PI;
                        }
                        if (flipX != flipY || this._boneData.inheritReflection) {
                            this.global.skewX += Math.PI;
                        }
                    }
                    this.global.skewX += dR;
                    this.global.skewY += dR;
                }
                else if (flipX || flipY) {
                    if (flipX && flipY) {
                        dR = Math.PI;
                    }
                    else {
                        dR = -this.global.skewY * 2.0;
                        if (flipX) {
                            dR += Math.PI;
                        }
                        this.global.skewX += Math.PI;
                    }
                    this.global.skewX += dR;
                    this.global.skewY += dR;
                }
                this.global.toMatrix(this.globalTransformMatrix);
            }
        }
        else {
            if (flipX || flipY) {
                if (flipX) {
                    this.global.x = -this.global.x;
                }
                if (flipY) {
                    this.global.y = -this.global.y;
                }
                if (flipX && flipY) {
                    dR = Math.PI;
                }
                else {
                    dR = -this.global.skewY * 2.0;
                    if (flipX) {
                        dR += Math.PI;
                    }
                    this.global.skewX += Math.PI;
                }
                this.global.skewX += dR;
                this.global.skewY += dR;
            }
            this.global.toMatrix(this.globalTransformMatrix);
        }
        //
        if (this._ik && this._ikChainIndex === this._ikChain && this.ikWeight > 0) {
            if (this._boneData.inheritTranslation && this._ikChain > 0 && this._parent) {
                this._computeIKB();
            }
            else {
                this._computeIKA();
            }
        }
    };
    /**
     * @private
     */
    Bone.prototype._computeIKA = function () {
        this.updateGlobalTransform();
        var boneLength = this._boneData.length;
        var ikGlobal = this._ik.global;
        var x = this.globalTransformMatrix.a * boneLength;
        var y = this.globalTransformMatrix.b * boneLength;
        var ikRadian = Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x);
        if (this.global.scaleX < 0.0) {
            ikRadian += Math.PI;
        }
        var dR = (ikRadian - this.global.skewY) * this.ikWeight;
        this.global.skewX += dR;
        this.global.skewY += dR;
        this.global.toMatrix(this.globalTransformMatrix);
    };
    /**
     * @private
     */
    Bone.prototype._computeIKB = function () {
        this._parent.updateGlobalTransform();
        this.updateGlobalTransform();
        var boneLength = this._boneData.length;
        var parentGlobal = this._parent.global;
        var ikGlobal = this._ik.global;
        var x = this.globalTransformMatrix.a * boneLength;
        var y = this.globalTransformMatrix.b * boneLength;
        var lLL = x * x + y * y;
        var lL = Math.sqrt(lLL);
        var dX = this.global.x - parentGlobal.x;
        var dY = this.global.y - parentGlobal.y;
        var lPP = dX * dX + dY * dY;
        var lP = Math.sqrt(lPP);
        var rawRadianA = Math.atan2(dY, dX);
        dX = ikGlobal.x - parentGlobal.x;
        dY = ikGlobal.y - parentGlobal.y;
        var lTT = dX * dX + dY * dY;
        var lT = Math.sqrt(lTT);
        var ikRadianA = 0.0;
        if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
            ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x);
            if (lL + lP <= lT) {
            }
            else if (lP < lL) {
                ikRadianA += Math.PI;
            }
        }
        else {
            var h = (lPP - lLL + lTT) / (2.0 * lTT);
            var r = Math.sqrt(lPP - h * h * lTT) / lT;
            var hX = parentGlobal.x + (dX * h);
            var hY = parentGlobal.y + (dY * h);
            var rX = -dY * r;
            var rY = dX * r;
            var isPPR = false;
            if (this._parent._parent) {
                var parentParentMatrix = this._parent._parent.globalTransformMatrix;
                isPPR = parentParentMatrix.a * parentParentMatrix.d - parentParentMatrix.b * parentParentMatrix.c < 0.0;
            }
            if (isPPR !== this.ikBendPositive) {
                this.global.x = hX - rX;
                this.global.y = hY - rY;
            }
            else {
                this.global.x = hX + rX;
                this.global.y = hY + rY;
            }
            ikRadianA = Math.atan2(this.global.y - parentGlobal.y, this.global.x - parentGlobal.x);
        }
        var dR = (ikRadianA - rawRadianA) * this.ikWeight;
        parentGlobal.skewX += dR;
        parentGlobal.skewY += dR;
        parentGlobal.toMatrix(this._parent.globalTransformMatrix);
        this._parent._childrenTransformDirty = true;
        if (this._parent._cachedFrameIndex >= 0) {
            this._armature._armatureData.setCacheFrame(this._parent.globalTransformMatrix, parentGlobal, this._parent._cachedFrameIndex);
        }
        var parentRadian = rawRadianA + dR;
        this.global.x = parentGlobal.x + Math.cos(parentRadian) * lP;
        this.global.y = parentGlobal.y + Math.sin(parentRadian) * lP;
        var ikRadianB = Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x);
        if (this.global.scaleX < 0.0) {
            ikRadianB += Math.PI;
        }
        dR = (ikRadianB - this.global.skewY) * this.ikWeight;
        this.global.skewX += dR;
        this.global.skewY += dR;
        this.global.toMatrix(this.globalTransformMatrix);
    };
    /**
     * @internal
     * @private
     */
    Bone.prototype._init = function (boneData) {
        if (this._boneData) {
            return;
        }
        this._boneData = boneData;
        this.name = this._boneData.name;
        this.origin = this._boneData.transform;
    };
    /**
     * @internal
     * @private
     */
    Bone.prototype._setArmature = function (value) {
        if (this._armature === value) {
            return;
        }
        this._ik = null;
        var oldSlots = null;
        var oldBones = null;
        if (this._armature) {
            oldSlots = this.getSlots();
            oldBones = this.getBones();
            this._armature._removeBoneFromBoneList(this);
        }
        this._armature = value;
        if (this._armature) {
            this._armature._addBoneToBoneList(this);
        }
        if (oldSlots) {
            for (var i = 0, l = oldSlots.length; i < l; ++i) {
                var slot = oldSlots[i];
                if (slot.parent === this) {
                    slot._setArmature(this._armature);
                }
            }
        }
        if (oldBones) {
            for (var i = 0, l = oldBones.length; i < l; ++i) {
                var bone = oldBones[i];
                if (bone.parent === this) {
                    bone._setArmature(this._armature);
                }
            }
        }
    };
    /**
     * @internal
     * @private
     */
    Bone.prototype._setIK = function (value, chain, chainIndex) {
        if (value) {
            if (chain === chainIndex) {
                var chainEnd = this._parent;
                if (chain && chainEnd) {
                    chain = 1;
                }
                else {
                    chain = 0;
                    chainIndex = 0;
                    chainEnd = this;
                }
                if (chainEnd === value || chainEnd.contains(value)) {
                    value = null;
                    chain = 0;
                    chainIndex = 0;
                }
                else {
                    var ancestor = value;
                    while (ancestor.ik && ancestor.ikChain) {
                        if (chainEnd.contains(ancestor.ik)) {
                            value = null;
                            chain = 0;
                            chainIndex = 0;
                            break;
                        }
                        ancestor = ancestor.parent;
                    }
                }
            }
        }
        else {
            chain = 0;
            chainIndex = 0;
        }
        this._ik = value;
        this._ikChain = chain;
        this._ikChainIndex = chainIndex;
        if (this._armature) {
            this._armature._bonesDirty = true;
        }
    };
    /**
     * @internal
     * @private
     */
    Bone.prototype._update = function (cacheFrameIndex) {
        this._blendDirty = false;
        if (cacheFrameIndex >= 0 && this._cachedFrameIndices) {
            var cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
            if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) {
                this._transformDirty = false;
            }
            else if (cachedFrameIndex >= 0) {
                this._transformDirty = true;
                this._cachedFrameIndex = cachedFrameIndex;
            }
            else if (this._transformDirty ||
                (this._parent && this._parent._childrenTransformDirty) ||
                (this._ik && this.ikWeight > 0 && this._ik._childrenTransformDirty)) {
                this._transformDirty = true;
                this._cachedFrameIndex = -1;
            }
            else if (this._cachedFrameIndex >= 0) {
                this._transformDirty = false;
                this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
            }
            else {
                this._transformDirty = true;
                this._cachedFrameIndex = -1;
            }
        }
        else if (this._transformDirty ||
            (this._parent && this._parent._childrenTransformDirty) ||
            (this._ik && this.ikWeight > 0 && this._ik._childrenTransformDirty)) {
            cacheFrameIndex = -1;
            this._transformDirty = true;
            this._cachedFrameIndex = -1;
        }
        if (this._transformDirty) {
            this._transformDirty = false;
            this._childrenTransformDirty = true;
            if (this._cachedFrameIndex < 0) {
                var isCache = cacheFrameIndex >= 0;
                this._updateGlobalTransformMatrix(isCache);
                if (isCache) {
                    this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                }
            }
            else {
                this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
            }
        }
        else if (this._childrenTransformDirty) {
            this._childrenTransformDirty = false;
        }
    };
    /**
     * @language zh_CN
     * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
     * @version DragonBones 3.0
     */
    Bone.prototype.invalidUpdate = function () {
        this._transformDirty = true;
    };
    /**
     * @language zh_CN
     * 是否包含骨骼或插槽。
     * @returns
     * @see dragonBones.TransformObject
     * @version DragonBones 3.0
     */
    Bone.prototype.contains = function (child) {
        if (child) {
            if (child === this) {
                return false;
            }
            var ancestor = child;
            while (ancestor !== this && ancestor) {
                ancestor = ancestor.parent;
            }
            return ancestor === this;
        }
        return false;
    };
    /**
     * @language zh_CN
     * 所有的子骨骼。
     * @version DragonBones 3.0
     */
    Bone.prototype.getBones = function () {
        this._bones.length = 0;
        var bones = this._armature.getBones();
        for (var i = 0, l = bones.length; i < l; ++i) {
            var bone = bones[i];
            if (bone.parent === this) {
                this._bones.push(bone);
            }
        }
        return this._bones;
    };
    /**
     * @language zh_CN
     * 所有的插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    Bone.prototype.getSlots = function () {
        this._slots.length = 0;
        var slots = this._armature.getSlots();
        for (var i = 0, l = slots.length; i < l; ++i) {
            var slot = slots[i];
            if (slot.parent === this) {
                this._slots.push(slot);
            }
        }
        return this._slots;
    };
    Object.defineProperty(Bone.prototype, "boneData", {
        /**
         * @private
         */
        get: function () {
            return this._boneData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "visible", {
        /**
         * @language zh_CN
         * 控制此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        get: function () {
            return this._visible;
        },
        set: function (value) {
            if (this._visible === value) {
                return;
            }
            this._visible = value;
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot._parent === this) {
                    slot._updateVisible();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "length", {
        /**
         * @deprecated
         * @see #boneData
         * @see #dragonBones.BoneData#length
         */
        get: function () {
            return this.boneData.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "slot", {
        /**
         * @deprecated
         * @see dragonBones.Armature#getSlot()
         */
        get: function () {
            var slots = this._armature.getSlots();
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slot = slots[i];
                if (slot.parent === this) {
                    return slot;
                }
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "ikChain", {
        /**
         * @deprecated
         */
        get: function () {
            return this._ikChain;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "ikChainIndex", {
        /**
         * @deprecated
         */
        get: function () {
            return this._ikChainIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bone.prototype, "ik", {
        /**
         * @deprecated
         */
        get: function () {
            return this._ik;
        },
        enumerable: true,
        configurable: true
    });
    return Bone;
}(TransformObject_1.TransformObject));
exports.Bone = Bone;
