
var assert = require('assert');
var fs = require('fs');
var vm = require('vm');
var path = 'public/javascripts/lib-forecash.js';

var code = fs.readFileSync(path);
vm.runInThisContext(code);

describe('Days of the week', function() {
  describe('value set correctly', function () {
    it('should return 1 because Monday is day 1', function () {
      assert.equal(1, Monday);
    });
  });
});

describe('Natural Language Processing', function() {
  describe('parse_dateCondition', function () {
    describe('every second Wednesday including 23/3/2016', function () {
        it('should return true because 23/3/2016 was specified to be included', function () {
            assert.equal(true, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,23), "test"));
        });
        it('should return false because 30/3/2016 is ONE Wednesday after date to be included', function () {
            assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,30), "test"));
        });
        it('should return false because 16/3/2016 is ONE Wednesday before date to be included', function () {
            assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,16), "test"));
        });
        it('should return false because 22/3/2016 is a Tuesday', function () {
            assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,22), "test"));
        });
        it('should return false because 24/3/2016 is a Thursday', function () {
            assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,24), "test"));
        });
    });
    // Strings to add!
    // Tuesday every two weeks
    // Tuesday every two weeks including -date-
    // Each fortnight on tuesday
    // Each fortnight on tuesday including -date-
    // every 10 weeks
  });
});