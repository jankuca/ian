goog.provide('ian.mobile.Controller');

goog.require('ian.Controller');


/**
 * @constructor
 * @extends {ian.Controller}
 * @param {!ian.Router} router A router.
 * @param {!Object.<string, *>} cfg App configuration.
 */
ian.mobile.Controller = function (router, cfg) {
  ian.Controller.call(this, router, cfg);

  this.view = null;
};

goog.inherits(ian.mobile.Controller, ian.Controller);


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
