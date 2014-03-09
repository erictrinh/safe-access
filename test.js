var expect = require('chai').expect;
var access = require('./index.js');

describe('access', function() {
  var a = {
    b: {
      c: {
        d: function() {
          return 'hi!';
        }
      },
      add: function(a, b) {
        return a + b;
      },
      f: null
    },
    returnThis: function() {
      return this;
    },
    arr: [{key: 'hey'}]
  };

  var b = ['one', function() { return this; }];

  var aDot = access.bind(null, a);
  var bDot = access.bind(null, b);

  it('should access 1 level down properly', function() {
    expect(aDot('b')).to.equal(a.b);
  });

  it('should return undefined if property doesn\'t exist', function() {
    expect(aDot('yippee')).to.be.undefined;
  });

  it('should access 2 levels down', function() {
    expect(aDot('b.c')).to.equal(a.b.c);
  });

  it('should not freak out if a property in the chain is non-existent', function() {
    expect(aDot('yippee.c')).to.be.undefined;
    expect(aDot('b.yippee.c')).to.be.undefined;
  });

  it('should call a function', function() {
    expect(aDot('b.c.d()')).to.be.equal('hi!');
  });

  it('should returned undefined if trying to call a non-function', function() {
    expect(aDot('b.c()')).to.be.undefined;
  });

  it('should return the null property', function() {
    expect(aDot('b.f')).to.be.null;
  });

  it('should behave correctly with properties that are null', function() {
    expect(aDot('b.f.e')).to.be.undefined;
  });

  it('should call the function with the rest args', function() {
    expect(aDot('b.add()', [1, 2])).to.equal(3);
  });

  it('should call the function with more than 1 rest args with correct context', function() {
    expect(aDot('b.add().toFixed()', [1, 2], 2)).to.equal('3.00');
  });

  it('should call a shallow function in the context of the primary object', function() {
    expect(aDot('returnThis()')).to.equal(a);
  });

  it('should access arrays', function() {
    expect(aDot('arr[0].key')).to.equal('hey');
  });

  it('should soak faulty array accesses', function() {
    expect(aDot('arr[1].key')).to.be.undefined;
  });

  it('should work if the first token is an array access', function() {
    expect(bDot('[0]')).to.equal('one');
  });

  it('should call a function in an array with the array as context', function() {
    expect(bDot('[1]()')).to.equal(b);
  })

});
