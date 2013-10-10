var fs = require('fs');

goog.require('ian.json');


module.exports = function (output_filename) {
  return function (style) {
    var components = {};

    style.rules.forEach(function (rule) {
      if (rule.type === 'comment') return;

      rule.selectors.forEach(function (selector) {
        if (selector[0] !== '.' || !/^\S+$/.test(selector)) return;
        selector = selector.substr(1);

        rule.declarations.forEach(function (declaration) {
          if (declaration.type === 'comment') return;

          var parent_selectors = declaration.value.split(/\s*,\s*/);
          parent_selectors = parent_selectors.filter(function (parent_selector) {
            return (parent_selector[0] === '.' && /^\S+$/.test(parent_selector));
          }).map(function (parent_selector) {
            return parent_selector.substr(1);
          });
          if (parent_selectors.length === 0) return;

          var component;

          switch (declaration.property) {
          case 'state-of':
            var prefix = selector.substr(0, parent_selectors[0].length + 1);
            if (prefix !== parent_selectors[0] + '-') return;

            component = components[parent_selectors[0]] || {};
            component.states = component.states || [];
            component.states.push(selector.substr(declaration.value.length));
            components[parent_selectors[0]] = component;
            break;

          case 'extends':
            component = components[selector] || {};
            component.extends = component.extends || [];
            component.extends = component.extends.concat(parent_selectors);
            components[selector] = component;
            break;

          default:
            return;
          }
        });
      });
    });

    var tree = ian.json.stringifyWithKnownPaths(
        components, [ '*.extends', '*.states' ], 2);

    fs.writeFileSync(output_filename, tree, 'utf8');
  };
};
