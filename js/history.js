goog.provide('ian.History');
goog.provide('ian.History.PopStateEvent');

goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');


/**
 * @constructor
 * @param {Window=} win The window object to control.
 */
ian.History = function (win) {
  this.$window = win || goog.global;
  this.$history = this.$window.history;
  this.$location = this.$window.location;

  this.shimmed = !goog.isFunction(this.$history.pushState);

  if (this.shimmed) {
    this.handler = new goog.events.EventHandler(this);
    this.handler.listen(this.$window, 'hashchange', this.handleHashChange_);
  }

  this.stack_ = [];

  this.state = null;
};


/**
 * @param {Object} state A state object.
 * @param {string} title A title.
 * @param {string} path The new path.
 */
ian.History.prototype.pushState = function (state, title, path) {
  if (!this.shimmed) {
    return this.$history.pushState(state, title, path);
  }

  var base = this.$location.pathname.replace(/\/$/, '') + '/';
  if (path.substr(0, base.length) === base) {
    path = path.substr(base.length - 1);
  }

  var len = this.stack_.push({ state: state, title: title, path: path });
  this.state = state;
  this.$location.hash = '#!' + path + ':' + (len - 1);
};


ian.History.prototype.handleHashChange_ = function (e) {
  var hash = this.$location.hash;
  if (hash.substr(0, 2) !== '#!') {
    return;
  }

  var parts = hash.substr(2).split(':');
  var state_index = Number(parts[parts.length - 1]);
  if (state_index === this.stack_.length - 1) {
    return;
  }

  var state = this.stack_[state_index].state;
  this.stack_.splice(state_index + 1, this.stack_.length - state_index - 1);
  this.state = state;
  this.emitState_(state);
};


/**
 * @param {ian.Router.State} state The state object to emit.
 */
ian.History.prototype.emitState_ = function (state) {
  var e = new ian.History.PopStateEvent(state);
  goog.events.dispatchEvent(this.$window, e);
};



/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {ian.Router.State} state A state object.
 */
ian.History.PopStateEvent = function (state) {
  goog.events.Event.call(this, 'popstate');

  this.state = state;
};

goog.inherits(ian.History.PopStateEvent, goog.events.Event);
