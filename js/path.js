goog.provide('ian.path');


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
      if (result.indexOf(path.substr(1)) === -1) {
        result.push(path.substr(1));
      }
    }
  }

  return result;
};
