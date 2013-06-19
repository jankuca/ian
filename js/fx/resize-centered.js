goog.provide('ian.fx.ResizeCentered');

goog.require('goog.fx.dom.Resize');


/**
 * Creates an animation object that will resize an element between two widths
 * and heights and center it at each step.
 *
 * Start and End should be 2 dimensional arrays
 *
 * @constructor
 * @extends {goog.fx.dom.Resize}
 * @param {Element} element Dom Node to be used in the animation.
 * @param {Array.<number>} start 2D array for start width and height.
 * @param {Array.<number>} end 2D array for end width and height.
 * @param {number} time Length of animation in milliseconds.
 * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
 */
ian.fx.ResizeCentered = function(element, start, end, time, opt_acc) {
  goog.fx.dom.Resize.apply(this, arguments);
};
goog.inherits(ian.fx.ResizeCentered, goog.fx.dom.Resize);


/**
 * Animation event handler that will resize an element by setting its width and
 * height (inherited functionality) and its margins (negative).
 * @protected
 * @override
 */
ian.fx.ResizeCentered.prototype.updateStyle = function() {
  goog.base(this, 'updateStyle');

  this.element.style.marginLeft = -Math.round(this.coords[0] / 2) + 'px';
  this.element.style.marginTop = -Math.round(this.coords[1] / 2) + 'px';
};
