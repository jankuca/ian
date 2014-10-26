goog.provide('ian.mobile.Window');

goog.require('goog.dom');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.Window = function () {
  ian.mobile.View.call(this);
};

goog.inherits(ian.mobile.Window, ian.mobile.View);


ian.mobile.Window.prototype.createDom = function () {
  var dom = this.getDomHelper();
  this.setElementInternal(dom.getDocument().body);
};
