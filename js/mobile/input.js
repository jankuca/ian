goog.provide('ian.mobile.Input');

goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.Input = function (template) {
  ian.mobile.View.call(this, template);
};

goog.inherits(ian.mobile.Input, ian.mobile.View);


ian.mobile.Input.prototype.getValue = function () {
  return null;
};
