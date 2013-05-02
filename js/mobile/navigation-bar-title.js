goog.provide('ian.mobile.NavigationBarTitle');

goog.require('goog.dom');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.NavigationBarTitle = function (template) {
  ian.mobile.View.call(this, template);

  this.text = '';
};

goog.inherits(ian.mobile.NavigationBarTitle, ian.mobile.View);


ian.mobile.NavigationBarTitle.prototype.setText = function (text) {
  this.text = text;
  goog.dom.setTextContent(this.element, text);
};
