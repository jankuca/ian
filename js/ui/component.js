goog.provide('ian.ui.Component');


/**
 * @constructor
 * @ngInject
 */
ian.ui.Component = function () {
  /**
   * @type {Element}
   */
  this.$element = null;

  /**
   * @type {!Object.<string, *>}
   */
  this.$scope = {};

  /**
   * @type {!Object.<string, boolean>}
   */
  this.$state = {};

  /**
   * @type {!Object.<string, !Element>}
   */
  this.$children = {};

  /**
   * @type {goog.events.EventHandler}
   */
  this.event_handler_ = null;

  /**
   * @type {boolean}
   */
  this.in_document_ = false;
};


/**
 * @param {!Element} element The element the component should be decorating.
 */
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


/**
 * @param {string} key A state key.
 * @param {boolean} state The new state value.
 */
ian.ui.Component.prototype.setState = function (key, state) {
  this.$state[key] = Boolean(state);
};


/**
 * @param {string} key The child key.
 * @param {!Element} child The new child.
 */
ian.ui.Component.prototype.addChild = function (key, child) {
  this.$children[key] = child;
};


/**
 * @return {!goog.events.EventHandler}
 */
ian.ui.Component.prototype.getHandler = function () {
  var handler = this.event_handler_;
  if (handler) {
    return handler;
  }

  this.event_handler_ = new goog.events.EventHandler(this);
  return this.event_handler_;
};


ian.ui.Component.prototype.enterDocument = function () {
  this.in_document_ = true;
};


ian.ui.Component.prototype.exitDocument = function () {
  this.in_document_ = false;
};


ian.ui.Component.prototype.init = goog.abstractMethod;


ian.ui.Component.prototype.render = goog.abstractMethod;