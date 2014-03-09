module.exports = function access(obj, accessStr) {
  if (isUndefined(accessStr)) {
    return access.bind(null, obj);
  }

  var funcArgs = Array.prototype.slice.call(arguments, 2);
  return accessHelper(obj, tokenize(accessStr), null, funcArgs);
};

// there must be at least one token
function accessHelper(obj, tokens, context, funcArgs) {
  if (tokens.length === 0) {
    return obj;
  }

  // lookahead for function call
  if (isTokenFunctionCall(tokens[1])) {
    context = obj;
  }

  var firstToken = tokens.shift();

  if (obj == null || (isTokenFunctionCall(firstToken) && !isFunction(obj))) {
    return undefined;
  }

  if (isTokenFunctionCall(firstToken)) {
    obj = obj.apply(context, function() {
      var args = funcArgs.shift();
      if (!Array.isArray(args)) {
        args = [args];
      }
      return args;
    }());
    context = null;
  } else if (isTokenArrayAccess(firstToken)) {
    obj = obj[parseInt(firstToken.substr(1), 10)];
  } else {
    obj = obj[firstToken];
  }

  return accessHelper(obj, tokens, context, funcArgs);
}

function isUndefined(a) {
  return a === void 0;
}

function isFunction(a) {
  return typeof a === 'function';
}

function isTokenFunctionCall(token) {
  return token === '()';
}

function isTokenArrayAccess(token) {
  return /^\[\d+\]$/.test(token);
}

function tokenize(str) {
  return str.split(/\.|(\(\))|(\[\d+?])/).filter(function(t) { return t; });
}
