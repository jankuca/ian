goog.provide('ian.TouchHandler');

goog.require('goog.dom');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {HTMLElement|string} el An element.
 */
ian.TouchHandler = function (el) {
  goog.events.EventTarget.call(this);

  if (!el) {
    throw new Error('Missing element or element identifier');
  }

  this.element = goog.dom.getElement(el);
  this.event_handler = new goog.events.EventHandler(this);

  this.active_touch = null;
  this.active_touch_started_at = 0;
  this.click_timeout = 300;
};

goog.inherits(ian.TouchHandler, goog.events.EventTarget);


ian.TouchHandler.prototype.init = function () {
  this.event_handler.listen(this.element, 'touchstart', this.ontouchstart);
  this.event_handler.listen(this.element, 'touchend', this.ontouchend);
};


ian.TouchHandler.prototype.ontouchstart = function (e) {
  var touches = e.touches;
  if (touches.length === 1) {
    this.active_touch = touches[0];
    this.active_touch_started_at = Date.now();
  } else {
    this.active_touch = null;
    this.active_touch_started_at = 0;
  }
};


ian.TouchHandler.prototype.ontouchend = function (e) {
  var touches = e.touches;
  if (touches.length === 1) {
    var touch = touches[0];
    var ended_at = Date.now();
    var old = this.active_touch;

    if (ended_at - this.active_touch_started_at < this.click_timeout) {
      if (old.clientX === touch.clientX && old.clientY === touch.clientY) {
        var click_e = new goog.events.Event('click');
        click_e.target = e.target;
        this.dispatchEvent(click_e);

        e.preventDefault();
      }
    }
  }

  this.active_touch = null;
  this.active_touch_started_at = 0;
};
