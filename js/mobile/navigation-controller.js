goog.provide('ian.mobile.NavigationController');

goog.require('ian.mobile.NavigationBar');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.NavigationController = function (template) {
  ian.mobile.View.call(this, template);

  this.navigation_bar = null;
  this.toolbar = null;
  this.views = [];

  this.view_stack_element_ = null;

  this.init();
};

goog.inherits(ian.mobile.NavigationController, ian.mobile.View);


ian.mobile.NavigationController.prototype.init = function () {
  var dom = this.getDomHelper();
  var element = this.element;

  var navigation_bar = new ian.mobile.NavigationBar(ian.mobile.templates.NavigationBar);
  this.setNavigationBar(navigation_bar);
};


/**
 * @param {!ian.mobile.NavigationBar} bar The new navigation bar view.
 */
ian.mobile.NavigationController.prototype.setNavigationBar = function (bar) {
  var handler = this.getHandler();

  if (this.navigation_bar) {
    this.element.removeChild(this.navigation_bar.element);
    handler.unlisten(this.navigation_bar, 'back', this.popView);
  }

  this.navigation_bar = bar;

  if (bar) {
    this.element.insertBefore(bar.element, this.element.firstChild);
    handler.listen(this.navigation_bar, 'back', this.popView);
  }
};


/**
 * @param {!ian.mobile.View} toolbar The new toolbar view.
 */
ian.mobile.NavigationController.prototype.setToolbar = function (toolbar) {
  if (this.toolbar) {
    this.element.removeChild(this.toolbar.element);
  }

  this.toolbar = toolbar;

  if (toolbar) {
    this.element.appendChild(toolbar.element);
  }
};


ian.mobile.NavigationController.prototype.pushView = function (view, immediate) {
  var current_view = goog.array.peek(this.views);

  this.views.push(view);

  var navigation_item = view.navigation_item;
  if (current_view) {
    navigation_item = navigation_item || current_view.navigation_item;
  }
  navigation_item = navigation_item || new ian.mobile.NavigationItem();
  this.navigation_bar.pushNavigationItem(navigation_item, immediate);

  if (current_view && !immediate) {
    view.slideRight();
  }

  this.addSubview(view);

  setTimeout(function () {
    if (current_view && !immediate) {
      current_view.slideLeft();
    }
    view.slideIn();
  }, 0);
};


ian.mobile.NavigationController.prototype.popView = function (immediate) {
  var current_view = this.views.pop();
  var prev_view = goog.array.peek(this.views);

  this.navigation_bar.popNavigationItem(immediate);

  if (prev_view) {
    if (!immediate) {
      current_view.slideRight();
    }
    prev_view.slideIn();
  }

  current_view.dispose();
};

