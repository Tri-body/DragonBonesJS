"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseObject_1 = require("../core/BaseObject");
var EventObject_1 = require("../event/EventObject");
var DragonBones_1 = require("../core/DragonBones");
var Animation_1 = require("../animation/Animation");
/**
 * @language zh_CN
 * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
 * @see dragonBones.ArmatureData
 * @see dragonBones.Bone
 * @see dragonBones.Slot
 * @see dragonBones.Animation
 * @version DragonBones 3.0
 */
var Armature = /** @class */ (function (_super) {
    tslib_1.__extends(Armature, _super);
    /**
     * @internal
     * @private
     */
    function Armature() {
        var _this = _super.call(this) || this;
        _this._bones = [];
        _this._slots = [];
        _this._actions = [];
        _this._events = [];
        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        _this.enableCache = false;
        return _this;
    }
    /**
     * @private
     */
    Armature.toString = function () {
        return "[class dragonBones.Armature]";
    };
    Armature._onSortSlots = function (a, b) {
        return a._zOrder > b._zOrder ? 1 : -1;
    };
    /**
     * @private
     */
    Armature.prototype._onClear = function () {
        for (var i = 0, l = this._bones.length; i < l; ++i) {
            this._bones[i].returnToPool();
        }
        for (var i = 0, l = this._slots.length; i < l; ++i) {
            this._slots[i].returnToPool();
        }
        for (var i = 0, l = this._events.length; i < l; ++i) {
            this._events[i].returnToPool();
        }
        if (this._clock) {
            this._clock.remove(this);
        }
        if (this._proxy) {
            this._proxy._onClear();
        }
        if (this._replaceTextureAtlasData) {
            this._replaceTextureAtlasData.returnToPool();
        }
        if (this._animation) {
            this._animation.returnToPool();
        }
        this.inheritAnimation = true;
        this.debugDraw = false;
        this.userData = null;
        this._debugDraw = false;
        this._delayDispose = false;
        this._lockDispose = false;
        this._bonesDirty = false;
        this._slotsDirty = false;
        this._zOrderDirty = false;
        this._flipX = false;
        this._flipY = false;
        this._bones.length = 0;
        this._slots.length = 0;
        this._actions.length = 0;
        this._events.length = 0;
        this._armatureData = null;
        this._skinData = null;
        this._animation = null;
        this._proxy = null;
        this._display = null;
        this._eventManager = null;
        this._parent = null;
        this._clock = null;
        this._replaceTextureAtlasData = null;
        this._replacedTexture = null;
    };
    Armature.prototype._sortBones = function () {
        var total = this._bones.length;
        if (total <= 0) {
            return;
        }
        var sortHelper = this._bones.concat();
        var index = 0;
        var count = 0;
        this._bones.length = 0;
        while (count < total) {
            var bone = sortHelper[index++];
            if (index >= total) {
                index = 0;
            }
            if (this._bones.indexOf(bone) >= 0) {
                continue;
            }
            if (bone.parent && this._bones.indexOf(bone.parent) < 0) {
                continue;
            }
            if (bone.ik && this._bones.indexOf(bone.ik) < 0) {
                continue;
            }
            if (bone.ik && bone.ikChain > 0 && bone.ikChainIndex === bone.ikChain) {
                this._bones.splice(this._bones.indexOf(bone.parent) + 1, 0, bone); // ik, parent, bone, children
            }
            else {
                this._bones.push(bone);
            }
            count++;
        }
    };
    Armature.prototype._sortSlots = function () {
        this._slots.sort(Armature._onSortSlots);
    };
    Armature.prototype._doAction = function (value) {
        switch (value.type) {
            case 0 /* Play */:
                this._animation.playConfig(value.animationConfig);
                break;
            default:
                break;
        }
    };
    /**
     * @private
     */
    Armature.prototype._init = function (armatureData, skinData, proxy, display, eventManager) {
        if (this._armatureData) {
            return;
        }
        this._armatureData = armatureData;
        this._skinData = skinData;
        this._animation = BaseObject_1.BaseObject.borrowObject(Animation_1.Animation);
        this._proxy = proxy;
        this._display = display;
        this._eventManager = eventManager;
        this._animation._init(this);
        this._animation.animations = this._armatureData.animations;
    };
    /**
     * @internal
     * @private
     */
    Armature.prototype._addBoneToBoneList = function (value) {
        if (this._bones.indexOf(value) < 0) {
            this._bonesDirty = true;
            this._bones.push(value);
            this._animation._timelineStateDirty = true;
        }
    };
    /**
     * @internal
     * @private
     */
    Armature.prototype._removeBoneFromBoneList = function (value) {
        var index = this._bones.indexOf(value);
        if (index >= 0) {
            this._bones.splice(index, 1);
            this._animation._timelineStateDirty = true;
        }
    };
    /**
     * @internal
     * @private
     */
    Armature.prototype._addSlotToSlotList = function (value) {
        if (this._slots.indexOf(value) < 0) {
            this._slotsDirty = true;
            this._slots.push(value);
            this._animation._timelineStateDirty = true;
        }
    };
    /**
     * @internal
     * @private
     */
    Armature.prototype._removeSlotFromSlotList = function (value) {
        var index = this._slots.indexOf(value);
        if (index >= 0) {
            this._slots.splice(index, 1);
            this._animation._timelineStateDirty = true;
        }
    };
    /**
     * @private
     */
    Armature.prototype._sortZOrder = function (slotIndices) {
        var slots = this._armatureData.sortedSlots;
        var isOriginal = !slotIndices || slotIndices.length < 1;
        if (this._zOrderDirty || !isOriginal) {
            for (var i = 0, l = slots.length; i < l; ++i) {
                var slotIndex = isOriginal ? i : slotIndices[i];
                var slotData = slots[slotIndex];
                if (slotData) {
                    var slot = this.getSlot(slotData.name);
                    if (slot) {
                        slot._setZorder(i);
                    }
                }
            }
            this._slotsDirty = true;
            this._zOrderDirty = !isOriginal;
        }
    };
    /**
     * @private
     */
    Armature.prototype._bufferAction = function (value) {
        this._actions.push(value);
    };
    /**
     * @internal
     * @private
     */
    Armature.prototype._bufferEvent = function (value, type) {
        value.type = type;
        value.armature = this;
        this._events.push(value);
    };
    /**
     * @language zh_CN
     * 释放骨架。 (回收到对象池)
     * @version DragonBones 3.0
     */
    Armature.prototype.dispose = function () {
        if (this._armatureData) {
            if (this._lockDispose) {
                this._delayDispose = true;
            }
            else {
                this.returnToPool();
            }
        }
    };
    /**
     * @language zh_CN
     * 更新骨架和动画。
     * @param passedTime 两帧之间的时间间隔。 (以秒为单位)
     * @see dragonBones.IAnimateble
     * @see dragonBones.WorldClock
     * @version DragonBones 3.0
     */
    Armature.prototype.advanceTime = function (passedTime) {
        if (!this._armatureData) {
            throw new Error("The armature has been disposed.");
            //return;
        }
        else if (!this._armatureData.parent) {
            throw new Error("The armature data has been disposed.");
            //return;
        }
        var prevCacheFrameIndex = this._animation._cacheFrameIndex;
        // Update nimation.
        this._animation._advanceTime(passedTime);
        var currentCacheFrameIndex = this._animation._cacheFrameIndex;
        // Sort bones and slots.
        if (this._bonesDirty) {
            this._bonesDirty = false;
            this._sortBones();
        }
        if (this._slotsDirty) {
            this._slotsDirty = false;
            this._sortSlots();
        }
        var i = 0, l = 0;
        // Update bones and slots.
        if (currentCacheFrameIndex < 0 || currentCacheFrameIndex !== prevCacheFrameIndex) {
            for (i = 0, l = this._bones.length; i < l; ++i) {
                this._bones[i]._update(currentCacheFrameIndex);
            }
            for (i = 0, l = this._slots.length; i < l; ++i) {
                this._slots[i]._update(currentCacheFrameIndex);
            }
        }
        //
        var drawed = this.debugDraw || DragonBones_1.DragonBones.debugDraw;
        if (drawed || this._debugDraw) {
            this._debugDraw = drawed;
            this._proxy._debugDraw(this._debugDraw);
        }
        if (!this._lockDispose) {
            this._lockDispose = true;
            // Events. (Dispatch event before action.)
            l = this._events.length;
            if (l > 0) {
                for (i = 0; i < l; ++i) {
                    var eventObject = this._events[i];
                    this._proxy._dispatchEvent(eventObject.type, eventObject);
                    if (eventObject.type === EventObject_1.EventObject.SOUND_EVENT) {
                        this._eventManager._dispatchEvent(eventObject.type, eventObject);
                    }
                    eventObject.returnToPool();
                }
                this._events.length = 0;
            }
            // Actions.
            l = this._actions.length;
            if (l > 0) {
                for (i = 0; i < l; ++i) {
                    var action = this._actions[i];
                    if (action.slot) {
                        var slot = this.getSlot(action.slot.name);
                        if (slot) {
                            var childArmature = slot.childArmature;
                            if (childArmature) {
                                childArmature._doAction(action);
                            }
                        }
                    }
                    else if (action.bone) {
                        for (var iA = 0, lA = this._slots.length; iA < lA; ++iA) {
                            var childArmature = this._slots[iA].childArmature;
                            if (childArmature) {
                                childArmature._doAction(action);
                            }
                        }
                    }
                    else {
                        this._doAction(action);
                    }
                }
                this._actions.length = 0;
            }
            this._lockDispose = false;
        }
        if (this._delayDispose) {
            this.returnToPool();
        }
    };
    /**
     * @language zh_CN
     * 更新骨骼和插槽。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
     * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
     * @param updateSlotDisplay 是否更新插槽的显示对象。
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    Armature.prototype.invalidUpdate = function (boneName, updateSlotDisplay) {
        if (boneName === void 0) { boneName = null; }
        if (updateSlotDisplay === void 0) { updateSlotDisplay = false; }
        if (boneName) {
            var bone = this.getBone(boneName);
            if (bone) {
                bone.invalidUpdate();
                if (updateSlotDisplay) {
                    for (var i = 0, l = this._slots.length; i < l; ++i) {
                        var slot = this._slots[i];
                        if (slot.parent === bone) {
                            slot.invalidUpdate();
                        }
                    }
                }
            }
        }
        else {
            for (var i = 0, l = this._bones.length; i < l; ++i) {
                this._bones[i].invalidUpdate();
            }
            if (updateSlotDisplay) {
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    this._slots[i].invalidUpdate();
                }
            }
        }
    };
    /**
     * @language zh_CN
     * 判断点是否在所有插槽的自定义包围盒内。
     * @param x 点的水平坐标。（骨架内坐标系）
     * @param y 点的垂直坐标。（骨架内坐标系）
     * @version DragonBones 5.0
     */
    Armature.prototype.containsPoint = function (x, y) {
        for (var i = 0, l = this._slots.length; i < l; ++i) {
            var slot = this._slots[i];
            if (slot.containsPoint(x, y)) {
                return slot;
            }
        }
        return null;
    };
    /**
     * @language zh_CN
     * 判断线段是否与骨架的所有插槽的自定义包围盒相交。
     * @param xA 线段起点的水平坐标。（骨架内坐标系）
     * @param yA 线段起点的垂直坐标。（骨架内坐标系）
     * @param xB 线段终点的水平坐标。（骨架内坐标系）
     * @param yB 线段终点的垂直坐标。（骨架内坐标系）
     * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
     * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
     * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
     * @returns 线段从起点到终点相交的第一个自定义包围盒的插槽。
     * @version DragonBones 5.0
     */
    Armature.prototype.intersectsSegment = function (xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians) {
        if (intersectionPointA === void 0) { intersectionPointA = null; }
        if (intersectionPointB === void 0) { intersectionPointB = null; }
        if (normalRadians === void 0) { normalRadians = null; }
        var isV = xA === xB;
        var dMin = 0.0;
        var dMax = 0.0;
        var intXA = 0.0;
        var intYA = 0.0;
        var intXB = 0.0;
        var intYB = 0.0;
        var intAN = 0.0;
        var intBN = 0.0;
        var intSlotA = null;
        var intSlotB = null;
        for (var i = 0, l = this._slots.length; i < l; ++i) {
            var slot = this._slots[i];
            var intersectionCount = slot.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
            if (intersectionCount > 0) {
                if (intersectionPointA || intersectionPointB) {
                    if (intersectionPointA) {
                        var d = isV ? intersectionPointA.y - yA : intersectionPointA.x - xA;
                        if (d < 0.0) {
                            d = -d;
                        }
                        if (!intSlotA || d < dMin) {
                            dMin = d;
                            intXA = intersectionPointA.x;
                            intYA = intersectionPointA.y;
                            intSlotA = slot;
                            if (normalRadians) {
                                intAN = normalRadians.x;
                            }
                        }
                    }
                    if (intersectionPointB) {
                        var d = intersectionPointB.x - xA;
                        if (d < 0.0) {
                            d = -d;
                        }
                        if (!intSlotB || d > dMax) {
                            dMax = d;
                            intXB = intersectionPointB.x;
                            intYB = intersectionPointB.y;
                            intSlotB = slot;
                            if (normalRadians) {
                                intBN = normalRadians.y;
                            }
                        }
                    }
                }
                else {
                    intSlotA = slot;
                    break;
                }
            }
        }
        if (intSlotA && intersectionPointA) {
            intersectionPointA.x = intXA;
            intersectionPointA.y = intYA;
            if (normalRadians) {
                normalRadians.x = intAN;
            }
        }
        if (intSlotB && intersectionPointB) {
            intersectionPointB.x = intXB;
            intersectionPointB.y = intYB;
            if (normalRadians) {
                normalRadians.y = intBN;
            }
        }
        return intSlotA;
    };
    /**
     * @language zh_CN
     * 获取指定名称的骨骼。
     * @param name 骨骼的名称。
     * @returns 骨骼。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    Armature.prototype.getBone = function (name) {
        for (var i = 0, l = this._bones.length; i < l; ++i) {
            var bone = this._bones[i];
            if (bone.name === name) {
                return bone;
            }
        }
        return null;
    };
    /**
     * @language zh_CN
     * 通过显示对象获取骨骼。
     * @param display 显示对象。
     * @returns 包含这个显示对象的骨骼。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    Armature.prototype.getBoneByDisplay = function (display) {
        var slot = this.getSlotByDisplay(display);
        return slot ? slot.parent : null;
    };
    /**
     * @language zh_CN
     * 获取插槽。
     * @param name 插槽的名称。
     * @returns 插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    Armature.prototype.getSlot = function (name) {
        for (var i = 0, l = this._slots.length; i < l; ++i) {
            var slot = this._slots[i];
            if (slot.name === name) {
                return slot;
            }
        }
        return null;
    };
    /**
     * @language zh_CN
     * 通过显示对象获取插槽。
     * @param display 显示对象。
     * @returns 包含这个显示对象的插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    Armature.prototype.getSlotByDisplay = function (display) {
        if (display) {
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                if (slot.display === display) {
                    return slot;
                }
            }
        }
        return null;
    };
    /**
     * @deprecated
     */
    Armature.prototype.addBone = function (value, parentName) {
        if (parentName === void 0) { parentName = null; }
        if (value) {
            value._setArmature(this);
            value._setParent(parentName ? this.getBone(parentName) : null);
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @deprecated
     */
    Armature.prototype.removeBone = function (value) {
        if (value && value.armature === this) {
            value._setParent(null);
            value._setArmature(null);
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @deprecated
     */
    Armature.prototype.addSlot = function (value, parentName) {
        var bone = this.getBone(parentName);
        if (bone) {
            value._setArmature(this);
            value._setParent(bone);
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @deprecated
     */
    Armature.prototype.removeSlot = function (value) {
        if (value && value.armature === this) {
            value._setParent(null);
            value._setArmature(null);
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @language zh_CN
     * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图类型。
     * @param texture 贴图。
     * @version DragonBones 4.5
     */
    Armature.prototype.replaceTexture = function (texture) {
        this.replacedTexture = texture;
    };
    /**
     * @language zh_CN
     * 获取所有骨骼。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
     */
    Armature.prototype.getBones = function () {
        return this._bones;
    };
    /**
     * @language zh_CN
     * 获取所有插槽。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    Armature.prototype.getSlots = function () {
        return this._slots;
    };
    Object.defineProperty(Armature.prototype, "name", {
        /**
         * @language zh_CN
         * 骨架名称。
         * @see dragonBones.ArmatureData#name
         * @version DragonBones 3.0
         */
        get: function () {
            return this._armatureData ? this._armatureData.name : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "armatureData", {
        /**
         * @language zh_CN
         * 获取骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         */
        get: function () {
            return this._armatureData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "animation", {
        /**
         * @language zh_CN
         * 获得动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         */
        get: function () {
            return this._animation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "eventDispatcher", {
        /**
         * @language zh_CN
         * 获取事件监听器。
         * @version DragonBones 5.0
         */
        get: function () {
            return this._proxy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "display", {
        /**
         * @language zh_CN
         * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         */
        get: function () {
            return this._display;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "parent", {
        /**
         * @language zh_CN
         * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         */
        get: function () {
            return this._parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "flipX", {
        get: function () {
            return this._flipX;
        },
        set: function (value) {
            if (this._flipX === value) {
                return;
            }
            this._flipX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "flipY", {
        get: function () {
            return this._flipY;
        },
        set: function (value) {
            if (this._flipY === value) {
                return;
            }
            this._flipY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "cacheFrameRate", {
        /**
         * @language zh_CN
         * 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         */
        get: function () {
            return this._armatureData.cacheFrameRate;
        },
        set: function (value) {
            if (this._armatureData.cacheFrameRate !== value) {
                this._armatureData.cacheFrames(value);
                // Set child armature frameRate.
                for (var i = 0, l = this._slots.length; i < l; ++i) {
                    var childArmature = this._slots[i].childArmature;
                    if (childArmature) {
                        childArmature.cacheFrameRate = value;
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "clock", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this._clock;
        },
        set: function (value) {
            if (this._clock === value) {
                return;
            }
            var prevClock = this._clock;
            if (prevClock) {
                prevClock.remove(this);
            }
            this._clock = value;
            if (this._clock) {
                this._clock.add(this);
            }
            // Update childArmature clock.
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var childArmature = this._slots[i].childArmature;
                if (childArmature) {
                    childArmature.clock = this._clock;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Armature.prototype, "replacedTexture", {
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @version DragonBones 4.5
         */
        get: function () {
            return this._replacedTexture;
        },
        set: function (value) {
            if (this._replacedTexture === value) {
                return;
            }
            if (this._replaceTextureAtlasData) {
                this._replaceTextureAtlasData.returnToPool();
                this._replaceTextureAtlasData = null;
            }
            this._replacedTexture = value;
            for (var i = 0, l = this._slots.length; i < l; ++i) {
                var slot = this._slots[i];
                slot.invalidUpdate();
                slot._update(-1);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @deprecated
     * @see dragonBones.Armature#eventDispatcher
     */
    Armature.prototype.hasEventListener = function (type) {
        return this._proxy.hasEvent(type);
    };
    /**
     * @deprecated
     * @see dragonBones.Armature#eventDispatcher
     */
    Armature.prototype.addEventListener = function (type, listener, target) {
        this._proxy.addEvent(type, listener, target);
    };
    /**
     * @deprecated
     * @see dragonBones.Armature#eventDispatcher
     */
    Armature.prototype.removeEventListener = function (type, listener, target) {
        this._proxy.removeEvent(type, listener, target);
    };
    /**
     * @deprecated
     * @see #cacheFrameRate
     */
    Armature.prototype.enableAnimationCache = function (frameRate) {
        this.cacheFrameRate = frameRate;
    };
    /**
     * @deprecated
     * @see #display
     */
    Armature.prototype.getDisplay = function () {
        return this._display;
    };
    return Armature;
}(BaseObject_1.BaseObject));
exports.Armature = Armature;
