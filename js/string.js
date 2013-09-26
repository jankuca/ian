goog.provide('ian.string');


/**
 * Converts a string from selector-case to PascalCase (e.g. my-unicorn-poop to
 *   MyUnicornPoop).
 * @param {string} str The string in selector-case form.
 * @return {string} The string in PascalCase form.
 */
ian.string.toPascalCase = function (str) {
  var camel = goog.string.toCamelCase(str);
  var pascal = camel.replace(/^[a-z]/, function (letter) {
    return letter.toUpperCase();
  });
  return pascal;
};


/**
 * Converts a string from selector-case to snake_case (e.g. my-unicorn-poop to
 *   my_unicorn_poop).
 * @param {string} str The string in selector-case form.
 * @return {string} The string in PascalCase form.
 */
ian.string.toSnakeCase = function (str) {
  var snake = str.replace(/-/g, '_');
  return snake;
};
