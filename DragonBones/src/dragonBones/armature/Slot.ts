import { TransformObject } from "./TransformObject";
import { BlendMode, DisplayType, DragonBones, BoneType } from "../core/DragonBones";
import { Matrix } from "../geom/Matrix";
import { ColorTransform } from "../geom/ColorTransform";
import { DisplayData, VerticesData, MeshDisplayData, PathDisplayData, BoundingBoxDisplayData, ImageDisplayData, ArmatureDisplayData } from "../model/DisplayData";
import { Armature } from "./Armature";
import { SlotData } from "../model/ArmatureData";
import { BoundingBoxData } from "../model/BoundingBoxData";
import { TextureData } from "../model/TextureAtlasData";
import { DeformVertices } from "./DeformVertices";
import { Bone } from "./Bone";
import { BaseObject } from "../core/BaseObject";
import { ActionData } from "../model/UserData";
import { EventObject } from "../event/EventObject";
import { Surface } from "./Surface";

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2012-2018 DragonBones team and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
    /**
     * - The slot attached to the armature, controls the display status and properties of the display object.
     * A bone can contain multiple slots.
     * A slot can contain multiple display objects, displaying only one of the display objects at a time,
     * but you can toggle the display object into frame animation while the animation is playing.
     * The display object can be a normal texture, or it can be a display of a child armature, a grid display object,
     * and a custom other display object.
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language en_US
     */
    /**
     * - 插槽附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    export abstract class Slot extends TransformObject {
        /**
         * - Displays the animated state or mixed group name controlled by the object, set to null to be controlled by all animation states.
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 显示对象受到控制的动画状态或混合组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public displayController: string | null;
        protected _displayDirty: boolean;
        protected _zOrderDirty: boolean;
        protected _visibleDirty: boolean;
        protected _blendModeDirty: boolean;
        /**
         * @internal
         */
        public _colorDirty: boolean;
        protected _transformDirty: boolean;
        protected _visible: boolean;
        protected _blendMode: BlendMode;
        protected _displayIndex: number;
        protected _animationDisplayIndex: number;
        /**
         * @internal
         */
        public _zOrder: number;
        protected _cachedFrameIndex: number;
        /**
         * @internal
         */
        public _pivotX: number;
        /**
         * @internal
         */
        public _pivotY: number;
        protected readonly _localMatrix: Matrix = new Matrix();
        /**
         * @internal
         */
        public readonly _colorTransform: ColorTransform = new ColorTransform();
        protected readonly _displayDatas: Array<DisplayData | null> = [];
        protected readonly _displayList: Array<any | Armature> = [];
        /**
         * @internal
         */
        public _slotData: SlotData;
        protected _rawDisplayDatas: Array<DisplayData | null> | null;
        /**
         * @internal
         */
        public _displayData: DisplayData | null;
        protected _boundingBoxData: BoundingBoxData | null;
        protected _textureData: TextureData | null;
        /**
         * @internal
         */
        public _deformVertices: DeformVertices | null = null;
        protected _rawDisplay: any = null; // Initial value.
        protected _meshDisplay: any = null; // Initial value.
        protected _display: any;
        protected _childArmature: Armature | null;
        /**
         * @private
         */
        protected _parent: Bone;
        /**
         * @internal
         */
        public _cachedFrameIndices: Array<number> | null;

        protected _onClear(): void {
            super._onClear();

            const disposeDisplayList: Array<any> = [];
            for (const eachDisplay of this._displayList) {
                if (
                    eachDisplay !== null && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (const eachDisplay of disposeDisplayList) {
                if (eachDisplay instanceof Armature) {
                    eachDisplay.dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay, true);
                }
            }

            if (this._deformVertices !== null) {
                this._deformVertices.returnToPool();
            }

            if (this._meshDisplay !== null && this._meshDisplay !== this._rawDisplay) { // May be _meshDisplay and _rawDisplay is the same one.
                this._disposeDisplay(this._meshDisplay, false);
            }

            if (this._rawDisplay !== null) {
                this._disposeDisplay(this._rawDisplay, false);
            }

            this.displayController = null;

            this._displayDirty = false;
            this._zOrderDirty = false;
            this._blendModeDirty = false;
            this._colorDirty = false;
            this._transformDirty = false;
            this._visible = true;
            this._blendMode = BlendMode.Normal;
            this._displayIndex = -1;
            this._animationDisplayIndex = -1;
            this._zOrder = 0;
            this._cachedFrameIndex = -1;
            this._pivotX = 0.0;
            this._pivotY = 0.0;
            this._localMatrix.identity();
            this._colorTransform.identity();
            this._displayList.length = 0;
            this._displayDatas.length = 0;
            this._slotData = null as any; //
            this._rawDisplayDatas = null;
            this._displayData = null;
            this._boundingBoxData = null;
            this._textureData = null;
            this._deformVertices = null;
            this._rawDisplay = null;
            this._meshDisplay = null;
            this._display = null;
            this._childArmature = null;
            this._parent = null as any; //
            this._cachedFrameIndices = null;
        }

        protected abstract _initDisplay(value: any, isRetain: boolean): void;
        protected abstract _disposeDisplay(value: any, isRelease: boolean): void;
        protected abstract _onUpdateDisplay(): void;
        protected abstract _addDisplay(): void;
        protected abstract _replaceDisplay(value: any): void;
        protected abstract _removeDisplay(): void;
        protected abstract _updateZOrder(): void;
        /**
         * @internal
         */
        public abstract _updateVisible(): void;
        protected abstract _updateBlendMode(): void;
        protected abstract _updateColor(): void;
        protected abstract _updateFrame(): void;
        protected abstract _updateMesh(): void;
        /**
         * @internal
         */
        public abstract _updateGlueMesh(): void;
        protected abstract _updateTransform(): void;
        protected abstract _identityTransform(): void;
        /**
         * - Support default skin data.
         */
        protected _getDefaultRawDisplayData(displayIndex: number): DisplayData | null {
            const defaultSkin = this._armature._armatureData.defaultSkin;
            if (defaultSkin !== null) {
                const defaultRawDisplayDatas = defaultSkin.getDisplays(this._slotData.name);
                if (defaultRawDisplayDatas !== null) {
                    return displayIndex < defaultRawDisplayDatas.length ? defaultRawDisplayDatas[displayIndex] : null;
                }
            }

            return null;
        }

        protected _updateDisplayData(): void {
            const prevDisplayData = this._displayData;
            const prevVerticesData = this._deformVertices !== null ? this._deformVertices.verticesData : null;
            const prevTextureData = this._textureData;
            let rawDisplayData: DisplayData | null = null;
            let currentVerticesData: VerticesData | null = null;

            this._displayData = null;
            this._boundingBoxData = null;
            this._textureData = null;

            if (this._displayIndex >= 0) {
                if (this._rawDisplayDatas !== null) {
                    rawDisplayData = this._displayIndex < this._rawDisplayDatas.length ? this._rawDisplayDatas[this._displayIndex] : null;
                }

                if (rawDisplayData === null) {
                    rawDisplayData = this._getDefaultRawDisplayData(this._displayIndex);
                }

                if (this._displayIndex < this._displayDatas.length) {
                    this._displayData = this._displayDatas[this._displayIndex];
                }
            }

            if (this._displayData !== null) {
                if (this._displayData.type === DisplayType.Mesh) {
                    currentVerticesData = (this._displayData as MeshDisplayData).vertices;
                }
                else if (this._displayData.type === DisplayType.Path) {
                    currentVerticesData = (this._displayData as PathDisplayData).vertices;
                }
                else if (rawDisplayData !== null) {
                    if (rawDisplayData.type === DisplayType.Mesh) {
                        currentVerticesData = (rawDisplayData as MeshDisplayData).vertices;
                    }
                    else if (rawDisplayData.type === DisplayType.Path) {
                        currentVerticesData = (rawDisplayData as PathDisplayData).vertices;
                    }
                }

                if (this._displayData.type === DisplayType.BoundingBox) {
                    this._boundingBoxData = (this._displayData as BoundingBoxDisplayData).boundingBox;
                }
                else if (rawDisplayData !== null) {
                    if (rawDisplayData.type === DisplayType.BoundingBox) {
                        this._boundingBoxData = (rawDisplayData as BoundingBoxDisplayData).boundingBox;
                    }
                }

                if (this._displayData.type === DisplayType.Image) {
                    this._textureData = (this._displayData as ImageDisplayData).texture;
                }
                else if (this._displayData.type === DisplayType.Mesh) {
                    this._textureData = (this._displayData as MeshDisplayData).texture;
                }
            }

            if (this._displayData !== prevDisplayData || currentVerticesData !== prevVerticesData || this._textureData !== prevTextureData) {
                // Update pivot offset.
                if (currentVerticesData === null && this._textureData !== null) { // TODO
                    const imageDisplayData = this._displayData as ImageDisplayData;
                    const scale = this._textureData.parent.scale * this._armature._armatureData.scale;
                    const frame = this._textureData.frame;

                    this._pivotX = imageDisplayData.pivot.x;
                    this._pivotY = imageDisplayData.pivot.y;

                    const rect = frame !== null ? frame : this._textureData.region;
                    let width = rect.width;
                    let height = rect.height;

                    if (this._textureData.rotated && frame === null) {
                        width = rect.height;
                        height = rect.width;
                    }

                    this._pivotX *= width * scale;
                    this._pivotY *= height * scale;

                    if (frame !== null) {
                        this._pivotX += frame.x * scale;
                        this._pivotY += frame.y * scale;
                    }

                    // Update replace pivot. TODO
                    if (this._displayData !== null && rawDisplayData !== null && this._displayData !== rawDisplayData) {
                        rawDisplayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX -= Slot._helpPoint.x;
                        this._pivotY -= Slot._helpPoint.y;

                        this._displayData.transform.toMatrix(Slot._helpMatrix);
                        Slot._helpMatrix.invert();
                        Slot._helpMatrix.transformPoint(0.0, 0.0, Slot._helpPoint);
                        this._pivotX += Slot._helpPoint.x;
                        this._pivotY += Slot._helpPoint.y;
                    }

                    if (!DragonBones.yDown) {
                        this._pivotY = (this._textureData.rotated ? this._textureData.region.width : this._textureData.region.height) * scale - this._pivotY;
                    }
                }
                else {
                    this._pivotX = 0.0;
                    this._pivotY = 0.0;
                }

                // Update original transform.
                if (rawDisplayData !== null) { // Compatible.
                    this.origin = rawDisplayData.transform;
                }
                else if (this._displayData !== null) { // Compatible.
                    this.origin = this._displayData.transform;
                }
                else {
                    this.origin = null;
                }

                // Update vertices.
                if (currentVerticesData !== prevVerticesData) {
                    if (this._deformVertices === null) {
                        this._deformVertices = BaseObject.borrowObject(DeformVertices);
                    }

                    this._deformVertices.init(currentVerticesData, this._armature);
                }
                else if (this._deformVertices !== null && this._textureData !== prevTextureData) { // Update mesh after update frame.
                    this._deformVertices.verticesDirty = true;
                }

                this._displayDirty = true;
                this._transformDirty = true;
            }
        }

        protected _updateDisplay(): void {
            const prevDisplay = this._display !== null ? this._display : this._rawDisplay;
            const prevChildArmature = this._childArmature;

            // Update display and child armature.
            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._display = this._displayList[this._displayIndex];
                if (this._display !== null && this._display instanceof Armature) {
                    this._childArmature = this._display as Armature;
                    this._display = this._childArmature.display;
                }
                else {
                    this._childArmature = null;
                }
            }
            else {
                this._display = null;
                this._childArmature = null;
            }

            // Update display.
            const currentDisplay = this._display !== null ? this._display : this._rawDisplay;
            if (currentDisplay !== prevDisplay) {
                this._onUpdateDisplay();
                this._replaceDisplay(prevDisplay);

                this._transformDirty = true;
                this._visibleDirty = true;
                this._blendModeDirty = true;
                this._colorDirty = true;
            }

            // Update frame.
            if (currentDisplay === this._rawDisplay || currentDisplay === this._meshDisplay) {
                this._updateFrame();
            }

            // Update child armature.
            if (this._childArmature !== prevChildArmature) {
                if (prevChildArmature !== null) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    prevChildArmature.clock = null;
                    if (prevChildArmature.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }

                if (this._childArmature !== null) {
                    this._childArmature._parent = this; // Update child armature parent.
                    this._childArmature.clock = this._armature.clock;
                    if (this._childArmature.inheritAnimation) { // Set child armature cache frameRate.
                        if (this._childArmature.cacheFrameRate === 0) {
                            const cacheFrameRate = this._armature.cacheFrameRate;
                            if (cacheFrameRate !== 0) {
                                this._childArmature.cacheFrameRate = cacheFrameRate;
                            }
                        }

                        // Child armature action.
                        let actions: Array<ActionData> | null = null;
                        if (this._displayData !== null && this._displayData.type === DisplayType.Armature) {
                            actions = (this._displayData as ArmatureDisplayData).actions;
                        }
                        else if (this._displayIndex >= 0 && this._rawDisplayDatas !== null) {
                            let rawDisplayData = this._displayIndex < this._rawDisplayDatas.length ? this._rawDisplayDatas[this._displayIndex] : null;

                            if (rawDisplayData === null) {
                                rawDisplayData = this._getDefaultRawDisplayData(this._displayIndex);
                            }

                            if (rawDisplayData !== null && rawDisplayData.type === DisplayType.Armature) {
                                actions = (rawDisplayData as ArmatureDisplayData).actions;
                            }
                        }

                        if (actions !== null && actions.length > 0) {
                            for (const action of actions) {
                                const eventObject = BaseObject.borrowObject(EventObject);
                                EventObject.actionDataToInstance(action, eventObject, this._armature);
                                eventObject.slot = this;
                                this._armature._bufferAction(eventObject, false);
                            }
                        }
                        else {
                            this._childArmature.animation.play();
                        }
                    }
                }
            }
        }

        protected _updateGlobalTransformMatrix(isCache: boolean): void {
            const parentMatrix = this._parent._boneData.type === BoneType.Bone ? this._parent.globalTransformMatrix : (this._parent as Surface)._getGlobalTransformMatrix(this.global.x, this.global.y);
            this.globalTransformMatrix.copyFrom(this._localMatrix);
            this.globalTransformMatrix.concat(parentMatrix);

            if (isCache) {
                this.global.fromMatrix(this.globalTransformMatrix);
            }
            else {
                this._globalDirty = true;
            }
        }
        /**
         * @internal
         */
        public _setDisplayIndex(value: number, isAnimation: boolean = false): boolean {
            if (isAnimation) {
                if (this._animationDisplayIndex === value) {
                    return false;
                }

                this._animationDisplayIndex = value;
            }

            if (this._displayIndex === value) {
                return false;
            }

            this._displayIndex = value;
            this._displayDirty = true;

            this._updateDisplayData();

            return this._displayDirty;
        }
        /**
         * @internal
         */
        public _setZorder(value: number): boolean {
            if (this._zOrder === value) {
                //return false;
            }

            this._zOrder = value;
            this._zOrderDirty = true;

            return this._zOrderDirty;
        }
        /**
         * @internal
         */
        public _setColor(value: ColorTransform): boolean {
            this._colorTransform.copyFrom(value);
            this._colorDirty = true;

            return this._colorDirty;
        }
        /**
         * @internal
         */
        public _setDisplayList(value: Array<any> | null): boolean {
            if (value !== null && value.length > 0) {
                if (this._displayList.length !== value.length) {
                    this._displayList.length = value.length;
                }

                for (let i = 0, l = value.length; i < l; ++i) { // Retain input render displays.
                    const eachDisplay = value[i];
                    if (
                        eachDisplay !== null && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                        !(eachDisplay instanceof Armature) && this._displayList.indexOf(eachDisplay) < 0
                    ) {
                        this._initDisplay(eachDisplay, true);
                    }

                    this._displayList[i] = eachDisplay;
                }
            }
            else if (this._displayList.length > 0) {
                this._displayList.length = 0;
            }

            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._displayDirty = this._display !== this._displayList[this._displayIndex];
            }
            else {
                this._displayDirty = this._display !== null;
            }

            this._updateDisplayData();

            return this._displayDirty;
        }
        /**
         * @internal
         */
        public init(slotData: SlotData, armatureValue: Armature, rawDisplay: any, meshDisplay: any): void {
            if (this._slotData !== null) {
                return;
            }

            this._slotData = slotData;
            //
            this._visibleDirty = true;
            this._blendModeDirty = true;
            this._colorDirty = true;
            this._blendMode = this._slotData.blendMode;
            this._zOrder = this._slotData.zOrder;
            this._colorTransform.copyFrom(this._slotData.color);
            this._rawDisplay = rawDisplay;
            this._meshDisplay = meshDisplay;
            //
            this._armature = armatureValue;
            //
            const slotParent = this._armature.getBone(this._slotData.parent.name);
            if (slotParent !== null) {
                this._parent = slotParent;
            }
            else {
                // Never;
            }

            this._armature._addSlot(this);
            //
            this._initDisplay(this._rawDisplay, false);
            if (this._rawDisplay !== this._meshDisplay) {
                this._initDisplay(this._meshDisplay, false);
            }

            this._onUpdateDisplay();
            this._addDisplay();
        }
        /**
         * @internal
         */
        public update(cacheFrameIndex: number): void {
            if (this._displayDirty) {
                this._displayDirty = false;
                this._updateDisplay();

                // TODO remove slot offset.
                if (this._transformDirty) { // Update local matrix. (Only updated when both display and transform are dirty.)
                    if (this.origin !== null) {
                        this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
                    }
                    else {
                        this.global.copyFrom(this.offset).toMatrix(this._localMatrix);
                    }
                }
            }

            if (this._zOrderDirty) {
                this._zOrderDirty = false;
                this._updateZOrder();
            }

            if (cacheFrameIndex >= 0 && this._cachedFrameIndices !== null) {
                const cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex];
                if (cachedFrameIndex >= 0 && this._cachedFrameIndex === cachedFrameIndex) { // Same cache.
                    this._transformDirty = false;
                }
                else if (cachedFrameIndex >= 0) { // Has been Cached.
                    this._transformDirty = true;
                    this._cachedFrameIndex = cachedFrameIndex;
                }
                else if (this._transformDirty || this._parent._childrenTransformDirty) { // Dirty.
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
                else if (this._cachedFrameIndex >= 0) { // Same cache, but not set index yet.
                    this._transformDirty = false;
                    this._cachedFrameIndices[cacheFrameIndex] = this._cachedFrameIndex;
                }
                else { // Dirty.
                    this._transformDirty = true;
                    this._cachedFrameIndex = -1;
                }
            }
            else if (this._transformDirty || this._parent._childrenTransformDirty) { // Dirty.
                cacheFrameIndex = -1;
                this._transformDirty = true;
                this._cachedFrameIndex = -1;
            }

            if (this._display === null) {
                return;
            }

            if (this._visibleDirty) {
                this._visibleDirty = false;
                this._updateVisible();
            }

            if (this._blendModeDirty) {
                this._blendModeDirty = false;
                this._updateBlendMode();
            }

            if (this._colorDirty) {
                this._colorDirty = false;
                this._updateColor();
            }

            if (this._deformVertices !== null && this._deformVertices.verticesData !== null && this._display === this._meshDisplay) {
                const isSkinned = this._deformVertices.verticesData.weight !== null;
                const isSurface = this._parent._boneData.type !== BoneType.Bone;

                if (
                    this._deformVertices.verticesDirty ||
                    (isSkinned && this._deformVertices.isBonesUpdate()) ||
                    (isSurface && this._parent._childrenTransformDirty)
                ) {
                    this._deformVertices.verticesDirty = false;
                    this._updateMesh();
                }

                if (isSkinned || isSurface) { // Compatible.
                    return;
                }
            }

            if (this._transformDirty) {
                this._transformDirty = false;

                if (this._cachedFrameIndex < 0) {
                    const isCache = cacheFrameIndex >= 0;
                    this._updateGlobalTransformMatrix(isCache);

                    if (isCache && this._cachedFrameIndices !== null) {
                        this._cachedFrameIndex = this._cachedFrameIndices[cacheFrameIndex] = this._armature._armatureData.setCacheFrame(this.globalTransformMatrix, this.global);
                    }
                }
                else {
                    this._armature._armatureData.getCacheFrame(this.globalTransformMatrix, this.global, this._cachedFrameIndex);
                }

                this._updateTransform();
            }
        }
        /**
         * @private
         */
        public updateTransformAndMatrix(): void {
            if (this._transformDirty) {
                this._transformDirty = false;
                this._updateGlobalTransformMatrix(false);
            }
        }
        /**
         * @private
         */
        public replaceDisplayData(value: DisplayData | null, displayIndex: number = -1): void {
            if (displayIndex < 0) {
                if (this._displayIndex < 0) {
                    displayIndex = 0;
                }
                else {
                    displayIndex = this._displayIndex;
                }
            }

            if (this._displayDatas.length <= displayIndex) {
                this._displayDatas.length = displayIndex + 1;

                for (let i = 0, l = this._displayDatas.length; i < l; ++i) { // Clean undefined.
                    if (!this._displayDatas[i]) {
                        this._displayDatas[i] = null;
                    }
                }
            }

            this._displayDatas[displayIndex] = value;
        }
        /**
         * - Check whether a specific point is inside a custom bounding box in the slot.
         * The coordinate system of the point is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param x - The horizontal coordinate of the point.
         * @param y - The vertical coordinate of the point.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定点是否在插槽的自定义边界框内。
         * 点的坐标系为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param x - 点的水平坐标。
         * @param y - 点的垂直坐标。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public containsPoint(x: number, y: number): boolean {
            if (this._boundingBoxData === null) {
                return false;
            }

            this.updateTransformAndMatrix();

            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(x, y, Slot._helpPoint);

            return this._boundingBoxData.containsPoint(Slot._helpPoint.x, Slot._helpPoint.y);
        }
        /**
         * - Check whether a specific segment intersects a custom bounding box for the slot.
         * The coordinate system of the segment and intersection is the inner coordinate system of the armature.
         * Custom bounding boxes need to be customized in Dragonbones Pro.
         * @param xA - The horizontal coordinate of the beginning of the segment.
         * @param yA - The vertical coordinate of the beginning of the segment.
         * @param xB - The horizontal coordinate of the end point of the segment.
         * @param yB - The vertical coordinate of the end point of the segment.
         * @param intersectionPointA - The first intersection at which a line segment intersects the bounding box from the beginning to the end. (If not set, the intersection point will not calculated)
         * @param intersectionPointB - The first intersection at which a line segment intersects the bounding box from the end to the beginning. (If not set, the intersection point will not calculated)
         * @param normalRadians - The normal radians of the tangent of the intersection boundary box. [x: Normal radian of the first intersection tangent, y: Normal radian of the second intersection tangent] (If not set, the normal will not calculated)
         * @returns Intersection situation. [1: Disjoint and segments within the bounding box, 0: Disjoint, 1: Intersecting and having a nodal point and ending in the bounding box, 2: Intersecting and having a nodal point and starting at the bounding box, 3: Intersecting and having two intersections, N: Intersecting and having N intersections]
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 检查特定线段是否与插槽的自定义边界框相交。
         * 线段和交点的坐标系均为骨架内坐标系。
         * 自定义边界框需要在 DragonBones Pro 中自定义。
         * @param xA - 线段起点的水平坐标。
         * @param yA - 线段起点的垂直坐标。
         * @param xB - 线段终点的水平坐标。
         * @param yB - 线段终点的垂直坐标。
         * @param intersectionPointA - 线段从起点到终点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param intersectionPointB - 线段从终点到起点与边界框相交的第一个交点。 （如果未设置，则不计算交点）
         * @param normalRadians - 交点边界框切线的法线弧度。 [x: 第一个交点切线的法线弧度, y: 第二个交点切线的法线弧度] （如果未设置，则不计算法线）
         * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public intersectsSegment(
            xA: number, yA: number, xB: number, yB: number,
            intersectionPointA: { x: number, y: number } | null = null,
            intersectionPointB: { x: number, y: number } | null = null,
            normalRadians: { x: number, y: number } | null = null
        ): number {
            if (this._boundingBoxData === null) {
                return 0;
            }

            this.updateTransformAndMatrix();
            Slot._helpMatrix.copyFrom(this.globalTransformMatrix);
            Slot._helpMatrix.invert();
            Slot._helpMatrix.transformPoint(xA, yA, Slot._helpPoint);
            xA = Slot._helpPoint.x;
            yA = Slot._helpPoint.y;
            Slot._helpMatrix.transformPoint(xB, yB, Slot._helpPoint);
            xB = Slot._helpPoint.x;
            yB = Slot._helpPoint.y;

            const intersectionCount = this._boundingBoxData.intersectsSegment(xA, yA, xB, yB, intersectionPointA, intersectionPointB, normalRadians);
            if (intersectionCount > 0) {
                if (intersectionCount === 1 || intersectionCount === 2) {
                    if (intersectionPointA !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                        if (intersectionPointB !== null) {
                            intersectionPointB.x = intersectionPointA.x;
                            intersectionPointB.y = intersectionPointA.y;
                        }
                    }
                    else if (intersectionPointB !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }
                else {
                    if (intersectionPointA !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointA.x, intersectionPointA.y, intersectionPointA);
                    }

                    if (intersectionPointB !== null) {
                        this.globalTransformMatrix.transformPoint(intersectionPointB.x, intersectionPointB.y, intersectionPointB);
                    }
                }

                if (normalRadians !== null) {
                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.x), Math.sin(normalRadians.x), Slot._helpPoint, true);
                    normalRadians.x = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);

                    this.globalTransformMatrix.transformPoint(Math.cos(normalRadians.y), Math.sin(normalRadians.y), Slot._helpPoint, true);
                    normalRadians.y = Math.atan2(Slot._helpPoint.y, Slot._helpPoint.x);
                }
            }

            return intersectionCount;
        }
        /**
         * - Forces the slot to update the state of the display object in the next frame.
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 强制插槽在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public invalidUpdate(): void {
            this._displayDirty = true;
            this._transformDirty = true;
        }
        /**
         * - The visible of slot's display object.
         * @default true
         * @version DragonBones 5.6
         * @language en_US
         */
        /**
         * - 插槽的显示对象的可见。
         * @default true
         * @version DragonBones 5.6
         * @language zh_CN
         */
        public get visible(): boolean {
            return this._visible;
        }
        public set visible(value: boolean) {
            if (this._visible === value) {
                return;
            }

            this._visible = value;
            this._updateVisible();
        }
        /**
         * - The index of the display object displayed in the display list.
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.displayIndex = 3;
         *     slot.displayController = "none";
         * </pre>
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 此时显示的显示对象在显示列表中的索引。
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         *     slot.displayIndex = 3;
         *     slot.displayController = "none";
         * </pre>
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get displayIndex(): number {
            return this._displayIndex;
        }
        public set displayIndex(value: number) {
            if (this._setDisplayIndex(value)) {
                this.update(-1);
            }
        }
        /**
         * - The slot name.
         * @see dragonBones.SlotData#name
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽名称。
         * @see dragonBones.SlotData#name
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get name(): string {
            return this._slotData.name;
        }
        /**
         * - Contains a display list of display objects or child armatures.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get displayList(): Array<any> {
            return this._displayList.concat();
        }
        public set displayList(value: Array<any>) {
            const backupDisplayList = this._displayList.concat(); // Copy.
            const disposeDisplayList = new Array<any>();

            if (this._setDisplayList(value)) {
                this.update(-1);
            }

            // Release replaced displays.
            for (const eachDisplay of backupDisplayList) {
                if (
                    eachDisplay !== null && eachDisplay !== this._rawDisplay && eachDisplay !== this._meshDisplay &&
                    this._displayList.indexOf(eachDisplay) < 0 &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (const eachDisplay of disposeDisplayList) {
                if (eachDisplay instanceof Armature) {
                    // (eachDisplay as Armature).dispose();
                }
                else {
                    this._disposeDisplay(eachDisplay, true);
                }
            }
        }
        /**
         * - The slot data.
         * @see dragonBones.SlotData
         * @version DragonBones 4.5
         * @language en_US
         */
        /**
         * - 插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        public get slotData(): SlotData {
            return this._slotData;
        }
        /**
         * @private
         */
        public get rawDisplayDatas(): Array<DisplayData | null> | null {
            return this._rawDisplayDatas;
        }
        public set rawDisplayDatas(value: Array<DisplayData | null> | null) {
            if (this._rawDisplayDatas === value) {
                return;
            }

            this._displayDirty = true;
            this._rawDisplayDatas = value;

            if (this._rawDisplayDatas !== null) {
                this._displayDatas.length = this._rawDisplayDatas.length;

                for (let i = 0, l = this._displayDatas.length; i < l; ++i) {
                    let rawDisplayData = this._rawDisplayDatas[i];

                    if (rawDisplayData === null) {
                        rawDisplayData = this._getDefaultRawDisplayData(i);
                    }

                    this._displayDatas[i] = rawDisplayData;
                }
            }
            else {
                this._displayDatas.length = 0;
            }
        }
        /**
         * @private
         */
        public get displayData(): DisplayData | null {
            return this._displayData;
        }
        /**
         * - The custom bounding box data for the slot at current time.
         * @version DragonBones 5.0
         * @language en_US
         */
        /**
         * - 插槽此时的自定义包围盒数据。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        public get boundingBoxData(): BoundingBoxData | null {
            return this._boundingBoxData;
        }
        /**
         * @private
         */
        public get rawDisplay(): any {
            return this._rawDisplay;
        }
        /**
         * @private
         */
        public get meshDisplay(): any {
            return this._meshDisplay;
        }
        /**
         * - The display object that the slot displays at this time.
         * @example
         * <pre>
         *     let slot = armature.getSlot("text");
         *     slot.display = new yourEngine.TextField();
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽此时显示的显示对象。
         * @example
         * <pre>
         *     let slot = armature.getSlot("text");
         *     slot.display = new yourEngine.TextField();
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get display(): any {
            return this._display;
        }
        public set display(value: any) {
            if (this._display === value) {
                return;
            }

            const displayListLength = this._displayList.length;
            if (this._displayIndex < 0 && displayListLength === 0) {  // Emprty.
                this._displayIndex = 0;
            }

            if (this._displayIndex < 0) {
                return;
            }
            else {
                const replaceDisplayList = this.displayList; // Copy.
                if (displayListLength <= this._displayIndex) {
                    replaceDisplayList.length = this._displayIndex + 1;
                }

                replaceDisplayList[this._displayIndex] = value;
                this.displayList = replaceDisplayList;
            }
        }
        /**
         * - The child armature that the slot displayed at current time.
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         * let prevChildArmature = slot.childArmature;
         * if (prevChildArmature) {
         * prevChildArmature.dispose();
         *     }
         *     slot.childArmature = factory.buildArmature("weapon_blabla", "weapon_blabla_project");
         * </pre>
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 插槽此时显示的子骨架。
         * 注意，被替换的对象或子骨架并不会被回收，根据语言和引擎的不同，需要额外处理。
         * @example
         * <pre>
         *     let slot = armature.getSlot("weapon");
         * let prevChildArmature = slot.childArmature;
         * if (prevChildArmature) {
         * prevChildArmature.dispose();
         *     }
         *     slot.childArmature = factory.buildArmature("weapon_blabla", "weapon_blabla_project");
         * </pre>
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get childArmature(): Armature | null {
            return this._childArmature;
        }
        public set childArmature(value: Armature | null) {
            if (this._childArmature === value) {
                return;
            }

            this.display = value;
        }
        /**
         * - The parent bone to which it belongs.
         * @version DragonBones 3.0
         * @language en_US
         */
        /**
         * - 所属的父骨骼。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        public get parent(): Bone {
            return this._parent;
        }

        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        public getDisplay(): any {
            return this._display;
        }
        /**
         * - Deprecated, please refer to {@link #display}.
         * @deprecated
         * @language en_US
         */
        /**
         * - 已废弃，请参考 {@link #display}。
         * @deprecated
         * @language zh_CN
         */
        public setDisplay(value: any) {
            this.display = value;
        }
    }