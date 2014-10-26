goog.provide('ian.mobile.Form');

goog.require('goog.dom');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.Form = function () {
  ian.mobile.View.call(this);
};

goog.inherits(ian.mobile.Form, ian.mobile.View);


ian.mobile.Form.prototype.createDom = function () {
  var dom = this.getDomHelper();
  var element = dom.createElement('form');

  this.setElementInternal(element);
};


ian.mobile.Form.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();
  var element = this.getElement();
  handler.listen(element, 'submit', this.handleSubmit);
};


ian.mobile.Form.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var handler = this.getHandler();
  var element = this.getElement();
  handler.unlisten(element, 'submit', this.handleSubmit);
};


ian.mobile.Form.prototype.handleSubmit = function (e) {
  e.preventDefault();
  this.dispatchEvent(e);
};
