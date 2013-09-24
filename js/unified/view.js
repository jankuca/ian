goog.provide('ian.unified.View');

goog.require('ian.View');


/** 
 * @constructor
 * @extends {ian.View}
 * @param {(string|function(!Object=):string)=} template A view template to use.
 */
ian.unified.View = function (template) {
  ian.View.call(this, template);

  this.element = null;
};


/**
 * @param {!Object.<string, *>=} data
 * @return {!Element}
 */
ian.unified.View.prototype.apply = function (data) {
  this.element = this.template_.call(null, data);
  return this.element;
};