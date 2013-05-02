goog.provide('ian.mobile.Form');

goog.require('goog.dom');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.Form = function (template) {
  ian.mobile.View.call(this, template);
};

goog.inherits(ian.mobile.Form, ian.mobile.View);


ian.mobile.Form.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();
  handler.listen(this.element, 'submit', this.handleSubmit);
};


ian.mobile.Form.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var handler = this.getHandler();
  handler.unlisten(this.element, 'submit', this.handleSubmit);
};


ian.mobile.Form.prototype.handleSubmit = function (e) {
  e.preventDefault();
  this.dispatchEvent(e);
};
