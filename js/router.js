goog.provide('ian.Router');
goog.provide('ian.Router.State');
goog.provide('ian.Router.StateChangeEvent');

goog.require('ian.History');
goog.require('ian.Location');
goog.require('ian.MouseHandler');
goog.require('ian.TouchHandler');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.object');


/**
 * @constructor
 * @extends {goog.events.EventTarget}
 * @param {!History|ian.History=} history A history API.
 * @param {!Location|ian.Location=} location A location API.
 * @param {!ian.MouseHandler=} mouse_handler A mouse handler.
 * @param {!ian.TouchHandler=} touch_handler A touch handler.
 */
ian.Router = function (history, location, mouse_handler, touch_handler) {
  goog.events.EventTarget.call(this);

  this.$mouse_handler = mouse_handler;
  this.$touch_handler = touch_handler;

  this.$window = goog.global;

  if (!goog.isNull(history)) {
    history = history || new ian.History();
  }
  this.$history = history || goog.global.history;

  if (!goog.isNull(location)) {
    location = location || new ian.Location();
  }
  this.$location = location || goog.global.location;

  /**
   * The base path for resolving relative path.
   * @type {string}
   */
  this.base = '/';

  this.routes_ = {};
};

goog.inherits(ian.Router, goog.events.EventTarget);


/**
 * @param {!Object.<string, string>} routes A route map.
 */
ian.Router.prototype.setRoutes = function (routes) {
  this.routes_ = this.parseRoutes_(routes);
};


/**
 * @param {!Object.<string, string>=} routes A route map.
 */
ian.Router.prototype.init = function (routes) {
  var event_handler = new goog.events.EventHandler(this);

  if (routes) {
    this.setRoutes(routes);
  }

  this.event_handler = event_handler;
  this.base = this.getBasePath_();

  event_handler.listen(this.$window, 'popstate', this.handlePopState_);

  if (!this.$history) {
    event_handler.listen(this.$window, 'hashchange', this.handleHashChange_);
  }

  if (this.$mouse_handler) {
    event_handler.listen(this.$mouse_handler, 'click', this.handleClick_);
  }
  if (this.$touch_handler) {
    event_handler.listen(this.$touch_handler, 'click', this.handleClick_);
  }

  this.emitCurrentState_();
};


/**
 * @param {!Object.<string, string>} routes A route map.
 */
ian.Router.prototype.parseRoutes_ = function (routes) {
  var list = [];

  goog.object.forEach(routes, function (target, pattern) {
    var placeholders = pattern.match(/\{[a-z-]+\}/g) || [];
    var rx_source = pattern;
    var param_keys = [];

    for (var i = 0; i < placeholders.length; ++i) {
      var placeholder = placeholders[i];
      rx_source = rx_source.replace(placeholder, '([^/]+)');
      param_keys.push(placeholder.substr(1, placeholder.length - 2));
    }
    var rx = new RegExp('^' + rx_source + '$');

    list.push({
      target: target,
      param_keys: param_keys,
      pattern: pattern,
      rx: rx
    });
  });

  return list;
};


/**
 * @return {string} The base path specified by a <base> tag or the current
 *   location.
 */
ian.Router.prototype.getBasePath_ = function () {
  var base_el = goog.dom.getElementsByTagNameAndClass('base', null)[0];
  if (!base_el) {
    var pathname = this.$location.pathname;
    pathname = pathname.replace(/[^\/]+$/, '');
    return pathname;
  }

  var base = base_el.href;
  base = base.replace(/^[a-z-]+:\/\/\/?/, '/');

  if (this.$location.protocol !== 'file:') {
    base = base.replace(/^\/[^\/]+/, '');
    base = base.replace(/\/[^\/]+$/, '');
  }

  return base;
};


/**
 * @param {!PopStateEvent} e A popstate event.
 */
ian.Router.prototype.handlePopState_ = function (e) {
  var state = /** @type {ian.Router.State} */ (e.state);
  if (state) {
    this.setState(state);
  }
};


/**
 * @param {!HashChangeEvent} e A hashchange event.
 */
ian.Router.prototype.handleHashChange_ = function (e) {
  var hash = this.$location.hash;
  if (hash && hash.substr(0, 3) === '#!/') {
    var path = hash.substr(2);
    this.navigateToPath(path);
  }
};


ian.Router.prototype.handleClick_ = function (e) {
  var target = e.target;
  if (target) {
    var href;
    do {
      href = target.getAttribute('href');
      target = target.parentNode;
    } while (!href && target.nodeType === 1);

    var path;
    if (!href) {
      path = null;
    } else if (href.substr(0, 1) === '/') {
      path = href;
    } else if (href.substr(0, 2) === './') {
      path = this.resolveRelativePath_(href);
    }

    if (path) {
      var base = this.base;
      if (path.substr(0, base.length) === base) {
        path = '/' + path.substr(base.length);
      }

      this.navigateToPath(path);
      e.preventDefault();
    }
  }
};


