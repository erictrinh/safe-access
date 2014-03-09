module.exports = function access(obj, accessStr) {
  // auto-curry here
  if (isUndefined(accessStr)) {
    return access.bind(null, obj);
  }

  var funcArgs = Array.prototype.slice.call(arguments, 2);
  return helper(obj, tokenize(accessStr), null, funcArgs);
};

function helper(obj, tokens, ctx, fnArgs) {
  if (tokens.length === 0) {
    return obj;
  }

  var currentToken = tokens[0];

  if (isUndefined(obj) || isNull(obj) ||
    (isTokenFunctionCall(currentToken) && !isFunction(obj))) {
    return undefined;
  }

  if (isTokenFunctionCall(currentToken)) {

    return helper(obj[isArray(fnArgs[0]) ? 'apply' : 'call'](ctx, fnArgs[0]),
      tokens.slice(1),
      // clear context because consecutive fn calls execute in global context
      // e.g. `a.b()()`
      null,
      fnArgs.slice(1));

  } else if (isTokenArrayAccess(currentToken)) {

    return helper(obj[parseInt(currentToken.substr(1), 10)],
      tokens.slice(1),
      // lookahead two tokens for function calls
      isTokenFunctionCall(tokens[1]) ? obj : ctx,
      fnArgs);

  } else {

    return helper(obj[currentToken],
      tokens.slice(1),
      // lookahead two tokens for function calls
      isTokenFunctionCall(tokens[1]) ? obj : ctx,
      fnArgs);

  }
}

function isUndefined(a) {
  return a === void 0;
}

function isNull(a) {
  return a === null;
}

function isArray(a) {
  return Array.isArray(a);
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
