goog.provide('ian.ui.Select');

goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.dom.forms');
goog.require('goog.events.Event');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ian.ui.Select = function () {
  goog.ui.Component.call(this);

  this.select_box_ = null;
  this.value_el_ = null;

  this.key_handler_ = null;

  this.value_ = '';
};

goog.inherits(ian.ui.Select, goog.ui.Component);


ian.ui.Select.convertSelectBoxesInElement = function (container) {
  var select_boxes = container.getElementsByTagName('select');
  var selects = [];

  goog.array.forEach(select_boxes, function (select_box) {
    if (!goog.dom.classes.has(select_box.parentNode, 'select')) {
      var select = new ian.ui.Select();
      select.decorate(select_box);

      selects.push(select);
    }
  });

  return selects;
};


ian.ui.Select.prototype.decorate = function (select_box) {
  this.select_box_ = select_box;

  var dom = this.getDomHelper();
  var el = dom.createDom('div', { 'class': 'select' });
  this.value_el_ = dom.createDom('span', { 'class': 'select-value' });

  el.appendChild(this.value_el_);
  select_box.parentNode.insertBefore(el, this.select_box_);
  el.appendChild(this.select_box_);

  goog.base(this, 'decorate', el);

  this.update();
};


ian.ui.Select.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  this.key_handler_ = new goog.events.KeyHandler(this.select_box_);

  var handler = this.getHandler();
  handler.listen(this.select_box_, 'change', this.update);
  handler.listen(this.key_handler_, 'key', this.handleKey_);
};


ian.ui.Select.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var handler = this.getHandler();
  handler.unlisten(this.select_box_, 'change', this.update);
  handler.unlisten(this.key_handler_, 'key', this.handleKey_);

  this.key_handler_.dispose();
  this.key_handler_ = null;
};


ian.ui.Select.prototype.update = function () {
  var dom = this.getDomHelper();

  var selected_index = this.select_box_.selectedIndex;
  var option = this.select_box_.options[selected_index];
  var option_label = dom.getTextContent(option) || option.value;
  var value = option.value || option_label;

  dom.setTextContent(this.value_el_, option_label);

  if (value !== this.value_) {
    this.value_ = value;

    var change_e = new goog.events.Event('change');
    this.dispatchEvent(change_e);
  }
};


ian.ui.Select.prototype.handleKey_ = function (e) {
  switch (e.keyCode) {
  case goog.events.KeyCodes.UP:
  case goog.events.KeyCodes.DOWN:
  case goog.events.KeyCodes.LEFT:
  case goog.events.KeyCodes.RIGHT:
  case goog.events.KeyCodes.HOME:
  case goog.events.KeyCodes.END:
  case goog.events.KeyCodes.PAGE_UP:
  case goog.events.KeyCodes.PAGE_DOWN:
    this.update();
    break;
  }
};


ian.ui.Select.prototype.getValue = function () {
  return goog.dom.forms.getValue(this.select_box_);
};


ian.ui.Select.prototype.getSelectedOption = function () {
  var selected_index = this.select_box_.selectedIndex;
  var option = this.select_box_.options[selected_index];
  return option;
};


ian.ui.Select.prototype.getSelectBoxElement = function () {
  return this.select_box_;
};


ian.ui.Select.prototype.getSelectedOptionIndex = function (index) {
  return this.select_box_.selectedIndex;
};


ian.ui.Select.prototype.setSelectedOptionIndex = function (index) {
  this.select_box_.selectedIndex = index;
  this.update();
};
