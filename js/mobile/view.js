goog.provide('ian.mobile.View');

goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {(string|function():string)=} template A view template to use.
 */
ian.mobile.View = function (template) {
  goog.ui.Component.call(this);

  this.element = this.createElementFromTemplate_(template);

  this.in_transition_ = false;
  this.transition_timeout_ = 0;
  this.subviews_ = [];
};

goog.inherits(ian.mobile.View, goog.ui.Component);


/**
 * @param {(string|function():string)=} template A view template to use.
 * @return {!Element} An element or a document fragment (depending on the number
 *   of elements resulting from the template).
 */
ian.mobile.View.prototype.createElementFromTemplate_ = function (template) {
  var dom = this.getDomHelper();

  if (!template) {
    return dom.createDom('div');
  }

  if (goog.isFunction(template)) {
    template = template();
  }

  return (/** @type {!Element} */ dom.htmlToDocumentFragment(template));
};


/**
 * @param {!ian.mobile.View} subview The subview to add.
 */
ian.mobile.View.prototype.addSubview = function (subview) {
  this.subviews_.push(subview);
  this.addSubviewElement(subview.element);

  subview.setParentView(this);
};


/**
 * @param {!ian.mobile.View} subview The subview to remove.
 */
ian.mobile.View.prototype.removeSubview = function (subview) {
  var index = goog.array.indexOf(this.subviews_, subview);
  if (index !== -1) {
    this.subviews_.splice(index, 1);
  }

  this.removeSubviewElement(subview.element);

  var parent_view = subview.getParentView();
  if (parent_view === this) {
    subview.setParentView(null);
  }
};


/**
 * @param {!Element} element The subview element to add.
 */
ian.mobile.View.prototype.addSubviewElement = function (element) {
  this.element.appendChild(element);
};


/**
 * @param {!Element} element The subview element to remove.
 */
ian.mobile.View.prototype.removeSubviewElement = function (element) {
  this.element.removeChild(element);
};


ian.mobile.View.prototype.setParentView = function (parent_view) {
  this.parent_view_ = parent_view;

  if (parent_view) {
    this.enterDocument();
  } else {
    this.exitDocument();
  }
};


ian.mobile.View.prototype.getParentView = function () {
  return this.parent_view_;
};


ian.mobile.View.prototype.dispose = function () {
  if (this.in_transition_) {
    var self = this;
    setTimeout(function () {
      self.dispose();
    }, 100);
    return;
  }

  goog.base(this, 'dispose');

  if (this.parent_view_) {
    this.parent_view_.removeSubview(this);
  }

  var parent_element = this.element.parentNode;
  if (parent_element) {
    parent_element.removeChild(this.element);
  }

  goog.array.forEach(this.subviews_, function (subview) {
    subview.dispose();
  });
};


ian.mobile.View.prototype.beInTransitionFor = function (ms) {
  clearTimeout(this.transition_timeout_);

  this.in_transition_ = true;

  var self = this;
  this.transition_timeout_ = setTimeout(function () {
    self.in_transition_ = false;
    self.onTransitionEnd();
  }, ms);
};

ian.mobile.View.prototype.onTransitionEnd = function () {
  // override this
};


ian.mobile.View.prototype.slideLeft = function () {
  goog.dom.classes.add(this.element, 'slide');
  goog.dom.classes.remove(this.element, 'right');
  goog.dom.classes.add(this.element, 'left');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.slideRight = function () {
  goog.dom.classes.add(this.element, 'slide');
  goog.dom.classes.remove(this.element, 'left');
  goog.dom.classes.add(this.element, 'right');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.slideIn = function () {
  goog.dom.classes.add(this.element, 'slide');
  goog.dom.classes.remove(this.element, 'left');
  goog.dom.classes.remove(this.element, 'right');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.fadeOut = function () {
  goog.dom.classes.add(this.element, 'fade');
  goog.dom.classes.remove(this.element, 'in');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.fadeIn = function () {
  goog.dom.classes.add(this.element, 'fade');
  goog.dom.classes.add(this.element, 'in');

  this.beInTransitionFor(500);
};
