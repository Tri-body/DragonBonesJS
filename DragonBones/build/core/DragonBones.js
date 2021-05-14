"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * DragonBones
 */
var DragonBones = /** @class */ (function () {
    function DragonBones() {
    }
    /**
     * @internal
     * @private
     */
    DragonBones.hasArmature = function (value) {
        return DragonBones._armatures.indexOf(value) >= 0;
    };
    /**
     * @internal
     * @private
     */
    DragonBones.addArmature = function (value) {
        if (value && DragonBones._armatures.indexOf(value) < 0) {
            DragonBones._armatures.push(value);
        }
    };
    /**
     * @internal
     * @private
     */
    DragonBones.removeArmature = function (value) {
        if (value) {
            var index = DragonBones._armatures.indexOf(value);
            if (index >= 0) {
                DragonBones._armatures.splice(index, 1);
            }
        }
    };
    /**
     * @private
     */
    DragonBones.PI_D = Math.PI * 2.0;
    /**
     * @private
     */
    DragonBones.PI_H = Math.PI / 2.0;
    /**
     * @private
     */
    DragonBones.PI_Q = Math.PI / 4.0;
    /**
     * @private
     */
    DragonBones.ANGLE_TO_RADIAN = Math.PI / 180.0;
    /**
     * @private
     */
    DragonBones.RADIAN_TO_ANGLE = 180.0 / Math.PI;
    /**
     * @private
     */
    DragonBones.SECOND_TO_MILLISECOND = 1000.0;
    /**
     * @internal
     * @private
     */
    DragonBones.NO_TWEEN = 100;
    DragonBones.VERSION = "5.0.0";
    /**
     * @internal
     * @private
     */
    DragonBones.ARGUMENT_ERROR = "Argument error.";
    /**
     * @private
     */
    DragonBones.yDown = true;
    /**
     * @private
     */
    DragonBones.debug = false;
    /**
     * @private
     */
    DragonBones.debugDraw = false;
    /**
     * @internal
     * @private
     */
    DragonBones._armatures = [];
    return DragonBones;
}());
exports.DragonBones = DragonBones;
