var expect = require('chai').expect;
var access = require('./index.js');

describe('safe-access', function() {
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
      f: null,
      e: false,
      g: ''
    },
    returnThis: function() {
      return this;
    },
    returnReturnThis: function() {
      return function() {
        return this;
      };
    },
    arr: [{key: 'hey'}]
  };

  var b = ['one', function() { return this; }];

  var aDot = access(a);
  var bDot = access(b);

  describe('property access', function() {
    it('should return undefined if the initial object is undefined', function() {
      expect(access(undefined, 'b.c.d')).to.be.undefined;
    });

    it('should access 1 level down properly', function() {
      expect(aDot('b')).to.equal(a.b);
    });

    it('should return the right value even if the value is falsey', function() {
      expect(aDot('b.e')).to.be.false;
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

    it('should return the null property', function() {
      expect(aDot('b.f')).to.be.null;
    });

    it('should behave correctly with properties that are null', function() {
      expect(aDot('b.f.e')).to.be.undefined;
    });
  });


  describe('array access', function() {
    it('should access arrays', function() {
      expect(aDot('arr[0].key')).to.equal('hey');
    });

    it('should soak faulty array accesses', function() {
      expect(aDot('arr[1].key')).to.be.undefined;
    });

    it('should work if the first token is an array access', function() {
      expect(bDot('[0]')).to.equal('one');
    });
  });

  describe('function calls', function() {
    it('should call a function', function() {
      expect(aDot('b.c.d()')).to.be.equal('hi!');
    });

    it('should access past the falsey value', function() {
      expect(aDot('b.g.concat()', 'boop!')).to.equal('boop!');
    });

    it('should returned undefined if trying to call a non-function', function() {
      expect(aDot('b.c()')).to.be.undefined;
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

    it('should call a function-returning function in the global context', function() {
      expect(aDot('returnReturnThis()()')).to.equal(global);
    });

    it('should call a function in an array with the array as context', function() {
      expect(bDot('[1]()')).to.equal(b);
    });
  });

});
