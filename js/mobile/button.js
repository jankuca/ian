goog.provide('ian.mobile.Button');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.Button = function (template) {
  ian.mobile.View.call(this, template);

  this.label = '';
};

goog.inherits(ian.mobile.Button, ian.mobile.View);


ian.mobile.Button.prototype.setLabel = function (label) {
  this.label = label;
  goog.dom.setTextContent(this.element, label);
};


ian.mobile.Button.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();
  handler.listen(this.element, 'click', this.handleClick);
};


ian.mobile.Button.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var handler = this.getHandler();
  handler.unlisten(this.element, 'click', this.handleClick);
};


ian.mobile.Button.prototype.handleClick = function (e) {
  goog.dom.classes.add(this.element, 'active');

  this.dispatchEvent(e);
};
