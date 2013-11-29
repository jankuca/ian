goog.provide('ian.ApplicationDelegate');

goog.require('ian.ServiceContainer');


/**
 * @constructor
 * @param {!ian.Router} router A router.
 * @param {!ian.ServiceContainer=} services A service container to use
 *   for controller construction.
 * @param {Object.<string, *>=} cfg App configuration.
 */
ian.ApplicationDelegate = function (router, services, cfg) {
  this.$router = router;
  this.$services = services;
  this.cfg_ = cfg || {};

  this.$handler = new goog.events.EventHandler(this);
  this.$session = {};

  this.current_controller_ = null;
  this.constructors_ = {};
  this.instances_ = {};

  this.init();
};


/**
 * @param {Object.<string, Function>} constructors A constructor map.
 */
ian.ApplicationDelegate.prototype.setControllers = function (constructors) {
  this.constructors_ = constructors || {};
};


/**
 * @param {Object.<string, Function>} constructors A constructor map.
 * @deprecated
 */
ian.ApplicationDelegate.prototype.setConstructors = function (constructors) {
  this.setControllers(constructors);
};


ian.ApplicationDelegate.prototype.init = function () {
  this.$handler.listen(this.$router, 'statechange', this.handleRoute_);
};


ian.ApplicationDelegate.prototype.handleRoute_ = function (e) {
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

  this.beforeControllerChange(current_controller, controller);

  this.current_controller = controller;
  this.navigateToController(controller, action_key, state.params);

  this.afterControllerChange(current_controller, controller);
};


ian.ApplicationDelegate.prototype.beforeControllerChange =
    function (old_controller, new_controller) {
  // override this
};


ian.ApplicationDelegate.prototype.navigateToController =
    function (new_controller, action_key, params) {
  new_controller.navigate(action_key, params);
};


ian.ApplicationDelegate.prototype.afterControllerChange =
    function (old_controller, new_controller) {
  // override this
};


ian.ApplicationDelegate.prototype.getCurrentController = function () {
  return this.current_controller_;
};


ian.ApplicationDelegate.prototype.getControllerByKey = function (key) {
  var controller = this.instances_[key];
  if (!controller) {
    var Controller = this.constructors_[key];
    if (!Controller) {
      throw new Error('No such controller "' + key + '"');
    }

    controller = this.createController(Controller);
    controller.$session = this.$session;
    controller.init();
  }

  if (controller) {
    this.instances_[key] = controller;
  }

  return controller || null;
};


/**
 * @return {!ian.Controller}
 */
ian.ApplicationDelegate.prototype.createController = function (Controller) {
  var router = this.$router;
  var cfg = this.cfg_;

  var controller;
  if (this.$services) {
    controller = this.$services.create(Controller, router, cfg);
  } else {
    controller = new Controller(router, cfg);
  }

  return controller;
};
