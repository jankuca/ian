goog.provide('ian.ui.ResponsiveImage');

goog.require('goog.array');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.ui.Component');


/**
 * @constructor
 * @extends {goog.ui.Component}
 */
ian.ui.ResponsiveImage = function () {
  goog.ui.Component.call(this);

  this.img = null;
  this.sources_ = [];
  this.active_source_ = null;

  if (!ian.ui.ResponsiveImage.viewport) {
    ian.ui.ResponsiveImage.viewport = new goog.dom.ViewportSizeMonitor();
  }
};

goog.inherits(ian.ui.ResponsiveImage, goog.ui.Component);


ian.ui.ResponsiveImage.viewport = null;


ian.ui.ResponsiveImage.convertPicturesInElement = function (container) {
  var pictures = container.getElementsByTagName('picture');

  var responsive_images = goog.array.map(pictures, function (picture) {
    var responsive_image = new ian.ui.ResponsiveImage();
    responsive_image.decorate(picture);
    return responsive_image;
  });

  return responsive_images;
};


ian.ui.ResponsiveImage.prototype.decorate = function (el) {
  goog.base(this, 'decorate', el);

  var img = el.getElementsByTagName('img')[0];
  var sources = goog.array.toArray(el.getElementsByTagName('source'));

  var dom = this.getDomHelper();
  var children = dom.getChildren(el);
  goog.array.forEach(children, function (child) {
    if (child !== img && sources.indexOf(child) === -1) {
      el.removeChild(child);
    }
  });

  this.img = img;
  this.sources_ = goog.array.map(sources, function (source) {
    return {
      src: source.getAttribute('src') || '',
      media: source.getAttribute('media') || null
    };
  });

  this.update();
};


ian.ui.ResponsiveImage.prototype.enterDocument = function () {
  goog.base(this, 'enterDocument');

  var handler = this.getHandler();
  var viewport = ian.ui.ResponsiveImage.viewport;
  handler.listen(viewport, 'resize', this.update);
};


ian.ui.ResponsiveImage.prototype.exitDocument = function () {
  goog.base(this, 'exitDocument');

  var handler = this.getHandler();
  var viewport = ian.ui.ResponsiveImage.viewport;
  handler.unlisten(viewport, 'resize', this.update);
};


ian.ui.ResponsiveImage.prototype.update = function () {
  goog.array.some(this.sources_, function (source) {
    if (source.media && window.matchMedia) {
      var matches = window.matchMedia(source.media).matches;
      if (matches) {
        this.useSource_(source);
        return true;
      }
    } else {
      this.useSource_(source);
      return true;
    }
    return false;
  }, this);
};


ian.ui.ResponsiveImage.prototype.useSource_ = function (source) {
  if (this.active_source_ !== source) {
    this.img.setAttribute('src', source.src);
    this.active_source_ = source;
  }
}
