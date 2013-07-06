goog.provide('ian.ui.Select');

goog.require('goog.array');
goog.require('goog.dom.classes');
goog.require('goog.dom.forms');
goog.require('goog.events.Event');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.style');
goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ian.ui.Select = function () {
  goog.ui.Component.call(this);

  this.select_box_ = null;
  this.value_el_ = null;
  this.dropdown_items_ = [];
  this.is_dropdown_disabled_ = false;

  this.key_handler_ = null;

  this.value_ = '';
  this.is_open_ = false;
  this.selected_index_ = 0;
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


ian.ui.Select.prototype.setDropdownDisabled = function (disable) {
  this.is_dropdown_disabled_ = !!disable;
};


ian.ui.Select.prototype.decorate = function (select_box) {
  this.select_box_ = select_box;

  var dom = this.getDomHelper();
  var el = dom.createDom('div', { 'class': 'select' });

  this.value_el_ = dom.createDom('span', { 'class': 'select-value' });
  el.appendChild(this.value_el_);

  if (!goog.userAgent.MOBILE && !this.is_dropdown_disabled_) {
    this.dropdown_el_ = dom.createDom('ul', { 'class': 'select-options' });

    var dropdown_items = [];
    this.dropdown_items_ = dropdown_items;

    for (var i = 1, ii = select_box.options.length; i < ii; ++i) {
      var option = select_box.options[i];
      var dropdown_item_label = dom.getTextContent(option) || option.value;
      var dropdown_item_el = dom.createDom('li', {}, dropdown_item_label);
      if (i === select_box.selectedIndex) {
        goog.dom.classes.add(dropdown_item_el, 'selected');
      }
      this.dropdown_el_.appendChild(dropdown_item_el);
      dropdown_items.push(dropdown_item_el);
    }

    goog.style.setElementShown(this.dropdown_el_, false);
    el.appendChild(this.dropdown_el_);

    el.setAttribute('tabindex', '-1');
    goog.style.setElementShown(this.select_box_, false);
  }

  select_box.parentNode.insertBefore(el, this.select_box_);
  el.appendChild(this.select_box_);

  goog.base(this, 'decorate', el);

  this.update();
};


ian.ui.Select.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var el = this.getElement();
  var handler = this.getHandler();
  this.key_handler_ = new goog.events.KeyHandler(el);

  handler.listen(this.select_box_, 'change', this.update);
  handler.listen(this.key_handler_, 'key', this.handleKey_);
  handler.listen(el, 'click', this.handleClick_);
  handler.listen(el, 'blur', this.close_);
};


ian.ui.Select.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var el = this.getElement();
  var handler = this.getHandler();

  handler.unlisten(this.select_box_, 'change', this.update);
  handler.unlisten(this.key_handler_, 'key', this.handleKey_);
  handler.unlisten(el, 'click', this.handleClick_);
  handler.unlisten(el, 'blur', this.close_);

  this.key_handler_.dispose();
  this.key_handler_ = null;
};


ian.ui.Select.prototype.update = function () {
  var dom = this.getDomHelper();

  var selected_index = this.select_box_.selectedIndex;
  var option = this.select_box_.options[selected_index];
  var option_label = dom.getTextContent(option) || option.value;
  var value = option.value || option_label;

  var old_dropdown_item = this.dropdown_items_[this.selected_index_ - 1];
  var new_dropdown_item = this.dropdown_items_[selected_index - 1];
  if (old_dropdown_item) {
    goog.dom.classes.remove(old_dropdown_item, 'selected');
  }
  if (new_dropdown_item) {
    goog.dom.classes.add(new_dropdown_item, 'selected');
  }

  dom.setTextContent(this.value_el_, option_label);

  this.selected_index_ = selected_index;
  if (value !== this.value_) {
    this.value_ = value;

    var change_e = new goog.events.Event('change');
    this.dispatchEvent(change_e);
  }
};


ian.ui.Select.prototype.open_ = function () {
  if (this.dropdown_el_) {
    goog.style.setElementShown(this.dropdown_el_, true);
  }
  this.is_open_ = true;
};


ian.ui.Select.prototype.close_ = function () {
  if (this.dropdown_el_) {
    goog.style.setElementShown(this.dropdown_el_, false);
  }
  this.is_open_ = false;
};


ian.ui.Select.prototype.handleKey_ = function (e) {
  if (e.keyCode === goog.events.KeyCodes.DOWN && !this.is_open_) {
    this.open_();
    return;
  }

  switch (e.keyCode) {
  case goog.events.KeyCodes.UP:
  case goog.events.KeyCodes.LEFT:
    this.select_box_.selectedIndex -= 1;
    break;
  case goog.events.KeyCodes.DOWN:
  case goog.events.KeyCodes.RIGHT:
    this.select_box_.selectedIndex += 1;
    break;
  case goog.events.KeyCodes.HOME:
  case goog.events.KeyCodes.PAGE_UP:
    this.select_box_.selectedIndex = 0;
    break;
  case goog.events.KeyCodes.END:
  case goog.events.KeyCodes.PAGE_DOWN:
    this.select_box_.selectedIndex = this.select_box_.options.length;
    break;
  default:
    return;
  }

  this.update();
};


ian.ui.Select.prototype.handleClick_ = function (e) {
  if (!this.is_open_) {
    this.open_();
    this.getElement().focus();
  } else {
    var target = e.target;
    if (target.tagName === 'LI') {
      var index = goog.array.indexOf(this.dropdown_items_, target);
      if (index !== -1) {
        this.select_box_.selectedIndex = index + 1;
        this.update();
      }
    }
    this.close_();
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
