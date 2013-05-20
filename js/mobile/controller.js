goog.provide('ian.mobile.Controller');


/**
 * @constructor
 * @param {!ian.Router} router A router.
 */
ian.mobile.Controller = function (router) {
  this.$router = router;

  this.view = null;

  this.handler_ = null;

  this.init();
};


ian.mobile.Controller.prototype.init = function () {
  // override this
};


ian.mobile.Controller.prototype.navigate = function (action, params) {
  // override this
};


ian.mobile.Controller.prototype.getHandler = function () {
  var handler = this.handler_;
  if (!handler) {
    handler = new goog.events.EventHandler(this);
    this.handler_ = handler;
  }

  return handler;
};


ian.mobile.Controller.prototype.listen = function (target, type, fn) {
  var handler = this.getHandler();
  handler.listen(target, type, fn);
};


ian.mobile.Controller.prototype.listenOnce = function (target, type, fn) {
  var handler = this.getHandler();
  handler.listenOnce(target, type, fn);
};


ian.mobile.Controller.prototype.unlisten = function (target, type, fn) {
  var handler = this.getHandler();
  handler.unlisten(target, type, fn);
};


/**
 * @param {ian.mobile.View} view The view to associate with the controller.
 */
ian.mobile.Controller.prototype.setView = function (view) {
  this.view = view;
};


/**
 * @return {ian.mobile.View} The view associated with the controller.
 */
ian.mobile.Controller.prototype.getView = function () {
  return this.view || null;
};


/**
 * @param {string} target The redirection target.
 * @param {!Object.<string, string>=} params Target view params.
 */
ian.mobile.Controller.prototype.redirectTo = function (target, params) {
  var self = this;
  setTimeout(function () {
    self.$router.navigate(target, params);
  }, 0);
};
