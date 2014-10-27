goog.provide('ian.mobile.TransitionableView');

goog.require('goog.array');
goog.require('goog.dom.classlist');
goog.require('ian.mobile.View');


/**
 * @constructor
 * @extends {ian.mobile.View}
 */
ian.mobile.TransitionableView = function () {
  ian.mobile.View.call(this);

  this.in_transition_ = false;
  this.transition_timeout_ = 0;
};

goog.inherits(ian.mobile.TransitionableView, ian.mobile.View);


ian.mobile.TransitionableView.prototype.dispose = function () {
  if (this.in_transition_) {
    var self = this;
    setTimeout(function () {
      self.dispose();
    }, 100);
    return;
  }

  goog.base(this, 'dispose');
};


ian.mobile.TransitionableView.prototype.beInTransitionFor = function (ms) {
  clearTimeout(this.transition_timeout_);

  this.in_transition_ = true;

  var self = this;
  this.transition_timeout_ = setTimeout(function () {
    self.in_transition_ = false;
    self.onTransitionEnd();
  }, ms);
};

ian.mobile.TransitionableView.prototype.onTransitionEnd = function () {
  // override this
};


ian.mobile.TransitionableView.prototype.slideLeft = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'slide');
  goog.dom.classlist.remove(element, 'right');
  goog.dom.classlist.add(element, 'left');

  this.beInTransitionFor(500);
};


ian.mobile.TransitionableView.prototype.slideRight = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'slide');
  goog.dom.classlist.remove(element, 'left');
  goog.dom.classlist.add(element, 'right');

  this.beInTransitionFor(500);
};


ian.mobile.TransitionableView.prototype.slideIn = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'slide');
  goog.dom.classlist.remove(element, 'left');
  goog.dom.classlist.remove(element, 'right');

  this.beInTransitionFor(500);
};


ian.mobile.TransitionableView.prototype.fadeOut = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'fade');
  goog.dom.classlist.remove(element, 'in');

  this.beInTransitionFor(500);
};


ian.mobile.TransitionableView.prototype.fadeIn = function () {
  var element = this.getElement();

  goog.dom.classlist.add(element, 'fade');
  goog.dom.classlist.add(element, 'in');

  this.beInTransitionFor(500);
};
