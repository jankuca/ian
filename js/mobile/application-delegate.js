goog.provide('ian.mobile.ApplicationDelegate');

goog.require('goog.events.EventHandler');


/**
 * @constructor
 * @param {!ian.Router} router A router.
 */
ian.mobile.ApplicationDelegate = function (router) {
  this.$router = router;
  this.$handler = new goog.events.EventHandler(this);
  this.$session = {};

  this.root_view_ = null;
  this.current_controller_ = null;
  this.constructors_ = {};
  this.controllers_ = {};

  this.init();
};


/**
 * @param {ian.mobile.View} root_view The new root component.
 */
ian.mobile.ApplicationDelegate.prototype.setRootView = function (root_view) {
  this.root_view_ = root_view || null;
};


/**
 * @return {ian.mobile.View} The current root component.
 */
ian.mobile.ApplicationDelegate.prototype.getRootView = function () {
  return this.root_view_;
};


/**
 * @param {Object.<string, Function>} constructors A constructor map.
 */
ian.mobile.ApplicationDelegate.prototype.setConstructors = function (constructors) {
  this.constructors_ = constructors || {};
};


ian.mobile.ApplicationDelegate.prototype.init = function () {
  this.$handler.listen(this.$router, 'statechange', this.handleRoute_);
};


ian.mobile.ApplicationDelegate.prototype.handleRoute_ = function (e) {
  var current_controller = this.getCurrentController();

  var state = e.state;
  var target = state.target.split(':');
  var controller_key = target[0];
  var action_key = target.slice(1).join(':') || null;

  var controller = this.getControllerByKey(controller_key);
  if (!controller) {
    alert('404 Page Not Found');
    return;
  }

  if (current_controller && current_controller !== controller) {
    var current_view = current_controller.getView();
    if (current_view) {
      this.root_view_.removeSubview(current_view);
    }
  }

  this.current_controller = controller;
  controller.navigate(action_key, state.params);

  if (current_controller !== controller) {
    var view = controller.getView();
    if (view) {
      this.root_view_.addSubview(view);
    }
  }
};


ian.mobile.ApplicationDelegate.prototype.getCurrentController = function () {
  return this.current_controller_;
};


ian.mobile.ApplicationDelegate.prototype.getControllerByKey = function (key) {
  var controller = this.controllers_[key];
  if (!controller) {
    var Controller = this.constructors_[key];
    if (Controller) {
      controller = new Controller(this.$router);
      controller.$session = this.$session;
    }
  }

  if (controller) {
    this.controllers_[key] = controller;
  }

  return controller || null;
};
