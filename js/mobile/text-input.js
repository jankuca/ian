goog.provide('ian.mobile.TextInput');

goog.require('goog.dom');
goog.require('ian.mobile.Input');


/**
 * @constructor
 * @extends {ian.mobile.Input}
 */
ian.mobile.TextInput = function () {
  ian.mobile.Input.call(this);

  this.label = '';
  this.type = 'text';
};

goog.inherits(ian.mobile.TextInput, ian.mobile.Input);


ian.mobile.TextInput.prototype.setLabel = function (label) {
  this.label = label;

  var element = this.getElement();
  element.setAttribute('placeholder', label);
};


ian.mobile.TextInput.prototype.getValue = function () {
  var element = this.getElement();
  return element ? element.value : null;
};
