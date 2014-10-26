goog.provide('ian.mobile.Input');

goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.Input = function () {
  ian.mobile.View.call(this);
};

goog.inherits(ian.mobile.Input, ian.mobile.View);


ian.mobile.Input.prototype.createDom = function () {
  var dom = this.getDomHelper();
  var element = dom.createDom('input', {
    'type': this.type
  });

  this.setElementInternal(element);
};


ian.mobile.Input.prototype.getValue = function () {
  var element = this.getElement();
  return (typeof element.value !== 'undefined') ? element.value : null;
};
