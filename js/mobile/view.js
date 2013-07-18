goog.provide('ian.mobile.View');

goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('ian.View');


/**
 * @constructor
 * @extends {ian.View}
 * @param {(string|function():string)=} template A view template to use.
 */
ian.mobile.View = function (template) {
  ian.View.call(this);

  this.element = this.createElementFromTemplate_(template);

  this.in_transition_ = false;
  this.transition_timeout_ = 0;
};

goog.inherits(ian.mobile.View, ian.View);


ian.mobile.View.prototype.dispose = function () {
  if (this.in_transition_) {
    var self = this;
    setTimeout(function () {
      self.dispose();
    }, 100);
    return;
  }

  goog.base(this, 'dispose');
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
