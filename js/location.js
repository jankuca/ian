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

  this.host = location.host;
  this.hostname = location.hostname;
  this.href_ = location.href;
  this.origin = location.origin;
  this.port = location.port;
  this.protocol = location.protocol;
  this.pathname = location.pathname;
  this.hash = location.hash;

  var hash = location.hash;
  if (hash.substr(0, 3) === '#!/') {
    var hash_parts = hash.substr(3).split('#');
    this.pathname = hash_parts[0];
    this.hash = hash_parts.slice(1).join('#');
  }
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
