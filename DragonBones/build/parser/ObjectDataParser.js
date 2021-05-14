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
var DataParser_1 = require("./DataParser");
var ArmatureData_1 = require("../model/ArmatureData");
var BaseObject_1 = require("../core/BaseObject");
var DragonBones_1 = require("../core/DragonBones");
var Matrix_1 = require("../geom/Matrix");
var AnimationData_1 = require("../model/AnimationData");
var TimelineData_1 = require("../model/TimelineData");
var FrameData_1 = require("../model/FrameData");
var DragonBonesData_1 = require("../model/DragonBonesData");
var AnimationConfig_1 = require("../model/AnimationConfig");
var Transform_1 = require("../geom/Transform");
var TextureData_1 = require("../texture/TextureData");
/**
 * @private
 */
var ObjectDataParser = /** @class */ (function (_super) {
    __extends(ObjectDataParser, _super);
    /**
     * @private
     */
    function ObjectDataParser() {
        return _super.call(this) || this;
    }
    /**
     * @private
     */
    ObjectDataParser._getBoolean = function (rawData, key, defaultValue) {
        if (key in rawData) {
            var value = rawData[key];
            var valueType = typeof value;
            if (valueType === "boolean") {
                return value;
            }
            else if (valueType === "string") {
                switch (value) {
                    case "0":
                    case "NaN":
                    case "":
                    case "false":
                    case "null":
                    case "undefined":
                        return false;
                    default:
                        return true;
                }
            }
            else {
                return !!value;
            }
        }
        return defaultValue;
    };
    /**
     * @private
     */
    ObjectDataParser._getNumber = function (rawData, key, defaultValue) {
        if (key in rawData) {
            var value = rawData[key];
            if (value == null || value === "NaN") {
                return defaultValue;
            }
            return +value || 0;
        }
        return defaultValue;
    };
    /**
     * @private
     */
    ObjectDataParser._getString = function (rawData, key, defaultValue) {
        if (key in rawData) {
            return String(rawData[key]);
        }
        return defaultValue;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseArmature = function (rawData, scale) {
        var armature = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.ArmatureData);
        armature.isRightTransform = ObjectDataParser.DATA_VERSIONS.indexOf(this._data.version) > ObjectDataParser.DATA_VERSIONS.indexOf(ObjectDataParser.DATA_VERSION_4_5);
        armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        armature.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, this._data.frameRate);
        armature.scale = scale;
        if (armature.frameRate === 0) {
            armature.frameRate = 24;
        }
        if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
            armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
        }
        else {
            armature.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Armature */);
        }
        this._armature = armature;
        this._rawBones.length = 0;
        if (ObjectDataParser.AABB in rawData) {
            var rawAABB = rawData[ObjectDataParser.AABB];
            armature.aabb.x = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.X, 0.0);
            armature.aabb.y = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.Y, 0.0);
            armature.aabb.width = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.WIDTH, 0.0);
            armature.aabb.height = ObjectDataParser._getNumber(rawAABB, ObjectDataParser.HEIGHT, 0.0);
        }
        if (ObjectDataParser.BONE in rawData) {
            var rawBones = rawData[ObjectDataParser.BONE];
            for (var i = 0, l = rawBones.length; i < l; ++i) {
                var rawBone = rawBones[i];
                var bone = this._parseBone(rawBone);
                armature.addBone(bone, ObjectDataParser._getString(rawBone, ObjectDataParser.PARENT, null));
                this._rawBones.push(bone);
            }
        }
        if (ObjectDataParser.IK in rawData) {
            var rawIKS = rawData[ObjectDataParser.IK];
            for (var i = 0, l = rawIKS.length; i < l; ++i) {
                this._parseIK(rawIKS[i]);
            }
        }
        if (ObjectDataParser.SLOT in rawData) {
            var rawSlots = rawData[ObjectDataParser.SLOT];
            var zOrder = 0;
            for (var i = 0, l = rawSlots.length; i < l; ++i) {
                armature.addSlot(this._parseSlot(rawSlots[i], zOrder++));
            }
        }
        if (ObjectDataParser.SKIN in rawData) {
            var rawSkins = rawData[ObjectDataParser.SKIN];
            for (var i = 0, l = rawSkins.length; i < l; ++i) {
                armature.addSkin(this._parseSkin(rawSkins[i]));
            }
        }
        if (ObjectDataParser.ANIMATION in rawData) {
            var rawAnimations = rawData[ObjectDataParser.ANIMATION];
            for (var i = 0, l = rawAnimations.length; i < l; ++i) {
                armature.addAnimation(this._parseAnimation(rawAnimations[i]));
            }
        }
        if ((ObjectDataParser.ACTIONS in rawData) ||
            (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
            this._parseActionData(rawData, armature.actions, null, null);
        }
        if (this._isOldData && this._isGlobalTransform) {
            this._globalToLocal(armature);
        }
        this._armature = null;
        this._rawBones.length = 0;
        return armature;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseBone = function (rawData) {
        var bone = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.BoneData);
        bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
        bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
        bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
        bone.inheritReflection = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_REFLECTION, true);
        bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armature.scale;
        bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        if (ObjectDataParser.TRANSFORM in rawData) {
            this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform);
        }
        if (this._isOldData) {
            bone.inheritScale = false;
        }
        return bone;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseIK = function (rawData) {
        var bone = this._armature.getBone(ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData) ? ObjectDataParser.BONE : ObjectDataParser.NAME, null));
        if (bone) {
            bone.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
            bone.chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
            bone.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1.0);
            bone.ik = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, null));
            if (bone.chain > 0 && bone.parent && !bone.parent.ik) {
                bone.parent.ik = bone.ik;
                bone.parent.chainIndex = 0;
                bone.parent.chain = 0;
                bone.parent.weight = bone.weight;
                bone.chainIndex = 1;
            }
            else {
                bone.chain = 0;
                bone.chainIndex = 0;
            }
        }
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseSlot = function (rawData, zOrder) {
        var slot = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.SlotData);
        slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
        slot.zOrder = ObjectDataParser._getNumber(rawData, ObjectDataParser.Z, zOrder); // Support 2.x ~ 3.x data.
        slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null));
        if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
            slot.color = ArmatureData_1.SlotData.generateColor();
            this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
        }
        else {
            slot.color = ArmatureData_1.SlotData.DEFAULT_COLOR;
        }
        if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] === "string") {
            slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
        }
        else {
            slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, 0 /* Normal */);
        }
        if ((ObjectDataParser.ACTIONS in rawData) || (ObjectDataParser.DEFAULT_ACTIONS in rawData)) {
            this._parseActionData(rawData, slot.actions, null, null);
        }
        return slot;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseSkin = function (rawData) {
        var skin = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.SkinData);
        skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
        if (!skin.name) {
            skin.name = ObjectDataParser.DEFAULT_NAME;
        }
        if (ObjectDataParser.SLOT in rawData) {
            this._skin = skin;
            var slots = rawData[ObjectDataParser.SLOT];
            var zOrder = 0;
            for (var i = 0, l = slots.length; i < l; ++i) {
                if (this._isOldData) {
                    this._armature.addSlot(this._parseSlot(slots[i], zOrder++));
                }
                skin.addSlot(this._parseSkinSlotData(slots[i]));
            }
            this._skin = null;
        }
        return skin;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseSkinSlotData = function (rawData) {
        var skinSlotData = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.SkinSlotData);
        skinSlotData.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
        if (ObjectDataParser.DISPLAY in rawData) {
            var rawDisplays = rawData[ObjectDataParser.DISPLAY];
            this._skinSlotData = skinSlotData;
            for (var i = 0, l = rawDisplays.length; i < l; ++i) {
                skinSlotData.displays.push(this._parseDisplay(rawDisplays[i]));
            }
            this._skinSlotData = null;
        }
        return skinSlotData;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseDisplay = function (rawData) {
        var display = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.DisplayData);
        display.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ANIMATION, true);
        display.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        display.path = ObjectDataParser._getString(rawData, ObjectDataParser.PATH, display.name);
        if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] === "string") {
            display.type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
        }
        else {
            display.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, 0 /* Image */);
        }
        display.isRelativePivot = true;
        if (ObjectDataParser.PIVOT in rawData) {
            var pivotObject = rawData[ObjectDataParser.PIVOT];
            display.pivot.x = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.X, 0);
            display.pivot.y = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.Y, 0);
        }
        else if (this._isOldData) {
            var transformObject = rawData[ObjectDataParser.TRANSFORM];
            display.isRelativePivot = false;
            display.pivot.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0) * this._armature.scale;
            display.pivot.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0) * this._armature.scale;
        }
        else {
            display.pivot.x = 0.5;
            display.pivot.y = 0.5;
        }
        if (ObjectDataParser.TRANSFORM in rawData) {
            this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform);
        }
        switch (display.type) {
            case 0 /* Image */:
                break;
            case 1 /* Armature */:
                break;
            case 2 /* Mesh */:
                display.share = ObjectDataParser._getString(rawData, ObjectDataParser.SHARE, null);
                if (!display.share) {
                    display.inheritAnimation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_FFD, true);
                    display.mesh = this._parseMesh(rawData);
                    this._skinSlotData.addMesh(display.mesh);
                }
                break;
            case 3 /* BoundingBox */:
                display.boundingBox = this._parseBoundingBox(rawData);
                break;
            default:
                break;
        }
        return display;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseMesh = function (rawData) {
        var mesh = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.MeshData);
        var rawVertices = rawData[ObjectDataParser.VERTICES];
        var rawUVs = rawData[ObjectDataParser.UVS];
        var rawTriangles = rawData[ObjectDataParser.TRIANGLES];
        var numVertices = Math.floor(rawVertices.length / 2); // uint
        var numTriangles = Math.floor(rawTriangles.length / 3); // uint
        var inverseBindPose = new Array(this._armature.sortedBones.length);
        mesh.skinned = ObjectDataParser.WEIGHTS in rawData && rawData[ObjectDataParser.WEIGHTS].length > 0;
        mesh.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        mesh.uvs.length = numVertices * 2;
        mesh.vertices.length = numVertices * 2;
        mesh.vertexIndices.length = numTriangles * 3;
        if (mesh.skinned) {
            mesh.boneIndices.length = numVertices;
            mesh.weights.length = numVertices;
            mesh.boneVertices.length = numVertices;
            if (ObjectDataParser.SLOT_POSE in rawData) {
                var rawSlotPose = rawData[ObjectDataParser.SLOT_POSE];
                mesh.slotPose.a = rawSlotPose[0];
                mesh.slotPose.b = rawSlotPose[1];
                mesh.slotPose.c = rawSlotPose[2];
                mesh.slotPose.d = rawSlotPose[3];
                mesh.slotPose.tx = rawSlotPose[4] * this._armature.scale;
                mesh.slotPose.ty = rawSlotPose[5] * this._armature.scale;
            }
            if (ObjectDataParser.BONE_POSE in rawData) {
                var rawBonePose = rawData[ObjectDataParser.BONE_POSE];
                for (var i = 0, l = rawBonePose.length; i < l; i += 7) {
                    var rawBoneIndex = rawBonePose[i]; // uint
                    var boneMatrix = inverseBindPose[rawBoneIndex] = new Matrix_1.Matrix();
                    boneMatrix.a = rawBonePose[i + 1];
                    boneMatrix.b = rawBonePose[i + 2];
                    boneMatrix.c = rawBonePose[i + 3];
                    boneMatrix.d = rawBonePose[i + 4];
                    boneMatrix.tx = rawBonePose[i + 5] * this._armature.scale;
                    boneMatrix.ty = rawBonePose[i + 6] * this._armature.scale;
                    boneMatrix.invert();
                }
            }
        }
        for (var i = 0, iW = 0, l = rawVertices.length; i < l; i += 2) {
            var iN = i + 1;
            var vertexIndex = i / 2;
            var x = mesh.vertices[i] = rawVertices[i] * this._armature.scale;
            var y = mesh.vertices[iN] = rawVertices[iN] * this._armature.scale;
            mesh.uvs[i] = rawUVs[i];
            mesh.uvs[iN] = rawUVs[iN];
            if (mesh.skinned) {
                var rawWeights = rawData[ObjectDataParser.WEIGHTS];
                var numBones = rawWeights[iW]; // uint
                var indices = mesh.boneIndices[vertexIndex] = new Array(numBones);
                var weights = mesh.weights[vertexIndex] = new Array(numBones);
                var boneVertices = mesh.boneVertices[vertexIndex] = new Array(numBones * 2);
                mesh.slotPose.transformPoint(x, y, this._helpPoint);
                x = mesh.vertices[i] = this._helpPoint.x;
                y = mesh.vertices[iN] = this._helpPoint.y;
                for (var iB = 0; iB < numBones; ++iB) {
                    var iI = iW + 1 + iB * 2;
                    var rawBoneIndex = rawWeights[iI]; // uint
                    var boneData = this._rawBones[rawBoneIndex];
                    var boneIndex = mesh.bones.indexOf(boneData);
                    if (boneIndex < 0) {
                        boneIndex = mesh.bones.length;
                        mesh.bones[boneIndex] = boneData;
                        mesh.inverseBindPose[boneIndex] = inverseBindPose[rawBoneIndex];
                    }
                    mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint);
                    indices[iB] = boneIndex;
                    weights[iB] = rawWeights[iI + 1];
                    boneVertices[iB * 2] = this._helpPoint.x;
                    boneVertices[iB * 2 + 1] = this._helpPoint.y;
                }
                iW += numBones * 2 + 1;
            }
        }
        for (var i = 0, l = rawTriangles.length; i < l; ++i) {
            mesh.vertexIndices[i] = rawTriangles[i];
        }
        return mesh;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseBoundingBox = function (rawData) {
        var boundingBox = BaseObject_1.BaseObject.borrowObject(ArmatureData_1.BoundingBoxData);
        if (ObjectDataParser.SUB_TYPE in rawData && typeof rawData[ObjectDataParser.SUB_TYPE] === "string") {
            boundingBox.type = ObjectDataParser._getBoundingBoxType(rawData[ObjectDataParser.SUB_TYPE]);
        }
        else {
            boundingBox.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.SUB_TYPE, 0 /* Rectangle */);
        }
        boundingBox.color = ObjectDataParser._getNumber(rawData, ObjectDataParser.COLOR, 0x000000);
        switch (boundingBox.type) {
            case 0 /* Rectangle */:
            case 1 /* Ellipse */:
                boundingBox.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0.0);
                boundingBox.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0.0);
                break;
            case 2 /* Polygon */:
                if (ObjectDataParser.VERTICES in rawData) {
                    var rawVertices = rawData[ObjectDataParser.VERTICES];
                    boundingBox.vertices.length = rawVertices.length;
                    for (var i = 0, l = boundingBox.vertices.length; i < l; i += 2) {
                        var iN = i + 1;
                        var x = rawVertices[i];
                        var y = rawVertices[iN];
                        boundingBox.vertices[i] = x;
                        boundingBox.vertices[iN] = y;
                        // AABB.
                        if (i === 0) {
                            boundingBox.x = x;
                            boundingBox.y = y;
                            boundingBox.width = x;
                            boundingBox.height = y;
                        }
                        else {
                            if (x < boundingBox.x) {
                                boundingBox.x = x;
                            }
                            else if (x > boundingBox.width) {
                                boundingBox.width = x;
                            }
                            if (y < boundingBox.y) {
                                boundingBox.y = y;
                            }
                            else if (y > boundingBox.height) {
                                boundingBox.height = y;
                            }
                        }
                    }
                }
                break;
            default:
                break;
        }
        return boundingBox;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseAnimation = function (rawData) {
        var animation = BaseObject_1.BaseObject.borrowObject(AnimationData_1.AnimationData);
        animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
        animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
        animation.duration = animation.frameCount / this._armature.frameRate;
        animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0);
        animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, ObjectDataParser.DEFAULT_NAME);
        if (!animation.name) {
            animation.name = ObjectDataParser.DEFAULT_NAME;
        }
        this._animation = animation;
        this._parseTimeline(rawData, animation, this._parseAnimationFrame);
        if (ObjectDataParser.Z_ORDER in rawData) {
            animation.zOrderTimeline = BaseObject_1.BaseObject.borrowObject(TimelineData_1.ZOrderTimelineData);
            this._parseTimeline(rawData[ObjectDataParser.Z_ORDER], animation.zOrderTimeline, this._parseZOrderFrame);
        }
        if (ObjectDataParser.BONE in rawData) {
            var boneTimelines = rawData[ObjectDataParser.BONE];
            for (var i = 0, l = boneTimelines.length; i < l; ++i) {
                animation.addBoneTimeline(this._parseBoneTimeline(boneTimelines[i]));
            }
        }
        if (ObjectDataParser.SLOT in rawData) {
            var slotTimelines = rawData[ObjectDataParser.SLOT];
            for (var i = 0, l = slotTimelines.length; i < l; ++i) {
                animation.addSlotTimeline(this._parseSlotTimeline(slotTimelines[i]));
            }
        }
        if (ObjectDataParser.FFD in rawData) {
            var ffdTimelines = rawData[ObjectDataParser.FFD];
            for (var i = 0, l = ffdTimelines.length; i < l; ++i) {
                animation.addFFDTimeline(this._parseFFDTimeline(ffdTimelines[i]));
            }
        }
        if (this._isOldData) {
            this._isAutoTween = ObjectDataParser._getBoolean(rawData, ObjectDataParser.AUTO_TWEEN, true);
            this._animationTweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, 0) || 0;
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.LOOP, 1);
            if (ObjectDataParser.TIMELINE in rawData) {
                var timelineObjects = rawData[ObjectDataParser.TIMELINE];
                for (var i = 0, l = timelineObjects.length; i < l; ++i) {
                    var timelineObject = timelineObjects[i];
                    animation.addBoneTimeline(this._parseBoneTimeline(timelineObject));
                    animation.addSlotTimeline(this._parseSlotTimeline(timelineObject));
                }
            }
        }
        else {
            this._isAutoTween = false;
            this._animationTweenEasing = 0;
        }
        for (var i in this._armature.bones) {
            var bone = this._armature.bones[i];
            if (!animation.getBoneTimeline(bone.name)) {
                var boneTimeline = BaseObject_1.BaseObject.borrowObject(TimelineData_1.BoneTimelineData);
                var boneFrame = BaseObject_1.BaseObject.borrowObject(FrameData_1.BoneFrameData);
                boneTimeline.bone = bone;
                boneTimeline.frames[0] = boneFrame;
                animation.addBoneTimeline(boneTimeline);
            }
        }
        for (var i in this._armature.slots) {
            var slot = this._armature.slots[i];
            if (!animation.getSlotTimeline(slot.name)) {
                var slotTimeline = BaseObject_1.BaseObject.borrowObject(TimelineData_1.SlotTimelineData);
                var slotFrame = BaseObject_1.BaseObject.borrowObject(FrameData_1.SlotFrameData);
                slotTimeline.slot = slot;
                slotFrame.displayIndex = slot.displayIndex;
                if (slot.color === ArmatureData_1.SlotData.DEFAULT_COLOR) {
                    slotFrame.color = FrameData_1.SlotFrameData.DEFAULT_COLOR;
                }
                else {
                    slotFrame.color = FrameData_1.SlotFrameData.generateColor();
                    slotFrame.color.copyFrom(slot.color);
                }
                slotTimeline.frames[0] = slotFrame;
                animation.addSlotTimeline(slotTimeline);
                if (this._isOldData) {
                    slotFrame.displayIndex = -1;
                }
            }
        }
        this._animation = null;
        return animation;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseBoneTimeline = function (rawData) {
        var timeline = BaseObject_1.BaseObject.borrowObject(TimelineData_1.BoneTimelineData);
        timeline.bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
        this._parseTimeline(rawData, timeline, this._parseBoneFrame);
        var originalTransform = timeline.originalTransform;
        var prevFrame = null;
        for (var i = 0, l = timeline.frames.length; i < l; ++i) {
            var frame = timeline.frames[i];
            if (!prevFrame) {
                originalTransform.copyFrom(frame.transform);
                frame.transform.identity();
                if (originalTransform.scaleX === 0) {
                    originalTransform.scaleX = 0.001;
                    //frame.transform.scaleX = 0;
                }
                if (originalTransform.scaleY === 0) {
                    originalTransform.scaleY = 0.001;
                    //frame.transform.scaleY = 0;
                }
            }
            else if (prevFrame !== frame) {
                frame.transform.minus(originalTransform);
            }
            prevFrame = frame;
        }
        if (this._isOldData && (ObjectDataParser.PIVOT_X in rawData || ObjectDataParser.PIVOT_Y in rawData)) {
            this._timelinePivot.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_X, 0.0) * this._armature.scale;
            this._timelinePivot.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.PIVOT_Y, 0.0) * this._armature.scale;
        }
        else {
            this._timelinePivot.clear();
        }
        return timeline;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseSlotTimeline = function (rawData) {
        var timeline = BaseObject_1.BaseObject.borrowObject(TimelineData_1.SlotTimelineData);
        timeline.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));
        this._parseTimeline(rawData, timeline, this._parseSlotFrame);
        return timeline;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseFFDTimeline = function (rawData) {
        var timeline = BaseObject_1.BaseObject.borrowObject(TimelineData_1.FFDTimelineData);
        timeline.skin = this._armature.getSkin(ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, null));
        timeline.slot = timeline.skin.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.SLOT, null));
        var meshName = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
        for (var i = 0, l = timeline.slot.displays.length; i < l; ++i) {
            var display = timeline.slot.displays[i];
            if (display.mesh && display.name === meshName) {
                timeline.display = display;
                break;
            }
        }
        this._parseTimeline(rawData, timeline, this._parseFFDFrame);
        return timeline;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseAnimationFrame = function (rawData, frameStart, frameCount) {
        var frame = BaseObject_1.BaseObject.borrowObject(FrameData_1.AnimationFrameData);
        this._parseFrame(rawData, frame, frameStart, frameCount);
        if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
            this._parseActionData(rawData, frame.actions, null, null);
        }
        if ((ObjectDataParser.EVENTS in rawData) || (ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
            this._parseEventData(rawData, frame.events, null, null);
        }
        return frame;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseZOrderFrame = function (rawData, frameStart, frameCount) {
        var frame = BaseObject_1.BaseObject.borrowObject(FrameData_1.ZOrderFrameData);
        this._parseFrame(rawData, frame, frameStart, frameCount);
        var rawZOrder = rawData[ObjectDataParser.Z_ORDER];
        if (rawZOrder && rawZOrder.length > 0) {
            var slotCount = this._armature.sortedSlots.length;
            var unchanged = new Array(slotCount - rawZOrder.length / 2);
            frame.zOrder.length = slotCount;
            for (var i_1 = 0; i_1 < slotCount; ++i_1) {
                frame.zOrder[i_1] = -1;
            }
            var originalIndex = 0;
            var unchangedIndex = 0;
            for (var i_2 = 0, l = rawZOrder.length; i_2 < l; i_2 += 2) {
                var slotIndex = rawZOrder[i_2];
                var offset = rawZOrder[i_2 + 1];
                while (originalIndex !== slotIndex) {
                    unchanged[unchangedIndex++] = originalIndex++;
                }
                frame.zOrder[originalIndex + offset] = originalIndex++;
            }
            while (originalIndex < slotCount) {
                unchanged[unchangedIndex++] = originalIndex++;
            }
            var i = slotCount;
            while (i--) {
                if (frame.zOrder[i] === -1) {
                    frame.zOrder[i] = unchanged[--unchangedIndex];
                }
            }
        }
        return frame;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseBoneFrame = function (rawData, frameStart, frameCount) {
        var frame = BaseObject_1.BaseObject.borrowObject(FrameData_1.BoneFrameData);
        frame.tweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0.0);
        frame.tweenScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.TWEEN_SCALE, true);
        this._parseTweenFrame(rawData, frame, frameStart, frameCount);
        if (ObjectDataParser.TRANSFORM in rawData) {
            var transformObject = rawData[ObjectDataParser.TRANSFORM];
            this._parseTransform(transformObject, frame.transform);
            if (this._isOldData) {
                this._helpPoint.x = this._timelinePivot.x + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0.0) * this._armature.scale;
                this._helpPoint.y = this._timelinePivot.y + ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0.0) * this._armature.scale;
                frame.transform.toMatrix(this._helpMatrix);
                this._helpMatrix.transformPoint(this._helpPoint.x, this._helpPoint.y, this._helpPoint, true);
                frame.transform.x += this._helpPoint.x;
                frame.transform.y += this._helpPoint.y;
            }
        }
        var bone = this._timeline.bone;
        var actions = new Array();
        var events = new Array();
        if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
            var slot = this._armature.getSlot(bone.name);
            this._parseActionData(rawData, actions, bone, slot);
        }
        if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
            this._parseEventData(rawData, events, bone, null);
        }
        if (actions.length > 0 || events.length > 0) {
            this._mergeFrameToAnimationTimeline(frame.position, actions, events); // Merge actions and events to animation timeline.
        }
        return frame;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseSlotFrame = function (rawData, frameStart, frameCount) {
        var frame = BaseObject_1.BaseObject.borrowObject(FrameData_1.SlotFrameData);
        frame.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
        this._parseTweenFrame(rawData, frame, frameStart, frameCount);
        if ((ObjectDataParser.COLOR in rawData) || (ObjectDataParser.COLOR_TRANSFORM in rawData)) {
            frame.color = FrameData_1.SlotFrameData.generateColor();
            this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], frame.color);
        }
        else {
            frame.color = FrameData_1.SlotFrameData.DEFAULT_COLOR;
        }
        if (this._isOldData) {
            if (ObjectDataParser._getBoolean(rawData, ObjectDataParser.HIDE, false)) {
                frame.displayIndex = -1;
            }
        }
        else if ((ObjectDataParser.ACTION in rawData) || (ObjectDataParser.ACTIONS in rawData)) {
            var slot = this._timeline.slot;
            var actions = new Array();
            this._parseActionData(rawData, actions, slot.parent, slot);
            this._mergeFrameToAnimationTimeline(frame.position, actions, null); // Merge actions and events to animation timeline.
        }
        return frame;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseFFDFrame = function (rawData, frameStart, frameCount) {
        var ffdTimeline = this._timeline;
        var mesh = ffdTimeline.display.mesh;
        var frame = BaseObject_1.BaseObject.borrowObject(FrameData_1.ExtensionFrameData);
        this._parseTweenFrame(rawData, frame, frameStart, frameCount);
        var rawVertices = rawData[ObjectDataParser.VERTICES];
        var offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0); // uint
        var x = 0.0;
        var y = 0.0;
        for (var i = 0, l = mesh.vertices.length; i < l; i += 2) {
            if (!rawVertices) {
                x = 0.0;
                y = 0.0;
            }
            else {
                if (i < offset || i - offset >= rawVertices.length) {
                    x = 0.0;
                }
                else {
                    x = rawVertices[i - offset] * this._armature.scale;
                }
                if (i + 1 < offset || i + 1 - offset >= rawVertices.length) {
                    y = 0.0;
                }
                else {
                    y = rawVertices[i + 1 - offset] * this._armature.scale;
                }
            }
            if (mesh.skinned) {
                mesh.slotPose.transformPoint(x, y, this._helpPoint, true);
                x = this._helpPoint.x;
                y = this._helpPoint.y;
                var boneIndices = mesh.boneIndices[i / 2];
                for (var iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                    var boneIndex = boneIndices[iB];
                    mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint, true);
                    frame.tweens.push(this._helpPoint.x, this._helpPoint.y);
                }
            }
            else {
                frame.tweens.push(x, y);
            }
        }
        return frame;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseTweenFrame = function (rawData, frame, frameStart, frameCount) {
        this._parseFrame(rawData, frame, frameStart, frameCount);
        if (frame.duration > 0.0) {
            if (ObjectDataParser.TWEEN_EASING in rawData) {
                frame.tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, DragonBones_1.DragonBones.NO_TWEEN);
            }
            else if (this._isOldData) {
                frame.tweenEasing = this._isAutoTween ? this._animationTweenEasing : DragonBones_1.DragonBones.NO_TWEEN;
            }
            else {
                frame.tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
            }
            if (this._isOldData && this._animation.scale === 1 && this._timeline.scale === 1 && frame.duration * this._armature.frameRate < 2) {
                frame.tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
            }
            if (frameCount > 0 && (ObjectDataParser.CURVE in rawData)) {
                frame.curve = new Array(frameCount * 2 - 1);
                FrameData_1.TweenFrameData.samplingEasingCurve(rawData[ObjectDataParser.CURVE], frame.curve);
            }
        }
        else {
            frame.tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
            frame.curve = null;
        }
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseFrame = function (rawData, frame, frameStart, frameCount) {
        frame.position = frameStart / this._armature.frameRate;
        frame.duration = frameCount / this._armature.frameRate;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseTimeline = function (rawData, timeline, frameParser) {
        timeline.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1);
        timeline.offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);
        this._timeline = timeline;
        if (ObjectDataParser.FRAME in rawData) {
            var rawFrames = rawData[ObjectDataParser.FRAME];
            if (rawFrames.length === 1) {
                timeline.frames.length = 1;
                timeline.frames[0] = frameParser.call(this, rawFrames[0], 0, ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DURATION, 1));
            }
            else if (rawFrames.length > 1) {
                timeline.frames.length = this._animation.frameCount + 1;
                var frameStart = 0;
                var frameCount = 0;
                var frame = null;
                var prevFrame = null;
                for (var i = 0, iW = 0, l = timeline.frames.length; i < l; ++i) {
                    if (frameStart + frameCount <= i && iW < rawFrames.length) {
                        var rawFrame = rawFrames[iW++];
                        frameStart = i;
                        frameCount = ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DURATION, 1);
                        frame = frameParser.call(this, rawFrame, frameStart, frameCount);
                        if (prevFrame) {
                            prevFrame.next = frame;
                            frame.prev = prevFrame;
                            if (this._isOldData) {
                                if (prevFrame instanceof FrameData_1.TweenFrameData && ObjectDataParser._getNumber(rawFrame, ObjectDataParser.DISPLAY_INDEX, 0) === -1) {
                                    prevFrame.tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
                                }
                            }
                        }
                        prevFrame = frame;
                    }
                    timeline.frames[i] = frame;
                }
                frame.duration = this._animation.duration - frame.position; // Modify last frame duration.
                frame = timeline.frames[0];
                prevFrame.next = frame;
                frame.prev = prevFrame;
                if (this._isOldData) {
                    if (prevFrame instanceof FrameData_1.TweenFrameData && ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DISPLAY_INDEX, 0) === -1) {
                        prevFrame.tweenEasing = DragonBones_1.DragonBones.NO_TWEEN;
                    }
                }
            }
        }
        this._timeline = null;
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseActionData = function (rawData, actions, bone, slot) {
        var rawActions = rawData[ObjectDataParser.ACTION] || rawData[ObjectDataParser.ACTIONS] || rawData[ObjectDataParser.DEFAULT_ACTIONS];
        if (typeof rawActions === "string") {
            var actionData = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.ActionData);
            actionData.type = 0 /* Play */;
            actionData.bone = bone;
            actionData.slot = slot;
            actionData.animationConfig = BaseObject_1.BaseObject.borrowObject(AnimationConfig_1.AnimationConfig);
            actionData.animationConfig.animation = rawActions;
            actions.push(actionData);
        }
        else if (rawActions instanceof Array) {
            for (var i = 0, l = rawActions.length; i < l; ++i) {
                var actionObject = rawActions[i];
                var isArray = actionObject instanceof Array;
                var actionData = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.ActionData);
                var animationName = isArray ? actionObject[1] : ObjectDataParser._getString(actionObject, "gotoAndPlay", null);
                if (isArray) {
                    var actionType = actionObject[0];
                    if (typeof actionType === "string") {
                        actionData.type = ObjectDataParser._getActionType(actionType);
                    }
                    else {
                        actionData.type = actionType;
                    }
                }
                else {
                    actionData.type = 0 /* Play */;
                }
                switch (actionData.type) {
                    case 0 /* Play */:
                        actionData.animationConfig = BaseObject_1.BaseObject.borrowObject(AnimationConfig_1.AnimationConfig);
                        actionData.animationConfig.animation = animationName;
                        break;
                    default:
                        break;
                }
                actionData.bone = bone;
                actionData.slot = slot;
                actions.push(actionData);
            }
        }
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseEventData = function (rawData, events, bone, slot) {
        if (ObjectDataParser.SOUND in rawData) {
            var soundEventData = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.EventData);
            soundEventData.type = 11 /* Sound */;
            soundEventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.SOUND, null);
            soundEventData.bone = bone;
            soundEventData.slot = slot;
            events.push(soundEventData);
        }
        if (ObjectDataParser.EVENT in rawData) {
            var eventData = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.EventData);
            eventData.type = 10 /* Frame */;
            eventData.name = ObjectDataParser._getString(rawData, ObjectDataParser.EVENT, null);
            eventData.bone = bone;
            eventData.slot = slot;
            events.push(eventData);
        }
        if (ObjectDataParser.EVENTS in rawData) {
            var rawEvents = rawData[ObjectDataParser.EVENTS];
            for (var i = 0, l = rawEvents.length; i < l; ++i) {
                var rawEvent = rawEvents[i];
                var boneName = ObjectDataParser._getString(rawEvent, ObjectDataParser.BONE, null);
                var slotName = ObjectDataParser._getString(rawEvent, ObjectDataParser.SLOT, null);
                var eventData = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.EventData);
                eventData.type = 10 /* Frame */;
                eventData.name = ObjectDataParser._getString(rawEvent, ObjectDataParser.NAME, null);
                eventData.bone = this._armature.getBone(boneName);
                eventData.slot = this._armature.getSlot(slotName);
                if (ObjectDataParser.INTS in rawEvent) {
                    if (!eventData.data) {
                        eventData.data = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.CustomData);
                    }
                    var rawInts = rawEvent[ObjectDataParser.INTS];
                    for (var i_3 = 0, l_1 = rawInts.length; i_3 < l_1; ++i_3) {
                        eventData.data.ints.push(rawInts[i_3]);
                    }
                }
                if (ObjectDataParser.FLOATS in rawEvent) {
                    if (!eventData.data) {
                        eventData.data = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.CustomData);
                    }
                    var rawFloats = rawEvent[ObjectDataParser.FLOATS];
                    for (var i_4 = 0, l_2 = rawFloats.length; i_4 < l_2; ++i_4) {
                        eventData.data.floats.push(rawFloats[i_4]);
                    }
                }
                if (ObjectDataParser.STRINGS in rawEvent) {
                    if (!eventData.data) {
                        eventData.data = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.CustomData);
                    }
                    var rawStrings = rawEvent[ObjectDataParser.STRINGS];
                    for (var i_5 = 0, l_3 = rawStrings.length; i_5 < l_3; ++i_5) {
                        eventData.data.strings.push(rawStrings[i_5]);
                    }
                }
                events.push(eventData);
            }
        }
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseTransform = function (rawData, transform) {
        transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0.0) * this._armature.scale;
        transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0.0) * this._armature.scale;
        transform.skewX = Transform_1.Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0.0) * DragonBones_1.DragonBones.ANGLE_TO_RADIAN);
        transform.skewY = Transform_1.Transform.normalizeRadian(ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0.0) * DragonBones_1.DragonBones.ANGLE_TO_RADIAN);
        transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1.0);
        transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1.0);
    };
    /**
     * @private
     */
    ObjectDataParser.prototype._parseColorTransform = function (rawData, color) {
        color.alphaMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_MULTIPLIER, 100) * 0.01;
        color.redMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_MULTIPLIER, 100) * 0.01;
        color.greenMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_MULTIPLIER, 100) * 0.01;
        color.blueMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_MULTIPLIER, 100) * 0.01;
        color.alphaOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_OFFSET, 0);
        color.redOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_OFFSET, 0);
        color.greenOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_OFFSET, 0);
        color.blueOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_OFFSET, 0);
    };
    /**
     * @inheritDoc
     */
    ObjectDataParser.prototype.parseDragonBonesData = function (rawData, scale) {
        if (scale === void 0) { scale = 1; }
        if (rawData) {
            var version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, null);
            var compatibleVersion = ObjectDataParser._getString(rawData, ObjectDataParser.COMPATIBLE_VERSION, null);
            this._isOldData = version === ObjectDataParser.DATA_VERSION_2_3 || version === ObjectDataParser.DATA_VERSION_3_0;
            if (this._isOldData) {
                this._isGlobalTransform = ObjectDataParser._getBoolean(rawData, ObjectDataParser.IS_GLOBAL, true);
            }
            else {
                this._isGlobalTransform = false;
            }
            if (ObjectDataParser.DATA_VERSIONS.indexOf(version) >= 0 ||
                ObjectDataParser.DATA_VERSIONS.indexOf(compatibleVersion) >= 0) {
                var data = BaseObject_1.BaseObject.borrowObject(DragonBonesData_1.DragonBonesData);
                data.version = version;
                data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24);
                if (data.frameRate === 0) {
                    data.frameRate = 24;
                }
                if (ObjectDataParser.ARMATURE in rawData) {
                    this._data = data;
                    var rawArmatures = rawData[ObjectDataParser.ARMATURE];
                    for (var i = 0, l = rawArmatures.length; i < l; ++i) {
                        data.addArmature(this._parseArmature(rawArmatures[i], scale));
                    }
                    this._data = null;
                }
                return data;
            }
            else {
                throw new Error("Nonsupport data version.");
            }
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
        // return null;
    };
    /**
     * @inheritDoc
     */
    ObjectDataParser.prototype.parseTextureAtlasData = function (rawData, textureAtlasData, scale) {
        if (scale === void 0) { scale = 0.0; }
        if (rawData) {
            textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, null);
            textureAtlasData.width = ObjectDataParser._getNumber(rawData, ObjectDataParser.WIDTH, 0.0);
            textureAtlasData.height = ObjectDataParser._getNumber(rawData, ObjectDataParser.HEIGHT, 0.0);
            // Texture format.
            if (scale > 0.0) {
                textureAtlasData.scale = scale;
            }
            else {
                scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
            }
            scale = 1.0 / scale;
            if (ObjectDataParser.SUB_TEXTURE in rawData) {
                var rawTextures = rawData[ObjectDataParser.SUB_TEXTURE];
                for (var i = 0, l = rawTextures.length; i < l; ++i) {
                    var rawTexture = rawTextures[i];
                    var textureData = textureAtlasData.generateTexture();
                    textureData.name = ObjectDataParser._getString(rawTexture, ObjectDataParser.NAME, null);
                    textureData.rotated = ObjectDataParser._getBoolean(rawTexture, ObjectDataParser.ROTATED, false);
                    textureData.region.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.X, 0.0) * scale;
                    textureData.region.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.Y, 0.0) * scale;
                    textureData.region.width = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.WIDTH, 0.0) * scale;
                    textureData.region.height = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.HEIGHT, 0.0) * scale;
                    var frameWidth = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_WIDTH, -1.0);
                    var frameHeight = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_HEIGHT, -1.0);
                    if (frameWidth > 0.0 && frameHeight > 0.0) {
                        textureData.frame = TextureData_1.TextureData.generateRectangle();
                        textureData.frame.x = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_X, 0.0) * scale;
                        textureData.frame.y = ObjectDataParser._getNumber(rawTexture, ObjectDataParser.FRAME_Y, 0.0) * scale;
                        textureData.frame.width = frameWidth * scale;
                        textureData.frame.height = frameHeight * scale;
                    }
                    textureAtlasData.addTexture(textureData);
                }
            }
        }
        else {
            throw new Error(DragonBones_1.DragonBones.ARGUMENT_ERROR);
        }
    };
    /**
     * @deprecated
     * @see dragonBones.BaseFactory#parseDragonBonesData()
     */
    ObjectDataParser.getInstance = function () {
        if (!ObjectDataParser._instance) {
            ObjectDataParser._instance = new ObjectDataParser();
        }
        return ObjectDataParser._instance;
    };
    /**
     * @private
     */
    ObjectDataParser._instance = null;
    return ObjectDataParser;
}(DataParser_1.DataParser));
exports.ObjectDataParser = ObjectDataParser;
