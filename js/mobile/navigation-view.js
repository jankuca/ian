goog.provide('ian.mobile.NavigationView');

goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.NavigationView = function () {
  ian.mobile.View.call(this);

  this.navigation_item = null;
};

goog.inherits(ian.mobile.NavigationView, ian.mobile.View);
