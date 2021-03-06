goog.provide('ian.ui.Component');

goog.require('goog.events.EventTarget');
goog.require('goog.string');
goog.require('ian.ui.ComponentState');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 * @ngInject
 */
ian.ui.Component = function () {
  goog.events.EventTarget.call(this);

  /**
   * @type {boolean}
   */
  this.$$initialized = false;

  /**
   * Whether the component needs to be rerendered.
   * @type {boolean}
   */
  this.$$invalidated = false;

  /**
   * @type {Element}
   */
  this.$element = null;

  /**
   * @type {!Object.<string, *>}
   */
  this.$scope = {};

  /**
   * @type {!ian.ui.ComponentState}
   */
  this.$state = new ian.ui.ComponentState();

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

goog.inherits(ian.ui.Component, goog.events.EventTarget);


ian.ui.Component.prototype.isInitialized = function () {
  return this.$$initialized;
};


ian.ui.Component.prototype.setInitialized = function () {
  this.$$initialized = true;
};


/**
 * @param {!Element} element The element the component should be decorating.
 */
ian.ui.Component.prototype.decorate = function (element) {
  this.$element = element;
  this.apply();
  this.enterDocument();
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
 * @param {string|!ian.ui.ComponentState} key A state key.
 * @param {boolean=} state The new state value.
 */
ian.ui.Component.prototype.setState = function (key, state) {
  if (typeof key === 'string') {
    this.$state[key] = Boolean(state);
  } else {
    this.$state = key;
  }

  this.fireStateChangeEvent_();
};


/**
 * @param {string} key A state key.
 */
ian.ui.Component.prototype.toggleState = function (key) {
  this.$state[key] = !this.$state[key];
// console.log(key, this.$state[key]);

  this.fireStateChangeEvent_();
};


ian.ui.Component.prototype.fireStateChangeEvent_ = function () {
  var e = new goog.events.Event('statechange');
  this.dispatchEvent(e);
};


/**
 * @return {!ian.ui.ComponentState}
 */
ian.ui.Component.prototype.getState = function () {
  return this.$state;
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


/**
 * @return {boolean} Whether the component is in the document.
 */
ian.ui.Component.prototype.isInDocument = function () {
  return this.in_document_;
};


/**
 * Sets up the inital scope state.
 */
ian.ui.Component.prototype.init = goog.nullFunction;


/**
 * Returns the component's element.
 * @return {Element}
 */
ian.ui.Component.prototype.getElement = function () {
  return this.$element;
};


/**
 * Changes the component's element.
 */
ian.ui.Component.prototype.setElement = function (element) {
  this.$element = element;
};


/**
 * Creates the DOM subtree for the component usually from a template.
 * @return {!Element}
 */
ian.ui.Component.prototype.render = function () {
  var template = this.getTemplate();
  if (!template) {
    throw new Error('Missing component template');
  }

  var html = template(this.$scope, {});
  html = goog.string.trim(html);

  var dom = goog.dom.htmlToDocumentFragment(html);
  if (dom.nodeType !== 1) {
    throw new Error('Invalid component rendering, multiple root nodes:' +
        dom);
  }

  this.$element = /** @type {!Element} */ (dom);
  this.$$invalidated = false;

  return this.$element;
};


ian.ui.Component.prototype.getTemplate = function () {
  return this.template;
};


ian.ui.Component.prototype.invalidate = function () {
  this.$$invalidated = true;

  var e = new goog.events.Event('invalidate');
  this.dispatchEvent(e);
};


ian.ui.Component.prototype.isInvalidated = function () {
  return this.$$invalidated;
};


/**
 * Updates the DOM with the current data.
 */
ian.ui.Component.prototype.apply = function () {
  if (!this.isInDocument() && this.$element.childNodes.length === 0) {
    this.invalidate();
  }
};
