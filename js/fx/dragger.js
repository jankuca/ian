goog.provide('ian.fx.Dragger');

goog.require('goog.fx.Dragger');


/**
 * @constructor
 * @extends {goog.fx.Dragger}
 * @param {Element} target The element that will be dragged.
 * @param {Element=} opt_handle An optional handle to control the drag, if null
 *     the target is used.
 * @param {goog.math.Rect=} opt_limits Object containing left, top, width,
 *     and height.
  */
ian.fx.Dragger = function (target, opt_handle, opt_limits) {
  goog.fx.Dragger.call(this, target, opt_handle, opt_limits);
};

goog.inherits(ian.fx.Dragger, goog.fx.Dragger);


ian.fx.Dragger.prototype.defaultAction = function (x, y) {
  var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  if ('transform' in this.target.style) {
    this.target.style['transform'] = transform;
  } else if ('MozTransform' in this.target.style) {
    this.target.style['MozTransform'] = transform;
  } else if ('webkitTransform' in this.target.style) {
    this.target.style['webkitTransform'] = transform;
  } else {
    this.target.style.left = x + 'px';
    this.target.style.top = y + 'px';
  }
};
