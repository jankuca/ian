goog.provide('ian.Controller');


/**
 * @constructor
 * @param {!ian.Router} router A router.
 * @param {!Object.<string, *>} cfg App configuration.
 */
ian.Controller = function (router, cfg) {
  this.$router = router;

  this.handler_ = null;
};


ian.Controller.prototype.init = function () {
  // override this
};


ian.Controller.prototype.navigate = function (action, params) {
  // override this
};


ian.Controller.prototype.getHandler = function () {
  var handler = this.handler_;
  if (!handler) {
    handler = new goog.events.EventHandler(this);
    this.handler_ = handler;
  }

  return handler;
};


ian.Controller.prototype.listen = function (target, type, fn) {
  var handler = this.getHandler();
  handler.listen(target, type, fn);
};


ian.Controller.prototype.listenOnce = function (target, type, fn) {
  var handler = this.getHandler();
  handler.listenOnce(target, type, fn);
};


ian.Controller.prototype.unlisten = function (target, type, fn) {
  var handler = this.getHandler();
  handler.unlisten(target, type, fn);
};


/**
 * @param {string} target The redirection target.
 * @param {!Object.<string, string>=} params Target view params.
 */
ian.Controller.prototype.redirectTo = function (target, params) {
  var self = this;
  setTimeout(function () {
    self.$router.navigate(target, params);
  }, 0);
};
