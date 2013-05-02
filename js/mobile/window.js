goog.provide('ian.mobile.Window');

goog.require('goog.dom');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 * @param {!Element=} element The root element.
 */
ian.mobile.Window = function (element) {
  ian.mobile.View.call(this);

  this.element = element || goog.dom.getDocument().body;
};

goog.inherits(ian.mobile.Window, ian.mobile.View);
