goog.provide('ian.path');

goog.require('goog.array');


/**
 * Takes a list of paths and returns a list that contains all the original
 * paths and all parent level paths of those. It does not mutate the original
 * list.
 *
 * Example: [ "a.b.c", "d.e" ] -> [ "a", "a.b", "a.b.c", "d", "d.e" ]
 *
 * @param {!Array.<string>} paths A list of paths.
 * @param {string=} sep A level separator. Default to ".".
 * @return {!Array.<string>} A new list of paths.
 */
ian.path.getAllPaths = function (paths, sep) {
  var result = paths.slice();

  for (var i = 0, ii = paths.length; i < ii; ++i) {
    var levels = paths[i].split(typeof sep === 'string' ? sep : '.');
    var path = '';
    for (var o = 0, oo = levels.length; o < oo; ++o) {
      path += '.' + levels[o];
      if (levels[o] !== '*' && levels[o] !== '**' &&
          result.indexOf(path.substr(1)) === -1) {
        result.push(path.substr(1));
      }
    }
  }

  return result;
};


/**
 * Checks whether a path matches a pattern that can contain "*" and "**"
 * wildcards to represent one or more levels respectively.
 * @param {string} pattern The pattern against which to match.
 * @param {string} path The path to match against the pattern.
 * @param {string=} separator The level separator. Defaults to a slash ("/").
 * @return {boolean} Whether the path matches the pattern.
 */
ian.path.test = function (pattern, path, separator) {
  separator = (separator || '/').replace(/\//g, '\\/');

  pattern = pattern.replace(/\*\*/g, '.*');
  pattern = pattern.replace(/\*/g, '[^' + separator + ']*?');

  var rx = new RegExp('^' + pattern + '$');
  return rx.test(path);
};


/**
 * Checks whether a path matches a pattern from the provided array of patterns.
 * A single match is enough for a positive result. The patterns can contain
 * "*" and "**" wildcards to represent one or more levels respectively.
 * @param {string} patterns The pattern against which to match.
 * @param {string} path The path to match against the patterns.
 * @param {string=} separator The level separator. Defaults to a slash ("/").
 * @return {boolean} Whether the path matches any of the patterns.
 */
ian.path.testAgainstSome = function (patterns, path, separator) {
  if (patterns.length === 0) return false;

  return goog.array.some(patterns, function (pattern) {
    return ian.path.test(pattern, path, separator);
  });
};
