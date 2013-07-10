goog.provide('ian.fx.Dragger');

goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {Element} element The element to control.
 */
ian.fx.Dragger = function (element) {
  goog.events.EventTarget.call(this);

  this.element_ = element;

  this.handler_ = new goog.events.EventHandler(this);
  this.limits_ = new goog.math.Rect(-Infinity, -Infinity, Infinity, Infinity);

  this.position_ = new goog.math.Coordinate(0, 0);
  this.loadInitialPosition_();
};

goog.inherits(ian.fx.Dragger, goog.events.EventTarget);


/**
 * @param {!goog.math.Rect} limits Position limits.
 */
ian.fx.Dragger.prototype.setLimits = function (limits) {
  if (!limits) {
    limits = new goog.math.Rect(-Infinity, -Infinity, Infinity, Infinity);
  }

  this.limits_ = limits;
};


/**
 * @return {Element} The controlled element.
 */
ian.fx.Dragger.prototype.getElement = function () {
  return this.element_ || null;
};

/**
 * @param {!goog.events.Event} e A mouse/touch event.
 */
ian.fx.Dragger.prototype.startDrag = function (e) {
  this.move_e_type_ = 'mousemove';
  this.end_e_type_ = 'mouseup';
  this.cancel_e_type_ = null;

  if (e.type === 'touchstart') {
    this.move_e_type_ = 'touchmove';
    this.end_e_type_ = 'touchend';
    this.cancel_e_type_ = 'touchcancel';
  }

  this.last_coords_ = this.createCoordsForEvent_(e);
  this.start_coords_ = this.last_coords_;
  this.target_element_ = e.target;

  this.handler_.listen(this.element_, this.move_e_type_, this.move);
  this.handler_.listenOnce(this.element_, this.end_e_type_, this.endDrag);
  if (this.cancel_e_type_) {
    this.handler_.listenOnce(this.element_, this.cancel_e_type_, this.endDrag);
  }
};


/**
 * @param {!goog.events.Event} e A mouse/touch event.
 */
ian.fx.Dragger.prototype.move = function (e) {
  var coords = this.createCoordsForEvent_(e);
  var pos = this.position_;

  pos.translate(goog.math.Coordinate.difference(coords, this.last_coords_));

  if (!this.limits_.contains(pos)) {
    var top_left = this.limits_.getTopLeft();
    var bottom_right = this.limits_.getBottomRight();
    pos.x = Math.min(Math.max(top_left.x, pos.x), bottom_right.x);
    pos.y = Math.min(Math.max(top_left.y, pos.y), bottom_right.y);
  }

  this.updateStyle(pos);
  this.last_coords_ = coords;
};


ian.fx.Dragger.prototype.endDrag = function () {
  this.handler_.unlisten(this.element_, this.move_e_type_, this.move);
  this.handler_.unlisten(this.element_, this.end_e_type_, this.endDrag);
  this.handler_.unlisten(this.element_, this.cancel_e_type_, this.endDrag);

  if (goog.math.Coordinate.equals(this.last_coords_, this.start_coords_)) {
    this.target_element_.click();
  }

  this.last_coords_ = null;

  var end_e = new goog.events.Event('end');
  this.dispatchEvent(end_e);
};


/**
 * @param {!goog.math.Coordinate} pos The new element position.
 */
ian.fx.Dragger.prototype.updateStyle = function (pos) {
  var element = this.getElement();
  var style = {};

  var el_style = element.style;
  if ('transform' in el_style) {
    style['transform'] = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px, 0)';
  } else if ('webkitTransform' in el_style) {
    style['webkitTransform'] = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px, 0)';
  } else if ('MozTransform' in el_style) {
    style['MozTransform'] = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px, 0)';
  } else {
    style['left'] = pos.x + 'px';
    style['top'] = pos.y + 'px';
  }

  goog.style.setStyle(element, style);
};


ian.fx.Dragger.prototype.dispose = function () {
  this.handler_.dispose();
  this.handler_ = null;

  goog.base(this, 'dispose');
};


ian.fx.Dragger.prototype.loadInitialPosition_ = function () {
  var element = this.getElement();
  var pos = this.position_;

  var transform = element.style['transform'] ||
    element.style['webkitTransform'] ||
    element.style['MozTransform'];
  var translate_rx = /translate(?:3d)?\((-?\d+)px,\s*(-?\d+)px/;
  var transform_match = transform ? transform.match(translate_rx) : null;

  if (transform_match) {
    pos.x = Number(transform_match[1]);
    pos.y = Number(transform_match[2]);

  } else {
    pos.x = parseInt(goog.style.getComputedStyle(element, 'left'), 10);
    pos.y = parseInt(goog.style.getComputedStyle(element, 'top'), 10);
    if (isNaN(pos.x)) {
      pos.x = parseInt(goog.style.getCascadedStyle(element, 'left'), 10) || 0;
      pos.y = parseInt(goog.style.getCascadedStyle(element, 'top'), 10) || 0;
    }
  }
};


/**
 * @param {!goog.events.Event} e A mouse/touch event.
 */
ian.fx.Dragger.prototype.createCoordsForEvent_ = function (e) {
  var x = e.clientX;
  var y = e.clientY;
  if (e.type.substr(0, 5) === 'touch') {
    var browser_e = e.getBrowserEvent();
    x = (browser_e.touches || browser_e['currentTouches'])[0].clientX;
    y = (browser_e.touches || browser_e['currentTouches'])[0].clientY;
  }

  return new goog.math.Coordinate(x, y);
};
