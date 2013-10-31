goog.provide('ian.ui.Compiler');

goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.string');
goog.require('ian.object');
goog.require('ian.string');
goog.require('ian.ui.Component');
goog.require('ian.ui.ComponentState');
goog.require('ian.ui.$$components');


/**
 * @constructor
 * @param {ian.ServiceContainer=} services A service container.
 */
ian.ui.Compiler = function (services) {
  this.services_ = services;

  this.scope_stack_ = [];

  this.invalidated_components_ = [];
  this.rerender_timeout_ = 0;

  this.handler_ = new goog.events.EventHandler(this);
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


/**
 * @param {!Node} old_node The element to replace.
 * @param {!Node} new_node The replacement.
 */
ian.ui.Compiler.prototype.replaceSubtree = function (old_node, new_node) {
  var parent_node = old_node.parentNode;
  parent_node.replaceChild(new_node, old_node);

  // TODO: Is there a memory leak? (the components in the old subtree)
  // TODO: Clean $children of parent components.

  this.compileSubTree_(new_node);
};


/**
 * @param {!Node} subtree The element to insert.
 * @param {!Element} parent_node The container to insert the element into.
 */
ian.ui.Compiler.prototype.insertSubtreeInto = function (subtree, parent_node) {
  parent_node.appendChild(subtree);

  // TODO: populate parent $children

  this.compileSubTree_(subtree);
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

  if (goog.dom.isElement(root) && !root.hasAttribute('data-component')) {
    component = this.compileElement_(root);
    if (component) {
      root.setAttribute('data-component', '');
    }
  }

  if (!component || !component.$$invalidated) {
    this.compileChildren_(root);
  }

  if (component) {
    if (!component.isInitialized()) {
      component.init();
      component.setInitialized();
    }

    var invalidation_count = 0;
    do {
      if (invalidation_count === 10) {
        throw new Error(
          'Maximum of 10 synchronous invalidations for a component reached');
      }

      if (component.isInvalidated()) {
        var new_element = component.render();
        root.parentNode.insertBefore(new_element, root);
        root.parentNode.removeChild(root);

        invalidation_count += 1;
        component.decorate(new_element);
        root = new_element;

      } else {
        component.decorate(root);
        this.scope_stack_.shift();
      }
    } while (component.isInvalidated());
  }
};


/**
 * @param {!Document|Element} root
 */
ian.ui.Compiler.prototype.compileChildren_ = function (root) {
  if (root.nodeType === goog.dom.NodeType.DOCUMENT) {
    root = root.documentElement;
  }

  goog.array.forEach(root.children, this.compileSubTree_, this);
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
      component.setName(component_class_name);
      component.setState(state);
    }
  }

  return component;
};


ian.ui.Compiler.prototype.getStateFromClasses = function (base, classes) {
  var state = new ian.ui.ComponentState();

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

  var handler = this.handler_;
  handler.listen(component, 'invalidate', this.handleInvalidation_);

  return component;
};


ian.ui.Compiler.prototype.handleInvalidation_ = function (e) {
  var component = e.target;
  this.invalidated_components_.push(component);

  if (!this.rerender_timeout_) {
    var rerender = this.rerenderInvalidated_.bind(this);
    this.rerender_timeout_ = setTimeout(rerender, 0);
  }
};


ian.ui.Compiler.prototype.rerenderInvalidated_ = function () {
  this.rerender_timeout_ = 0;

  var components = this.invalidated_components_;

  var component;
  while (component = components.shift()) {
    var old_element = component.getElement();
    var new_element = component.render();

    this.compileChildren_(new_element);

    old_element.parentNode.replaceChild(new_element, old_element);
    component.decorate(new_element);
  }
};
