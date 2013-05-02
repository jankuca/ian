goog.provide('ian.mobile.TextInput');

goog.require('goog.dom');
goog.require('ian.mobile.Input');


/**
 * @constructor
 * @extends {ian.mobile.Input}
 */
ian.mobile.TextInput = function (template) {
  ian.mobile.Input.call(this, template);

  this.label = '';
};

goog.inherits(ian.mobile.TextInput, ian.mobile.Input);


ian.mobile.TextInput.prototype.setLabel = function (label) {
  this.label = label;
  this.element.setAttribute('placeholder', label);
};


ian.mobile.TextInput.prototype.getValue = function () {
  return this.element.value;
};
