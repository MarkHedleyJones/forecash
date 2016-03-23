
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
    // describe('every second Wednesday including 23/3/2016', function () {
    //     it('should return true because 23/3/2016 was specified to be included', function () {
    //         assert.equal(true, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,23), "test"));
    //     });
    //     it('should return false because 30/3/2016 is ONE Wednesday after date to be included', function () {
    //         assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,30), "test"));
    //     });
    //     it('should return false because 16/3/2016 is ONE Wednesday before date to be included', function () {
    //         assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,16), "test"));
    //     });
    //     it('should return false because 22/3/2016 is a Tuesday', function () {
    //         assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,22), "test"));
    //     });
    //     it('should return false because 24/3/2016 is a Thursday', function () {
    //         assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,24), "test"));
    //     });
    // });
    // describe('Tuesday every two weeks', function () {
    //     it('should return true because 15/3/2016 is an even Tuesday', function () {
    //         assert.equal(true, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,15), "test"));
    //     });
    //     it('should return false because 22/3/2016 is an odd Tuesday', function () {
    //         assert.equal(false, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,22), "test"));
    //     });
    //     it('should return true because 29/3/2016 is an even Tuesday', function () {
    //         assert.equal(true, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,29), "test"));
    //     });
    //     it('should return false because 14/3/2016 is a Monday', function () {
    //         assert.equal(false, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,14), "test"));
    //     });
    //     it('should return false because 16/3/2016 is a Wednesday', function () {
    //         assert.equal(false, parse_dateCondition("Tuesday every two weeks", new Date(2016,2,16), "test"));
    //     });
    // });
    // describe('Tuesday every two weeks including 22/3/2016', function () {
    //     it('should return true because 8/3/2016 is a specified Tuesday', function () {
    //         assert.equal(true, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,8), "test"));
    //     });
    //     it('should return false because 15/3/2016 is the non-specified Tuesday', function () {
    //         assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,15), "test"));
    //     });
    //     it('should return true because 22/3/2016 was a specified Tuesday', function () {
    //         assert.equal(true, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,22), "test"));
    //     });
    //     it('should return false because 29/3/2016 was a non-specified Tuesday', function () {
    //         assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,29), "test"));
    //     });
    //     it('should return false because 21/3/2016 is a Monday', function () {
    //         assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,21), "test"));
    //     });
    //     it('should return false because 23/3/2016 is a Wednesday', function () {
    //         assert.equal(false, parse_dateCondition("Tuesday every two weeks including 22/3/2016", new Date(2016,2,23), "test"));
    //     });
    // });
    // describe('every 2 weeks', function () {
    //     it('should return true because 13/3/2016 is an even Sunday', function () {
    //         assert.equal(true, parse_dateCondition("every 2 weeks", new Date(2016,2,13), "test"));
    //     });
    //     it('should return false because 20/3/2016 is an odd Sunday', function () {
    //         assert.equal(false, parse_dateCondition("every 2 weeks", new Date(2016,2,20), "test"));
    //     });
    //     it('should return true because 27/3/2016 the next even Sunday', function () {
    //         assert.equal(true, parse_dateCondition("every 2 weeks", new Date(2016,2,27), "test"));
    //     });
    //     it('should return false because 6/3/2016 is an odd Sunday', function () {
    //         assert.equal(false, parse_dateCondition("every 2 weeks", new Date(2016,2,6), "test"));
    //     });
    //     it('should return false because 12/3/2016 is a Saturday', function () {
    //         assert.equal(false, parse_dateCondition("every 2 weeks", new Date(2016,2,12), "test"));
    //     });
    //     it('should return false because 14/3/2016 is a Monday', function () {
    //         assert.equal(false, parse_dateCondition("every 2 weeks", new Date(2016,2,14), "test"));
    //     });
    // });
    // describe('each fortnight including 6/3/2016', function () {
    //     it('should return true because 6/3/2016 is an even Sunday', function () {
    //         assert.equal(true, parse_dateCondition("each fortnight including 6/3/2016", new Date(2016,2,6), "test"));
    //     });
    //     it('should return false because 13/3/2016 is an odd Sunday', function () {
    //         assert.equal(false, parse_dateCondition("each fortnight including 6/3/2016", new Date(2016,2,13), "test"));
    //     });
    //     it('should return true because 20/3/2016 the next even Sunday', function () {
    //         assert.equal(true, parse_dateCondition("each fortnight including 6/3/2016", new Date(2016,2,20), "test"));
    //     });
    //     it('should return false because 27/3/2016 is an odd Sunday', function () {
    //         assert.equal(false, parse_dateCondition("each fortnight including 6/3/2016", new Date(2016,2,27), "test"));
    //     });
    //     it('should return false because 5/3/2016 is a Saturday', function () {
    //         assert.equal(false, parse_dateCondition("each fortnight including 6/3/2016", new Date(2016,2,5), "test"));
    //     });
    //     it('should return false because 7/3/2016 is a Monday', function () {
    //         assert.equal(false, parse_dateCondition("each fortnight including 6/3/2016", new Date(2016,2,7), "test"));
    //     });
    // });
    // describe('the first tuesday of the month', function () {
    //     it('should return true because 1/3/2016 is the first Tuesday', function () {
    //         assert.equal(true, parse_dateCondition("the first tuesday of the month", new Date(2016,2,1), "test"));
    //     });
    //     it('should return false because 8/3/2016 is the second Tuesday', function () {
    //         assert.equal(false, parse_dateCondition("the first tuesday of the month", new Date(2016,2,8), "test"));
    //     });
    //     it('should return false because 15/3/2016 is the third Tuesday', function () {
    //         assert.equal(false, parse_dateCondition("the first tuesday of the month", new Date(2016,2,15), "test"));
    //     });
    //     it('should return true because 5/4/2016 is the first Tuesday', function () {
    //         assert.equal(true, parse_dateCondition("the first tuesday of the month", new Date(2016,3,5), "test"));
    //     });
    //     it('should return false because 4/4/2016 is a Monday', function () {
    //         assert.equal(false, parse_dateCondition("the first tuesday of the month", new Date(2016,3,4), "test"));
    //     });
    //     it('should return false because 6/4/2016 is a Wednesday', function () {
    //         assert.equal(false, parse_dateCondition("the first tuesday of the month", new Date(2016,3,6), "test"));
    //     });
    //     it('should return true because 7/6/2016 is first Tuesday of June', function () {
    //         assert.equal(true, parse_dateCondition("the first tuesday of the month", new Date(2016,5,7), "test"));
    //     });
    // });

    // describe('every 28 days', function () {
    //     it('should return true because 25/3/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days', new Date(2016,2,25), "test"));
    //     });
    //     it('should return true because 22/4/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days', new Date(2016,3,22), "test"));
    //     });
    //     it('should return true because 20/5/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days', new Date(2016,4,20), "test"));
    //     });
    //     it('should return false because 22/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days', new Date(2016,2,22), "test"));
    //     });
    //     it('should return false because 25/4/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days', new Date(2016,3,25), "test"));
    //     });
    //     it('should return false because 27/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days', new Date(2016,2,27), "test"));
    //     });
    //     it('should return false because 24/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days', new Date(2016,2,24), "test"));
    //     });
    // });

    // describe('every 28 days starting 20/3/2016', function () {
    //     it('should return true because 20/3/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,2,20), "test"));
    //     });
    //     it('should return true because 17/4/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,3,17), "test"));
    //     });
    //     it('should return true because 15/5/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,4,15), "test"));
    //     });
    //     it('should return false because 17/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,2,17), "test"));
    //     });
    //     it('should return false because 20/4/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,3,20), "test"));
    //     });
    //     it('should return false because 22/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,2,22), "test"));
    //     });
    //     it('should return false because 19/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,2,19), "test"));
    //     });
    //     it('should return false because 21/2/2016 occurs before the 20th', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days starting 20/3/2016', new Date(2016,1,21), "test"));
    //     });
    // });

    // describe('every 28 days including 20/3/2016', function () {
    //     it('should return true because 20/3/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,2,20), "test"));
    //     });
    //     it('should return true because 17/4/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,3,17), "test"));
    //     });
    //     it('should return true because 15/5/2016 is in the default 28 day cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,4,15), "test"));
    //     });
    //     it('should return false because 17/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,2,17), "test"));
    //     });
    //     it('should return false because 20/4/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,3,20), "test"));
    //     });
    //     it('should return false because 22/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,2,22), "test"));
    //     });
    //     it('should return false because 19/3/2016 is not in the cycle', function () {
    //         assert.equal(false, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,2,19), "test"));
    //     });
    //     it('should return true because 21/2/2016 occurs before the 20th but is in that cycle', function () {
    //         assert.equal(true, parse_dateCondition('every 28 days including 20/3/2016', new Date(2016,1,21), "test"));
    //     });
    // });

    describe('every month including', function () {
        // it('should return true because 20/3/2016 is in the default 28 day cycle', function () {
        //     assert.equal(true, parse_dateCondition('every day starting 10/2/2016', new Date(2016,2,20), "test"));
        // });
        // it('should return true because 17/4/2016 is in the default 28 day cycle', function () {
        //     assert.equal(true, parse_dateCondition('every month', new Date(2016,3,17), "test"));
        // });
        it('should return true because 15/5/2016 is in the default 28 day cycle', function () {
            assert.equal(true, parse_dateCondition('every month', new Date(2016,4,15), "test"));
        });
        // it('should return false because 17/3/2016 is not in the cycle', function () {
        //     assert.equal(false, parse_dateCondition('every month', new Date(2016,2,17), "test"));
        // });
        // it('should return false because 20/4/2016 is not in the cycle', function () {
        //     assert.equal(false, parse_dateCondition('every month', new Date(2016,3,20), "test"));
        // });
        // it('should return false because 22/3/2016 is not in the cycle', function () {
        //     assert.equal(false, parse_dateCondition('every month', new Date(2016,2,22), "test"));
        // });
        // it('should return false because 19/3/2016 is not in the cycle', function () {
        //     assert.equal(false, parse_dateCondition('every month', new Date(2016,2,19), "test"));
        // });
        // it('should return true because 21/2/2016 occurs before the 20th but is in that cycle', function () {
        //     assert.equal(true, parse_dateCondition('every month', new Date(2016,1,21), "test"));
        // });
    });
    // Every 2 months
    // Every 2 months starting -date-
    // Every 2 months including -date- ? what does this mean?
  });
});