/**
 * @param {string} relative The relative path to resolve.
 * @return {string} An absolute path.
 */
ian.Router.prototype.resolveRelativePath_ = function (relative) {
  var path = relative.replace(/^\.\//, this.base);
  return path;
};


/**
 * @param {string} path An absolute path (without base).
 */
ian.Router.prototype.navigateToPath = function (path) {
  var state = this.createStateForPath_(path);
  if (state) {
    this.pushState(state);
  } else {
    this.redirectToPath(this.base + path.substr(1));
  }
};


/**
 * @param {!goog.Uri|string} path An absolute path.
 */
ian.Router.prototype.redirectToPath = function (path) {
  this.$location.href = path;
};


/**
 * @param {string} target A target key.
 * @param {!Object.<string, (string|number|boolean)>=} params Target params.
 */
ian.Router.prototype.navigate = function (target, params) {
  var path = this.getPathByTargetAndParams(target, params);

  // TODO: Optimize so that the route is not resolved twice.
  var self = this;
  setTimeout(function () {
    self.navigateToPath(path);
  }, 0);
};


/**
 * @param {string} target A target key.
 * @param {!Object.<string, (string|number|boolean)>=} params Target params.
 * @return {string} An absolute path (without base).
 */
ian.Router.prototype.getPathByTargetAndParams = function (target, params) {
  params = params || {};

  var route = this.getRouteByTargetAndParams(target, params);
  if (!route) {
    throw new Error('No route');
  }

  var path = route.pattern;
  var keys = goog.object.getKeys(params);

  if (route.param_keys) {
    goog.array.forEach(route.param_keys, function (key) {
      path = path.replace('{' + key + '}', String(params[key]));
      keys.splice(keys.indexOf(key), 1);
    });
  }

  if (keys.length > 0) {
    var query_string_parts = goog.array.map(keys, function (key) {
      return key + '=' + goog.global.encodeURIComponent(String(params[key]));
    });
    path += '?' + query_string_parts.join('&');
  }

  return path;
};


ian.Router.prototype.emitCurrentState_ = function () {
  var path = this.$location.pathname;

  var base = this.base;
  if (path.substr(0, base.length) === base) {
    path = '/' + path.substr(base.length);
  }

  var state = this.createStateForPath_(path);
  if (state) {
    this.setState(state);
  }
};


ian.Router.prototype.getRouteByTargetAndParams = function (target, params) {
  var param_keys = goog.object.getKeys(params);

  var routes = this.routes_;
  var candidates = routes.filter(function (route) {
    if (route.target === target) {
      return goog.array.every(route.param_keys, function (key) {
        return (param_keys.indexOf(key) !== -1);
      });
    }

    return false;
  });


  if (candidates.length === 0) {
    return null;
  }

  if (candidates.length > 1) {
    candidates.sort(function (a, b) {
      return (b.param_keys.length - a.param_keys.length);
    });
  }

  return candidates[0];
};


/**
 * @param {string} path A location path.
 */
ian.Router.prototype.createStateForPath_ = function (path) {
  var parts = path.split('?');
  var pathname = parts[0];
  var query_string = parts.slice(1).join('?');

  var routes = this.routes_;
  for (var i = 0, ii = routes.length; i < ii; ++i) {
    var route = routes[i];
    var match = pathname.match(route.rx);

    if (match) {
      var params = {};
      var param_keys = route.param_keys;
      for (var p = 0; p < param_keys.length; ++p) {
        params[param_keys[p]] = match[p + 1];
      }

      return {
        path: path,
        target: route.target,
        params: params
      };
    }
  }

  return null;
};


/**
 * @param {!ian.Router.State} state A router state.
 */
ian.Router.prototype.pushState = function (state) {
  var path = this.base + state.path.substr(1);
  this.$history.pushState(state, '', path);

  this.setState(state);
};


/**
 * @param {!ian.Router.State} state A router state.
 */
ian.Router.prototype.setState = function (state) {
  this.previous_state = this.state;
  this.state = state;
  var e = new ian.Router.StateChangeEvent(state);

  this.dispatchEvent(e);
};


/**
 * @typedef {{
 *   path: string,
 *   target: string,
 *   params: !Object.<string, string>
 * }}
 */
ian.Router.State;


/**
 * @constructor
 * @extends {goog.events.Event}
 * @param {!ian.Router.State} state A router state.
 */
ian.Router.StateChangeEvent = function (state) {
  goog.events.Event.call(this, 'statechange');

  this.state = state;
};

goog.inherits(ian.Router.StateChangeEvent, goog.events.Event);
