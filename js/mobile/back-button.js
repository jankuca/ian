goog.provide('ian.mobile.BackButton');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('ian.mobile.Button');


/**
 * @constructor
 * @extends {ian.mobile.Button}
 */
ian.mobile.BackButton = function () {
  ian.mobile.Button.call(this);

  this.type = 'back';
  this.label = 'Back';
};

goog.inherits(ian.mobile.BackButton, ian.mobile.Button);


ian.mobile.BackButton.prototype.createDom = function () {
  var dom = this.getDomHelper();
  var element = dom.createDom('span', {
    'class': 'ui-back-button'
  });

  dom.setTextContent(element, this.label);

  this.setElementInternal(element);
};


ian.mobile.BackButton.prototype.setLabel = function (label) {
  this.label = label;

  var element = this.getElement();
  goog.dom.setTextContent(element, label);
};


ian.mobile.BackButton.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();
  var element = this.getElement();
  handler.listen(element, 'click', this.handleClick);
};


ian.mobile.BackButton.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var handler = this.getHandler();
  var element = this.getElement();
  handler.unlisten(element, 'click', this.handleClick);
};


ian.mobile.BackButton.prototype.handleClick = function (e) {
  var element = this.getElement();
  goog.dom.classlist.add(element, 'active');

  this.dispatchEvent(e);
};
