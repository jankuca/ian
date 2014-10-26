goog.provide('ian.mobile.NavigationBarTitle');

goog.require('goog.dom');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.NavigationBarTitle = function () {
  ian.mobile.View.call(this);

  this.text = '';
};

goog.inherits(ian.mobile.NavigationBarTitle, ian.mobile.View);


ian.mobile.NavigationBarTitle.prototype.createDom = function () {
  var dom = this.getDomHelper();
  var element = dom.createDom('span', {
    'class': 'ui-navigation-bar-title'
  });

  this.setElementInternal(element);
};


ian.mobile.NavigationBarTitle.prototype.setText = function (text) {
  this.text = text;

  var element = this.getElement();
  goog.dom.setTextContent(element, text);
};
