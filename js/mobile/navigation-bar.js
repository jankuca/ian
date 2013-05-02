goog.provide('ian.mobile.NavigationBar');

goog.require('goog.array');
goog.require('goog.events.Event');
goog.require('ian.mobile.Button');
goog.require('ian.mobile.NavigationBarTitle');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.NavigationBar = function (template) {
  ian.mobile.View.call(this, template);

  this.current_navigation_item_ = null;
  this.navigation_items_ = [];
  this.titles_ = [];
  this.back_buttons_ = [];
};

goog.inherits(ian.mobile.NavigationBar, ian.mobile.View);


/**
 * @param {!ian.mobile.NavigationItem} item A new navigation item.
 * @param {boolean=} immediate Whether to skip the animation.
 */
ian.mobile.NavigationBar.prototype.pushNavigationItem = function (item, immediate) {
  var current_item = this.current_navigation_item_;

  this.navigation_items_.push(item);
  this.current_navigation_item_ = item;

  if (item.title && (!current_item || item.title !== current_item.title)) {
    var title = new ian.mobile.NavigationBarTitle(ian.mobile.templates.NavigationBarTitle);
    title.setText(item.title);
    this.pushTitle_(title, immediate);
  }

  if (current_item) {
    var back_button_label = current_item.title;
    if (!item.title || back_button_label === item.title) {
      back_button_label = '';
    }

    var back_button = new ian.mobile.Button(ian.mobile.templates.BackButton);
    if (back_button_label) {
      back_button.setLabel(back_button_label);
    }
    this.pushBackButton_(back_button, immediate);

    var handler = this.getHandler();
    handler.listen(back_button, 'click', this.dispatchBackEvent);
  }
};


/**
 * @param {boolean=} immediate Whether to skip the animation.
 * @return {ian.mobile.NavigationItem} The popped new navigation item.
 */
ian.mobile.NavigationBar.prototype.popNavigationItem = function (immediate) {
  var current_item = this.navigation_items_.pop();
  var prev_item = goog.array.peek(this.navigation_items_);
  this.current_navigation_item_ = prev_item;

  if (current_item.title && (!prev_item.title || current_item.title !== prev_item.title)) {
    var current_title = this.popTitle_(immediate);
    current_title.dispose();
  }

  var current_back_button = this.popBackButton_(immediate);
  current_back_button.dispose();

  return current_item;
};


ian.mobile.NavigationBar.prototype.dispatchBackEvent = function () {
  var e = new goog.events.Event('back');
  this.dispatchEvent(e);
};


/**
 * @param {!ian.mobile.NavigationBarTitle} title The new title view.
 * @param {boolean=} immediate Whether to skip the animation.
 */
ian.mobile.NavigationBar.prototype.pushTitle_ = function (title, immediate) {
  var current_title = goog.array.peek(this.titles_);
  this.titles_.push(title);

  if (current_title && !immediate) {
    current_title.slideLeft();
    current_title.fadeOut();
    title.slideRight();
    title.fadeOut();
  }

  this.element.appendChild(title.element);

  setTimeout(function () {
    title.slideIn();
    title.fadeIn();
  }, 0);
};


/**
 * @param {boolean=} immediate Whether to skip the animation.
 * @return {ian.mobile.NavigationBarTitle} The previous title view.
 */
ian.mobile.NavigationBar.prototype.popTitle_ = function (immediate) {
  var current_title = this.titles_.pop();
  var prev_title = goog.array.peek(this.titles_);

  if (current_title && !immediate) {
    current_title.slideRight();
    current_title.fadeOut();
  }
  if (prev_title) {
    prev_title.slideIn();
    prev_title.fadeIn();
  }

  return current_title;
};


/**
 * @param {!ian.mobile.Button} back_button The new title view.
 * @param {boolean=} immediate Whether to skip the animation.
 */
ian.mobile.NavigationBar.prototype.pushBackButton_ = function (back_button, immediate) {
  var current_back_button = goog.array.peek(this.back_buttons_);
  this.back_buttons_.push(back_button);

  if (current_back_button && !immediate) {
    current_back_button.slideLeft();
    current_back_button.fadeOut();
  }

  if (!immediate) {
    back_button.slideRight();
    back_button.fadeOut();
  }
  this.element.insertBefore(back_button.element, this.element.firstChild);
  back_button.setParentView(this);

  setTimeout(function () {
    back_button.slideIn();
    back_button.fadeIn();
  }, 0);
};


/**
 * @param {boolean=} immediate Whether to skip the animation.
 * @return {ian.mobile.NavigationBarTitle} The previous back_button view.
 */
ian.mobile.NavigationBar.prototype.popBackButton_ = function (immediate) {
  var current_back_button = this.back_buttons_.pop();
  var prev_back_button = goog.array.peek(this.back_buttons_);

  if (current_back_button && !immediate) {
    current_back_button.slideRight();
    current_back_button.fadeOut();
  }
  if (prev_back_button) {
    prev_back_button.slideIn();
    prev_back_button.fadeIn();
  }

  return current_back_button;
};
