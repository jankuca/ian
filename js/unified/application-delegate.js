goog.provide('ian.unified.ApplicationDelegate');
goog.provide('ian.unified.ControllerCallback');

goog.require('ian.ApplicationDelegate');
goog.require('ian.templates.error');
goog.require('ian.unified.View');


/**
 * @constructor
 * @extends {ian.ApplicationDelegate}
 */
ian.unified.ApplicationDelegate = function (router) {
  ian.ApplicationDelegate.call(this, router);
};


/**
 * @override
 */
ian.unified.ApplicationDelegate.prototype.navigateToController =
    function (new_controller, action, params) {
  var self = this;

  var callback = function (err, view, data) {
    if (err) {
      view = view || self.createErrorView(err);
    }

    view.apply(data);
    self.setRouteView(view);
  };

  new_controller.navigate(action, params, callback);
};


ian.unified.ApplicationDelegate.prototype.setRouteView = function (view) {
  this.route_view_ = view;
  // this.root_view_.
};


ian.unified.ApplicationDelegate.prototype.createErrorView = function (err) {
  var template = ian.templates.error.general;

  if (goog.isNumber(err)) {
    switch (err) {
    case 400: template = ian.templates.error.badRequest; break;
    case 403: template = ian.templates.error.forbidden; break;
    case 404: template = ian.templates.error.notFound; break;
    default: template = ian.templates.error.serverError;
    }
  }

  var view = new ian.unified.View(template);
  return view;
};


/**
 * @typedef {function((Error|number), ian.unified.View, Object.<string, *>=)}
 */
ian.unified.ControllerCallback;