goog.provide('ian.ui.Compiler');

goog.require('goog.array');
goog.require('goog.string');
goog.require('ian.object');
goog.require('ian.string');
goog.require('ian.ui.Component');
goog.require('ian.ui.$$components');


/**
 * @constructor
 * @param {ian.ServiceContainer=} services A service container.
 */
ian.ui.Compiler = function (services) {
  this.services_ = services;

  this.scope_stack_ = [];
};


/**
 * @param {!Element|Document} root The element on whose level to start
 *   the compilation.
 * @param {(string|null)=} namespace The namespace in which to look
 *   for component definitions. To look for "app.ui.*", specify "app.ui".
 *   Defaults to the global object.
 */
ian.ui.Compiler.prototype.init = function (root, namespace) {
  this.namespace_ = namespace || null;
  this.definitions_ = this.getComponentDefinitions_();

  var global_scope = {};
  this.scope_stack_ = [ global_scope ];
  this.compileSubTree_(root);
};


ian.ui.Compiler.prototype.getComponentDefinitions_ = function () {
  var namespace = this.namespace_;
  var defs = goog.global;

  if (namespace) {
    var levels = namespace.split('.');
    for (var i = 0, ii = levels.length; i < ii; ++i) {
      var level = levels[i];
      defs = goog.isObject(defs[level]) ? defs[level] : {};
    }
  }

  return defs;
};


ian.ui.Compiler.prototype.compileSubTree_ = function (root) {
  var component = null;

  if (goog.dom.isElement(root)) {
    component = this.compileElement_(root);
  }
  goog.array.forEach(root.children, function (child) {
    this.compileSubTree_(child);
  }, this);

  if (component) {
    component.decorate(root);
    this.scope_stack_.shift();
  }
};


/**
 * @param {!Element} element The element to compile.
 * @return {ian.ui.Component} component A newly created component.
 */
ian.ui.Compiler.prototype.compileElement_ = function (element) {
  var defs = this.definitions_;
  var component = null;

  var class_name_attr = element.className;
  if (class_name_attr) {
    var component_class_name;

    var class_names = goog.string.trim(class_name_attr).split(/\s+/);
    for (var i = 0; i < class_names.length; ++i) {
      var constructor_name = ian.string.toPascalCase(class_names[i]);
      if (defs[constructor_name]) {
        component_class_name = class_names[i];
        class_names.splice(i, 1);
        i -= 1;
        component = this.createComponent_(constructor_name, element);
        break;
      }
    }

    if (component_class_name) {
      var state = this.getStateFromClasses(component_class_name, class_names);
      for (var state_key in state) {
        component.setState(state_key, state[state_key]);
      }
    }
  }

  return component;
};


ian.ui.Compiler.prototype.getStateFromClasses = function (base, classes) {
  var state = {};

  for (var i = 0, ii = classes.length; i < ii; ++i) {
    var class_name = classes[i];
    if (class_name.substr(0, base.length + 1) === base + '-') {
      var state_key = class_name.substr(base.length + 1);
      state_key = ian.string.toSnakeCase(state_key);
      state[state_key] = true;
    }
  }

  return state;
};


/**
 * @param {string} constructor_name A component constructor name.
 * @param {!Element} element An element.
 * @return {ian.ui.Component} The newly created component.
 */
ian.ui.Compiler.prototype.createComponent_ =
    function (constructor_name, element) {
  var Component = this.definitions_[constructor_name];
  if (!goog.isFunction(Component)) {
    throw new Error(
        this.namespace_ + '.' + constructor_name + ' is not a constructor');
  }

  var component = this.createComponentInstance_(Component);
  if (!(component instanceof ian.ui.Component)) {
    throw new Error(
        this.namespace_ + '.' + constructor_name +
        ' does not extend ian.ui.Component');
  }

  var scope = ian.object.create(this.scope_stack_[0]);
  this.scope_stack_.unshift(scope);
  component.setScope(scope);

  return component;
};


/**
 * Creates an instance of the provided Constructor. When the compiler is
 *   provided with a service container, it uses it to create the instance.
 * @param {!Function} Component A component constructor function.
 * @return {!ian.ui.Component} A component instance.
 */
ian.ui.Compiler.prototype.createComponentInstance_ = function (Component) {
  var services = this.services_;
  var component;

  if (services) {
    component = services.create(Component);
  } else {
    component = new Component();
  }

  return component;
};
