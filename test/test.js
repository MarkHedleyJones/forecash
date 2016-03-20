
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
    describe('Tuesday every two weeks', function () {
        it('should return true because 15/3/2016 is an even Tuesday', function () {
            assert.equal(true, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,15), "test"));
        });
        it('should return false because 22/3/2016 is an odd Tuesday', function () {
            assert.equal(false, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,22), "test"));
        });
        it('should return true because 29/3/2016 is an even Tuesday', function () {
            assert.equal(true, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,29), "test"));
        });
        it('should return false because 14/3/2016 is a Monday', function () {
            assert.equal(false, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,14), "test"));
        });
        it('should return false because 16/3/2016 is a Wednesday', function () {
            assert.equal(false, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,16), "test"));
        });
    });
    describe('Tuesday every two weeks including 22/3/2016', function () {
        it('should return true because 8/3/2016 is a specified Tuesday', function () {
            assert.equal(true, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,8), "test"));
        });
        it('should return false because 15/3/2016 is the non-specified Tuesday', function () {
            assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,15), "test"));
        });
        it('should return true because 22/3/2016 was a specified Tuesday', function () {
            assert.equal(true, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,22), "test"));
        });
        it('should return false because 29/3/2016 was a non-specified Tuesday', function () {
            assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,29), "test"));
        });
        it('should return false because 21/3/2016 is a Monday', function () {
            assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,21), "test"));
        });
        it('should return false because 23/3/2016 is a Wednesday', function () {
            assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,23), "test"));
        });
    });
    // Strings to add!
    // Each fortnight on tuesday
    // Each fortnight on tuesday including -date-
    // Tuesday every fortnight
    // every 2 weeks
  });
});