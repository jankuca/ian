goog.provide('ian.mobile.Button');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.Button = function () {
  ian.mobile.View.call(this);

  this.type = 'submit';
  this.label = '';
};

goog.inherits(ian.mobile.Button, ian.mobile.View);


ian.mobile.Button.prototype.createDom = function () {
  var dom = this.getDomHelper();
  var element = dom.createDom('button', {
    'type': this.type
  });

  this.setElementInternal(element);
};


ian.mobile.Button.prototype.setLabel = function (label) {
  this.label = label;

  var element = this.getElement();
  goog.dom.setTextContent(element, label);
};


ian.mobile.Button.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();
  var element = this.getElement();
  handler.listen(element, 'click', this.handleClick);
};


ian.mobile.Button.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var handler = this.getHandler();
  var element = this.getElement();
  handler.unlisten(element, 'click', this.handleClick);
};


ian.mobile.Button.prototype.handleClick = function (e) {
  var element = this.getElement();
  goog.dom.classlist.add(element, 'active');

  this.dispatchEvent(e);
};
