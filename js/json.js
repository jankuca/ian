goog.provide('ian.json');

goog.require('goog.array');
goog.require('ian.path');


/**
 * Stringifies a value into possibly invalid JSON (but a valid JS expression)
 * where provided paths are not quoted. This is useful when generating JS code
 * that should be processed by the Google Closure Compiler compilation.
 *
 * Example:
 *   stringifyWithKnownPaths({ a: 1, b: 2, c: { d: 3, e: 4 }}, [ 'a', 'c.d' ])
 *   <- '{ a: 1, "b": 2, c: { d: 3, "e": 4 }}'
 *
 * You can also use "*" as a wildcard identifier that matches any key but does
 * not exclude the key from being quoted.
 *   stringifyWithKnownPaths({ a: { b: { c: 1 }}}, [ '*.b' ])
 *   <- '{ "a": { b: { "c": 1 }}}'
 *
 * @param {*} val The value to serialize.
 * @param {!Array.<string>} paths A list of paths to exclude from quoting.
 * @param {number=} spaces The number of spaces to use for indentation.
 *   Defaults to 0 (i.e. "do not pretty-print").
 * @param {(function(*):*)=} resolver A function that can transform any value.
 * @return {string} A serialization of the value. Valid JS expression.
 */
ian.json.stringifyWithKnownPaths = function (val, paths, spaces, resolve) {
  paths = ian.path.getAllPaths(paths, '.');

  return ian.json.stringifyWithKnownPaths_(val, paths, spaces, resolve);
};


/**
 * @param {*} value The value to serialize.
 * @param {!Array.<string>} paths A list of paths to exclude from quoting.
 * @param {number=} spaces The number of spaces to use for indentation.
 *   Defaults to 0 (i.e. "do not pretty-print").
 * @param {(function(*):*)=} resolver A function that can transform any value.
 * @param {string} base_path The base path to prepend in front of every key.
 * @param {number} depth The tree depth or the indentation level.
 * @return {string} A serialization of the value. Valid JS expression.
 */
ian.json.stringifyWithKnownPaths_ =
    function (value, paths, spaces, resolve, base_path, depth) {
  base_path = base_path || '';
  depth = depth || 0;

  switch (typeof value) {
  case 'undefined':
    return 'null';

  case 'boolean':
  case 'number':
  case 'string':
    return JSON.stringify(resolve ? resolve(value) : value);

  case 'object':
    if (value === null) {
      return 'null';
    }

    var json = '';

    if (goog.isArray(value)) {
      json += '[';

      for (var i = 0, ii = value.length; i < ii; ++i) {
        if (spaces > 0) {
          json += '\n' + ian.json.generateIndentation_((depth + 1) * spaces);
        }
        json += ian.json.stringifyWithKnownPaths_(
            value[i], paths, spaces, resolve, path, depth + 1);
        json += ',';
      }

      json = json.replace(/,$/, '');
      json += '\n' + ian.json.generateIndentation_(depth * spaces) + ']';

      return json;
    }

    json += '{';

    for (var key in value) {
      var path = base_path + '.' + key;
      if (path[0] === '.') path = path.substr(1);

      json += '\n' + ian.json.generateIndentation_((depth + 1) * spaces);

      if (ian.path.testAgainstSome(paths, path)) {
        json += key;
      } else {
        json += '"' + key.replace(/"/, '\g"') + '"';
      }

      json += ':' + (spaces > 0 ? ' ' : '');
      json += ian.json.stringifyWithKnownPaths_(
          value[key], paths, spaces, resolve, path, depth + 1);

      json += ',';
    }

    json = json.replace(/,$/, '');
    json += '\n' + ian.json.generateIndentation_(depth * spaces) + '}';

    return json;
  }
};


ian.json.generateIndentation_ = function (spaces) {
  var indentation = '';
  while (spaces--) {
    indentation += ' ';
  }

  return indentation;
};
