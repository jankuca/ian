goog.provide('ian.unified.Controller');

goog.require('ian.Controller');
goog.require('ian.unified.ControllerCallback');


/**
 * @constructor
 * @extends {ian.Controller}
 */
ian.unified.Controller = function (router) {
  var cfg = {};
  ian.Controller.call(this, router, cfg);
};


/**
 * @override
 * @param {string} action An action key.
 * @param {!Object.<string, string>} params Action parameters.
 * @param {!ian.unified.ControllerCallback=} callback A callback function.
 */
ian.unified.Controller.prototype.navigate = function (action, params, callback) {
  var method = this[action];
  if (method) {
    method.call(this, params, callback);
  } else {
    callback(404, null);
  }
};