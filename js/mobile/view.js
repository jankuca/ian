goog.provide('ian.mobile.View');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ian.mobile.View = function () {
  goog.ui.Component.call(this);

  this.in_transition_ = false;
  this.transition_timeout_ = 0;
};

goog.inherits(ian.mobile.View, goog.ui.Component);


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
  var element = this.getElement();

  goog.dom.classlist.add(element, 'slide');
  goog.dom.classlist.remove(element, 'right');
  goog.dom.classlist.add(element, 'left');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.slideRight = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'slide');
  goog.dom.classlist.remove(element, 'left');
  goog.dom.classlist.add(element, 'right');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.slideIn = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'slide');
  goog.dom.classlist.remove(element, 'left');
  goog.dom.classlist.remove(element, 'right');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.fadeOut = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'fade');
  goog.dom.classlist.remove(element, 'in');

  this.beInTransitionFor(500);
};


ian.mobile.View.prototype.fadeIn = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'fade');
  goog.dom.classlist.add(element, 'in');

  this.beInTransitionFor(500);
};
