goog.provide('ian.ui.Component');


/**
 * @constructor
 * @ngInject
 */
ian.ui.Component = function () {
  this.$element = null;
  this.$state = {};
  this.$children = {};

  this.event_handler_ = null;
  this.in_document_ = false;
};


ian.ui.Component.prototype.decorate = function (element) {
  this.$element = element;
  this.render();
};


ian.ui.Component.prototype.setState = function (state) {
  this.$state = state;
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
