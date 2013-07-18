goog.provide('ian.View');

goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 * @param {(string|function():string)=} template A view template to use.
 */
ian.View = function (template) {
  goog.ui.Component.call(this);

  this.template_ = goog.isFunction(template) ? template : function () {
    return template;
  };

  this.element = null; //this.createElementFromTemplate_(template);
  this.subviews_ = [];
};

goog.inherits(ian.View, goog.ui.Component);


/**
 * @param {(string|function():string)=} template A view template to use.
 * @return {!Element} An element or a document fragment (depending on the number
 *   of elements resulting from the template).
 */
ian.View.prototype.createElementFromTemplate_ = function (template) {
  var dom = this.getDomHelper();

  if (!template) {
    return dom.createDom('div');
  }

  if (goog.isFunction(template)) {
    template = template();
  }

  return /** @type {!Element} */ (dom.htmlToDocumentFragment(template));
};


/**
 * @param {!ian.View} subview The subview to add.
 */
ian.View.prototype.addSubview = function (subview) {
  this.subviews_.push(subview);
  this.addSubviewElement(subview.element);

  subview.setParentView(this);
};


/**
 * @param {!ian.View} subview The subview to remove.
 */
ian.View.prototype.removeSubview = function (subview) {
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
 * @param {Element} element The subview element to add.
 */
ian.View.prototype.addSubviewElement = function (element) {
  if (element) {
    this.element.appendChild(element);
  }
};


/**
 * @param {Element} element The subview element to remove.
 */
ian.View.prototype.removeSubviewElement = function (element) {
  if (element) {
    this.element.removeChild(element);
  }
};


ian.View.prototype.setParentView = function (parent_view) {
  this.parent_view_ = parent_view;

  if (parent_view) {
    this.enterDocument();
  } else {
    this.exitDocument();
  }
};


ian.View.prototype.getParentView = function () {
  return this.parent_view_;
};


ian.View.prototype.dispose = function () {
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
