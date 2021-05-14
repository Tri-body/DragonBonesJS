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
/**
 * @language zh_CN
 * 事件数据。
 * @version DragonBones 4.5
 */
var EventObject = /** @class */ (function (_super) {
    __extends(EventObject, _super);
    /**
     * @internal
     * @private
     */
    function EventObject() {
        return _super.call(this) || this;
    }
    /**
     * @private
     */
    EventObject.toString = function () {
        return "[class dragonBones.EventObject]";
    };
    /**
     * @private
     */
    EventObject.prototype._onClear = function () {
        this.type = null;
        this.name = null;
        this.frame = null;
        this.data = null;
        this.armature = null;
        this.bone = null;
        this.slot = null;
        this.animationState = null;
    };
    /**
     * @language zh_CN
     * 动画开始。
     * @version DragonBones 4.5
     */
    EventObject.START = "start";
    /**
     * @language zh_CN
     * 动画循环播放一次完成。
     * @version DragonBones 4.5
     */
    EventObject.LOOP_COMPLETE = "loopComplete";
    /**
     * @language zh_CN
     * 动画播放完成。
     * @version DragonBones 4.5
     */
    EventObject.COMPLETE = "complete";
    /**
     * @language zh_CN
     * 动画淡入开始。
     * @version DragonBones 4.5
     */
    EventObject.FADE_IN = "fadeIn";
    /**
     * @language zh_CN
     * 动画淡入完成。
     * @version DragonBones 4.5
     */
    EventObject.FADE_IN_COMPLETE = "fadeInComplete";
    /**
     * @language zh_CN
     * 动画淡出开始。
     * @version DragonBones 4.5
     */
    EventObject.FADE_OUT = "fadeOut";
    /**
     * @language zh_CN
     * 动画淡出完成。
     * @version DragonBones 4.5
     */
    EventObject.FADE_OUT_COMPLETE = "fadeOutComplete";
    /**
     * @language zh_CN
     * 动画帧事件。
     * @version DragonBones 4.5
     */
    EventObject.FRAME_EVENT = "frameEvent";
    /**
     * @language zh_CN
     * 动画声音事件。
     * @version DragonBones 4.5
     */
    EventObject.SOUND_EVENT = "soundEvent";
    return EventObject;
}(BaseObject_1.BaseObject));
exports.EventObject = EventObject;
