goog.provide('ian.mobile.NavigationController');

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
    if (element) {
      element.removeChild(this.navigation_bar.getElement());
    }
    handler.unlisten(this.navigation_bar, 'back', this.handleBackButtonClick_);
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
 * @param {boolean=} immediate Whether to immediately show the view.
 */
ian.mobile.NavigationController.prototype.pushView = function (view, immediate) {
  var current_view = goog.array.peek(this.views);

  this.views.push(view);

  if (this.navigation_bar) {
    var navigation_item = view.navigation_item;
    if (current_view) {
      navigation_item = navigation_item || current_view.navigation_item;
    }
    navigation_item = navigation_item || new ian.mobile.NavigationItem();
    this.navigation_bar.pushNavigationItem(navigation_item, immediate);
  }

  if (current_view && !immediate) {
    view.slideRight();
  }

  this.addChild(view, true);

  setTimeout(function () {
    if (current_view && !immediate) {
      current_view.slideLeft();
    }
    view.slideIn();
  }, 0);
};


/**
 * @param {boolean=} immediate Whether to immediately remove the view from DOM.
 */
ian.mobile.NavigationController.prototype.popView = function (immediate) {
  var current_view = this.views.pop();
  if (!current_view) {
    return;
  }

  if (this.navigation_bar) {
    this.navigation_bar.popNavigationItem(immediate);
  }

  var prev_view = goog.array.peek(this.views);
  if (prev_view) {
    if (!immediate) {
      current_view.slideRight();
    }
    prev_view.slideIn();
  }

  current_view.dispose();
};


ian.mobile.NavigationController.prototype.handleBackButtonClick_ = function () {
  this.popView();
};
