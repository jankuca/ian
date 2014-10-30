goog.provide('ian.Location');

goog.require('goog.events.EventHandler');


/**
 * @constructor
 * @param {Window=} win The window object to observe.
 */
ian.Location = function (win) {
  this.$window = win || goog.global;
  this.$location = this.$window.location;

  this.snapshot_();

  this.handler_ = new goog.events.EventHandler(this);
  this.handler_.listen(this.$window, 'hashchange', this.snapshot_);
  this.handler_.listen(this.$window, 'popstate', this.snapshot_);
};


ian.Location.prototype.snapshot_ = function () {
  var location = this.$location;

  this.hash = location.hash;
  this.host = location.host;
  this.hostname = location.hostname;
  this.href_ = location.href;
  this.origin = location.origin;
  this.port = location.port;
  this.protocol = location.protocol;

  var hash_path = location.hash.replace(/^#!?/, '').substr(1).split('#')[0];
  this.pathname = location.pathname + hash_path;
};


ian.Location.prototype.getHref = function () {
  return this.href_;
};


ian.Location.prototype.setHref = function (href) {
  this.href_ = href;
  this.$location.href = href;
  return this.$location.href;
};


Object.defineProperties(ian.Location.prototype, {
  href: {
    get: ian.Location.prototype.getHref,
    set: ian.Location.prototype.setHref
  }
});
