goog.provide('ian.mobile.NavigationController');

goog.require('goog.events.Event');
goog.require('ian.mobile.NavigationBar');
goog.require('ian.mobile.NavigationItem');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.NavigationController = function () {
  ian.mobile.View.call(this);

  this.navigation_bar = null;
  this.toolbar = null;
  this.views = [];

  this.view_stack_element_ = null;
};

goog.inherits(ian.mobile.NavigationController, ian.mobile.View);


ian.mobile.NavigationController.prototype.createDom = function () {
  var dom = this.getDomHelper();
  var element = dom.createDom('div', {
    'class': 'ui-navigation-controller'
  });

  this.setElementInternal(element);
};


ian.mobile.NavigationController.prototype.appendNavigationBar_ = function () {
  if (!this.navigation_bar) {
    return;
  }

  var bar_element = this.navigation_bar.getElement();
  if (bar_element) {
    var element = this.getElement();
    element.insertBefore(bar_element, element.firstChild);
  }
};


/**
 * @param {!ian.mobile.NavigationBar} bar The new navigation bar view.
 */
ian.mobile.NavigationController.prototype.setNavigationBar = function (bar) {
  var handler = this.getHandler();
  var element = this.getElement();

  if (this.navigation_bar) {
    handler.unlisten(this.navigation_bar, 'back', this.handleBackButtonClick_);
    this.removeChild(this.navigation_bar, true);
  }

  this.navigation_bar = bar;
  this.addChild(bar, true);

  if (bar) {
    handler.listen(this.navigation_bar, 'back', this.handleBackButtonClick_);
  }
};


/**
 * @param {!ian.mobile.View} toolbar The new toolbar view.
 */
ian.mobile.NavigationController.prototype.setToolbar = function (toolbar) {
  var element = this.getElement();

  if (this.toolbar) {
    element.removeChild(this.toolbar.getElement());
  }

  this.toolbar = toolbar;

  if (toolbar) {
    element.appendChild(toolbar.getElement());
  }
};


/**
 * @param {!ian.mobile.NavigationView} view The view to add.
 */
ian.mobile.NavigationController.prototype.pushView = function (view) {
  var current_view = goog.array.peek(this.views);

  this.views.push(view);
  this.addChild(view, true);

  if (this.navigation_bar) {
    var navigation_item = view.navigation_item;
    if (current_view) {
      navigation_item = navigation_item || current_view.navigation_item;
    }
    navigation_item = navigation_item || new ian.mobile.NavigationItem();
    this.navigation_bar.pushNavigationItem(navigation_item);
  }

  var e = new goog.events.Event('push');
  this.dispatchEvent(e);
};


ian.mobile.NavigationController.prototype.popView = function () {
  var current_view = this.views.pop();
  if (!current_view) {
    return;
  }

  if (this.navigation_bar) {
    this.navigation_bar.popNavigationItem();
  }
  this.removeChild(current_view, true);

  var e = new goog.events.Event('pop');
  this.dispatchEvent(e);
};


ian.mobile.NavigationController.prototype.handleBackButtonClick_ = function () {
  this.popView();
};
