goog.provide('ian.object');


/**
 * Creates a new object that optionally inherits from the provided parent.
 * @param {Object=} proto An optional parent object.
 * @return {!Object} A new object.
 */
ian.object.create = function (proto) {
  if (!proto) {
    return  {};
  }
  if (Object.create) {
    return Object.create(proto);
  }

  /**
   * A helper constructor function for setting up inheritance between
   *   the provided parent object and the newly created child object.
   * @constructor
   */
  var ChildObject = function () {};
  ChildObject.prototype = proto;

  return new ChildObject();
};
