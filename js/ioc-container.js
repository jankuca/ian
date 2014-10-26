goog.provide('ian.IocContainer');

goog.require('goog.array');


/**
 * @constructor
 * @param {Object.<string, *>=} options Options.
 */
ian.IocContainer = function (options) {
  options = options || {};

  this.factories_ = options.factories || {};
  this.instances_ = options.instances || {};
  this.factory_middleware_ = [];
};


/**
 * @param {string} key A service key.
 * @param {boolean=} optional Whether to return false if the service is not
 *   available insted of throwing an error. Default: false.
 * @return {Object} A service instance. Null if optional and N/A.
 */
ian.IocContainer.prototype.getService = function (key, optional) {
  var instance = this.instances_[key];
  if (!instance) {
    var Service = this.factories_[key];
    if (!Service) {
      instance = this.getServiceFromMiddleware_(key);
      if (!instance) {
        if (!optional) {
          throw new Error('Unknown service "' + key + '" requested');
        }
        return null;
      }
    } else {
      instance = this.create(Service);
    }

    this.instances_[key] = instance;
  }

  return instance;
};


/**
 * Requests a service instance from middleware one-by-one until one of them
 *   returns one. If no middleware returns an instance, null is returned.
 * @param {string} key A service key.
 * @return {Object} A service instance.
 */
ian.IocContainer.prototype.getServiceFromMiddleware_ = function (key) {
  for (var m = 0, mm = this.factory_middleware_.length; m < mm; ++m) {
    var instance = this.factory_middleware_[m].call(null, key);
    if (instance) {
      return instance;
    }
  }

  return null;
};


/**
 * @param {string} key A service key.
 * @param {!Function|Object|function():!Object} factory_or_instance A service.
 */
ian.IocContainer.prototype.addService = function (key, factory_or_instance) {
  if (typeof factory_or_instance === 'function') {
    this.factories_[key] = factory_or_instance;
  } else {
    this.instances_[key] = factory_or_instance;
  }
};


/**
 * @param {string} key A service key.
 * @param {!Function|Object|function():!Object} factory_or_instance A service.
 */
ian.IocContainer.prototype.addNewService = function (key, factory_or_instance) {
  if (this.factories_[key] || this.instances_[key]) {
    return;
  }

  this.addService(key, factory_or_instance);
};


/**
 * Registers a factory middleware function which is invoked in case the
 *   container does not now how to constructor a service. The function can
 *   either return an instance or null to give the container a chance to
 *   request a service instance from the next middleware in line.
 * @param {function(string):Object} createService A service factory middleware.
 */
ian.IocContainer.prototype.addFactoryMiddleware = function (createService) {
  this.factory_middleware_.push(createService);
};


/**
 * @param {!Function} Class The constructor to instantiate.
 * @return {!Object} An instance of the provided constructor.
 */
ian.IocContainer.prototype.create = function (Class /*, ...args */) {
  var args = Array.prototype.slice.call(arguments, 1);

  /**
   * @constructor
   */
  var Dependant = function () {};
  Dependant.prototype = Class.prototype;

  var instance = new Dependant();
  instance = this.inject.apply(this, [ Class, instance ].concat(args));

  return instance;
};



/**
 * @param {!Function} Class The constructor from which to read dependencies.
 * @param {!Object} instance The instance into whose constructor to inject.
 */
ian.IocContainer.prototype.inject = function (Class, instance /*, ...args */) {
  var args = Array.prototype.slice.call(arguments, 2);

  var keys = this.getDependencyList_(Class);
  var deps = keys.map(function (key) {
    return this.getService(key, true) || null;
  }, this);

  var reached_existing = false;
  for (var i = deps.length - 1; i >= 0; --i) {
    if (deps[i]) {
      reached_existing = true;
    } else if (reached_existing) {
      throw new Error('Unknown service "' + keys[i] + '" requested.');
    }
  }

  var requested_arg_count = Class.length;
  args = deps.slice(0, requested_arg_count - args.length).concat(args);

  return Class.apply(instance, args) || instance;
};


/**
 * Extracts a dependency list from a constructor function.
 * It checks the $deps prototype key and falls back to parsing the arg list.
 * @param {!Function} Class A constructor function.
 * @return {!Array.<string>} A dependency list.
 */
ian.IocContainer.prototype.getDependencyList_ = function (Class) {
  if (!Class.prototype) {
    // Function#bind() returns a function without a prototype #dafuq
    return [];
  }

  var keys = Class.prototype['$deps'];
  if (!keys) {
    var constructor_source = Class.toString();
    var arg_list = constructor_source.match(/\(([\s\S]*?)\)/m)[1];
    keys = arg_list ? arg_list.split(',') : [];
    keys = keys.map(function (key) {
      return key.trim();
    });
  }

  return keys || [];
};


/**
 * @return {!ian.IocContainer} A child container.
 */
ian.IocContainer.prototype.createChildContainer = function () {
  var options = {};
  options.factories = Object.create(this.factories_);
  options.instances = Object.create(this.instances_);

  var child = new ian.IocContainer(options);
  return child;
};
