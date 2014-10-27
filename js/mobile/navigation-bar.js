goog.provide('ian.mobile.NavigationBar');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('ian.mobile.BackButton');
goog.require('ian.mobile.NavigationBarTitle');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.NavigationBar = function () {
  ian.mobile.View.call(this);

  this.current_navigation_item_ = null;
  this.navigation_items_ = [];
  this.titles_ = [];
  this.back_buttons_ = [];
};

goog.inherits(ian.mobile.NavigationBar, ian.mobile.View);


ian.mobile.NavigationBar.prototype.createDom = function () {
  var dom = this.getDomHelper();
  var element = dom.createDom('div', {
    'class': 'ui-navigation-bar'
  });

  this.setElementInternal(element);
};


/**
 * @param {!ian.mobile.NavigationItem} item A new navigation item.
 */
ian.mobile.NavigationBar.prototype.pushNavigationItem = function (item) {
  var current_item = this.current_navigation_item_;

  this.navigation_items_.push(item);
  this.current_navigation_item_ = item;

  if (item.title && (!current_item || item.title !== current_item.title)) {
    var title = new ian.mobile.NavigationBarTitle();
    title.setText(item.title);
    this.pushTitle_(title);
  }

  if (current_item) {
    var back_button_label = current_item.title;
    if (!item.title || back_button_label === item.title) {
      back_button_label = '';
    }

    var back_button = new ian.mobile.BackButton();
    if (back_button_label) {
      back_button.setLabel(back_button_label);
    }
    this.pushBackButton_(back_button);

    var handler = this.getHandler();
    handler.listen(back_button, 'click', this.dispatchBackEvent);
  }
};


/**
 * @return {ian.mobile.NavigationItem} The popped new navigation item.
 */
ian.mobile.NavigationBar.prototype.popNavigationItem = function () {
  var current_item = this.navigation_items_.pop();
  if (!current_item) {
    return null;
  }

  var prev_item = goog.array.peek(this.navigation_items_);
  this.current_navigation_item_ = prev_item;

  if (current_item.title && (!prev_item.title || current_item.title !== prev_item.title)) {
    var current_title = this.popTitle_();
    current_title.dispose();
  }

  var current_back_button = this.popBackButton_();
  current_back_button.dispose();

  return current_item;
};


ian.mobile.NavigationBar.prototype.dispatchBackEvent = function () {
  var e = new goog.events.Event('back');
  this.dispatchEvent(e);
};


/**
 * @param {!ian.mobile.NavigationBarTitle} title The new title view.
 */
ian.mobile.NavigationBar.prototype.pushTitle_ = function (title) {
  this.titles_.push(title);
  this.addChildAt(title, 0, true);
};


/**
 * @return {ian.mobile.NavigationBarTitle} The previous title view.
 */
ian.mobile.NavigationBar.prototype.popTitle_ = function () {
  var current_title = this.titles_.pop();
  this.removeChild(current_title, true);

  return current_title;
};


/**
 * @param {!ian.mobile.Button} back_button The new title view.
 */
ian.mobile.NavigationBar.prototype.pushBackButton_ = function (back_button) {
  this.back_buttons_.push(back_button);
  this.addChildAt(back_button, 0, true);
};


/**
 * @return {ian.mobile.NavigationBarTitle} The previous back_button view.
 */
ian.mobile.NavigationBar.prototype.popBackButton_ = function () {
  var current_back_button = this.back_buttons_.pop();
  this.removeChild(current_back_button, true);

  return current_back_button;
};
