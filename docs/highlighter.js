
var known_types = {
  'ian.History': './history.html',
  'ian.Location': './location.html',
  'ian.Router': './router.html'
};

var options = {
  comment: false,
  range: true,
  loc: false,
  tolerant: true,
  tokens: true
};

window.onload = highlightCodeTags;


function highlightCodeTags() {
  var scope = [ 'window' ];
  var codes = document.getElementsByTagName('code');
  for (var i = 0, ii = codes.length; i < ii; ++i) {
    var code = codes[i];
    if (!code.webkitMatchesSelector('p code, li code')) {
      try {
        code.innerHTML = highlightCode(code.innerHTML, scope);
      } catch (err) {
        console.log('JS code highlighting error: ' + (err.stack || err));
      }
    }
  }
}


function highlightCode(code, scope) {
  var ranges = [];

  var deleted = 0;
  code = code.replace(/(:(?:\s|&nbsp;)*([\w.|]+?)\??)(,|;|\)(?:\s|$))/g, function (match, type, path, end, index) {
    var value = type;
    if (known_types[path]) {
      value = type.replace(path, '<a href="' + known_types[path] + '">' + path + '</a>');
    }

    ranges.unshift({
      type: 'type',
      value: value,
      index: index - deleted,
      length: value.length
    });
    deleted += type.length;
    return end;
  });

  var tokens = esprima.parse(code, options).tokens;

  scope = scope || [];
  var scopes = [ scope ];
  var variables = scope.slice();

  var expecting_id = false;
  tokens.forEach(function (token, i) {
    if (i === 0 && token.range[0] !== 0) {
      ranges.unshift({
        type: 'comment',
        index: 0,
        length: token.range[0]
      });
    }

    switch (token.type) {
    case 'Keyword':
      if (token.value === 'var' || token.value === 'new') {
        expecting_id = true;
      }
      if (token.value === 'function') {
        expecting_id = null;
      }
      break;

    case 'String':
      ranges.unshift({
        type: 'string',
        index: token.range[0],
        length: token.range[1] - token.range[0]
      });
      break;

    case 'Punctuator':
      if (expecting_id === null && (token.value === ',' || token.value === '(')) {
        expecting_id = true;
      } else {
        expecting_id = false;
      }
      if (token.value === '{') {
        scope = [];
        scopes.push(scope);
      }
      if (token.value === '}') {
        variables.splice(variables.length - scope.length, scope.length);
        scopes.pop();
        scope = scopes[scopes.length - 1];
      }
      break;

    case 'Identifier':
      if (expecting_id) {
        if (tokens[i - 1].value === 'new') {
          var length = token.value.length;
          var t = tokens[++i];
          while (t.value === '.' || t.type === 'Identifier') {
            length += t.value.length;
            t = tokens[++i]
          }
          ranges.push({
            type: 'constructor',
            index: token.range[0],
            length: length
          })
        } else {
          scope.push(token.value);
          variables.push(token.value);
        }
      }

      if (variables.indexOf(token.value) !== -1 && (i === 0 || tokens[i - 1].value !== '.')) {
        ranges.unshift({
          type: 'id',
          index: token.range[0],
          length: token.range[1] - token.range[0]
        });
      }

      if (token.value === 'prototype' && i !== 0 && tokens[i - 1].value === '.') {
        ranges.unshift({
          type: 'prototype',
          index: token.range[0],
          length: token.range[1] - token.range[0]
        });
      }
      break;
    }
  });

  ranges.sort(function (a, b) {
    return b.index - a.index;
  });

  ranges.forEach(function (range) {
    var wrap = [ '', '' ];
    switch (range.type) {
    case 'comment': wrap[0] = '<small>'; wrap[1] = '</small>'; break;
    case 'id': wrap[0] = '<var>'; wrap[1] = '</var>'; break;
    case 'prototype': wrap[0] = '<small>'; wrap[1] = '</small>'; break;
    case 'constructor': wrap[0] = '<strong>'; wrap[1] = '</strong>'; break;
    case 'string': wrap[0] = '<string>'; wrap[1] = '</string>'; break;
    case 'type': wrap[0] = '<s>'; wrap[1] = '</s>'; break;
    }

    if (range.type === 'type') {
      code = code.substr(0, range.index) +
        wrap[0] + range.value + wrap[1] +
        code.substr(range.index);
    } else {
      code = code.substr(0, range.index) +
        wrap[0] +
        code.substr(range.index, range.length) +
        wrap[1] +
        code.substr(range.index + range.length);
    }
  });

  return code;
}
