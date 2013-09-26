goog.provide('ian.ui.Component');


/**
 * @constructor
 * @ngInject
 */
ian.ui.Component = function () {
  this.$element = null;

  /**
   * @type {!Object.<string, *>}
   */
  this.$scope = {};

  /**
   * @type {!Object.<string, boolean>}
   */
  this.$state = {};
  this.$children = {};

  this.event_handler_ = null;
  this.in_document_ = false;
};


ian.ui.Component.prototype.decorate = function (element) {
  this.$element = element;
  this.render();
};


/**
 * @param {!Object} scope The scope for the component to use. If there were any
 *   changes to the default empty scope, the data are copied to the new scope.
 */
ian.ui.Component.prototype.setScope = function (scope) {
  var old_scope = this.$scope;

  goog.object.extend(scope, old_scope);
  this.$scope = scope;
};


ian.ui.Component.prototype.addChild = function (key, child) {
  this.$children[key] = child;
};


ian.ui.Component.prototype.getHandler = function () {
  var handler = this.event_handler_;
  if (handler) {
    return handler;
  }
};


ian.ui.Component.prototype.enterDocument = function () {
  this.in_document_ = true;
};


ian.ui.Component.prototype.exitDocument = function () {
  this.in_document_ = false;
};


ian.ui.Component.prototype.init = goog.abstractMethod;


ian.ui.Component.prototype.render = goog.abstractMethod;
