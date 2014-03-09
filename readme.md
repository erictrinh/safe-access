# Safe Access

`safe-access` is a Javascript utility to allow for safe accessing of nested properties by soaking up nulls, inspired by Coffeescript's [existential operator](http://coffeescript.org/#operators).

## I know Coffeescript. Why should I use this?

Are you writing Javascript and miss doing this in Coffeescript?

```coffeescript
very?.nested?.property?.and?.array?[0]?.func?()
```

Well, now you can do that without all the question marks:

```javascript
var access = require('safe-access');
access(very, 'nested.property.and.array[0].func()');
```

## I don't know Coffeescript. Why should I use this?

When accessing deeply nested properties in Javascript, it's important to guard against accessing non-existent properties in the middle of a chain. For example, `obj.that.is.very.nested` will throw an error if the property `that` doesn't exist. This is bad because it halts your program altogether (unless you have a try/catch in place). In Javascript, one way to guard against this is with long `&&` chains:

```javascript
var nestedThang = obj.that && obj.that.is && obj.that.is.very && obj.that.is.very.nested;
```

`nestedThang` will simply be `undefined` if `that` doesn't exist (instead of throwing an error). But, this gets quite messy (and annoying to type out).

The equivalent, using `safe-access`:

```javascript
var access = require('safe-access');
var nestedThang = access(obj, 'that.is.very.nested');
```

`safe-access` can even be used to safely access arrays and call functions:

```javascript
var obscenelyNested = access(obj, 'leading.to.array[0].andFunc()');
```

which is the equivalent of this charming thing in Javascript:

```javascript
var obscenelyNested = obj &&
  obj.leading &&
  obj.leading.to &&
  obj.leading.to.array &&
  obj.leading.to.array[0] &&
  obj.leading.to.array[0].andFunc &&
  (typeof obj.leading.to.array[0].andFunc === 'function' ?
  obj.leading.to.array[0].andFunc() :
  undefined);
```

## Calling functions with arguments

Sometimes, it's necessary to call functions with some arguments. Every argument after the accessor string (3rd argument and beyond) will be used as the arguments to each function call in the accessor string. Like this:

```javascript
// equivalent of `obj.thing.add(1, 2);`
access(obj, 'thing.add()', [1, 2]);
```

Or maybe you have multiple function calls that receive arguments:

```javascript
// equivalent of `thing.add(1, 2).toFixed(1).substr(2);`
access(obj, 'thing.add().toFixed().substr()', [1, 2], 1, 2);
```

Notice that if you need to pass in multiple arguments (like in the `add` function), you'll need to pass the arguments as an array. The caveat is **if you need to pass in an array as an argument, you'll need to pass in a nested array**.

An example, passing in an array as an argument:

```javascript
access(window._, 'compact()', [[ false, 'boop', 'beep', '', 'meep' ]]);
// returns [ 'boop', 'beep', 'meep' ] OR undefined if window._ doesn't exist
```

## Automatic Currying
`safe-access` auto-curries, which means omitting the second argument will return a function that you can use to access the same object over and over again. This can be useful if you are accessing many different nested properties on an object.

```javascript
var objDot = access(obj);
objDot('nested.thing'); // obj.nested.thing
objDot('other.nested.thing'); // obj.other.nested.thing
```
