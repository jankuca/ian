goog.provide('ian.MouseHandler');

goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {HTMLElement|string} el An element.
 */
ian.MouseHandler = function (el) {
  goog.events.EventTarget.call(this);

  if (!el) {
    throw new Error('Missing element or element identifier');
  }

  this.element = goog.dom.getElement(el);
  this.event_handler = new goog.events.EventHandler(this);
};

goog.inherits(ian.MouseHandler, goog.events.EventTarget);


ian.MouseHandler.prototype.init = function () {
  this.event_handler.listen(this.element, 'click', this.onclick);
};


ian.MouseHandler.prototype.onclick = function (e) {
  var target = e.target;
  if (target.nodeType === 3) {
    e.target = target.parentNode;
  }

  this.dispatchEvent(e);
};
