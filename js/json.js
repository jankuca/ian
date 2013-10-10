goog.provide('ian.json');


/**
 * Stringifies a value into possibly invalid JSON (but a valid JS expression)
 * where provided paths are not quoted. This is useful when generating JS code
 * that should be processed by the Google Closure Compiler compilation.
 *
 * Example:
 *   stringifyWithKnownPaths({ a: 1, b: 2, c: { d: 3, e: 4 }}, [ 'a', 'c.d' ])
 *   <- '{ a: 1, "b": 2, c: { d: 3, "e": 4 }}'
 *
 * @param {*} value The value to serialize.
 * @param {!Array.<string>} paths A list of paths to exclude from quoting.
 * @param {number=} spaces The number of spaces to use for indentation.
 *   Defaults to 0 (i.e. "do not pretty-print").
 * @param {(function(*):*)=} resolver A function that can transform any value.
 * @return {string} A serialization of the value. Valid JS expression.
 */
ian.json.stringifyWithKnownPaths = function (value, paths, spaces, resolve) {
  paths = ian.path.getAllPaths(paths, '.');

  return ian.json.stringifyWithKnownPaths_(value, paths, spaces, resolve);
};


/**
 * @param {*} val The value to serialize.
 * @param {!Array.<string>} paths A list of paths to exclude from quoting.
 * @param {number=} spaces The number of spaces to use for indentation.
 *   Defaults to 0 (i.e. "do not pretty-print").
 * @param {(function(*):*)=} resolver A function that can transform any value.
 * @param {string} base_path The base path to prepend in front of every key.
 * @return {string} A serialization of the value. Valid JS expression.
 */
ian.json.stringifyWithKnownPaths_ =
    function (val, paths, spaces, resolve, base_path) {
  switch (typeof value) {
  case 'boolean':
  case 'number':
  case 'string':
    return JSON.stringify(resolve ? resolve(value) : value);

  case 'object':
    var json = '{';

    for (var key in value) {
      var path = base_path + '.' + key;
      if (path[0] === '.') path = path.substr(1);

      if (paths.indexOf(path) !== -1) {
        json += key;
      } else {
        json += '"' + key.replace(/"/, '\g"') + '"';
      }

      json += ian.json.stringifyWithKnownPaths_(
          value, paths, spaces, resolve, path);
    }

    json += '}';
    return json;
  }
};
