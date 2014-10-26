goog.provide('ian.ApplicationDelegate');


/**
 * @constructor
 * @param {!ian.Router} router A router.
 * @param {!ian.IocContainer=} ioc A service container to use
 *   for controller construction.
 */
ian.ApplicationDelegate = function (router, ioc) {
  this.$router = router;
  this.$ioc = ioc;

  this.$handler = new goog.events.EventHandler(this);
  this.$session = {};

  this.current_controller_ = null;
  this.constructors_ = {};
  this.instances_ = {};
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
  this.$router.init();
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

  this.current_controller_ = controller;
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
  var controller;
  if (this.$ioc) {
    controller = this.$ioc.create(Controller);
  } else {
    controller = new Controller(this.$router);
  }

  return controller;
};
