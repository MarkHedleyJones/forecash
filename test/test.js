
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
        it('should return false because 30/3/2016 is ONE Wednesday after day to be included', function () {
            assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,30), "test"));
        });
        it('should return false because 16/3/2016 is ONE Wednesday before day to be included', function () {
            assert.equal(false, parse_dateCondition("every second Wednesday including 23/3/2016", new Date(2016,2,16), "test"));
        });
    });
  });
});

// tests = [
//     // ["every wednesday"],
//     // ["every second wednesday"],
//     // ["every third wednesday"],
//     ["every second Wednesday including 23/3/2016"]
// ]

// var dateStart = newDate(2016,3,1);
// var dateEnd = newDate(2016,5,1);
// // console.log(dateStart);
// for (var d = dateStart; d <= dateEnd; d.setDate(d.getDate() + 1)) {
//     if (d.getDay() != 3) continue;

//     console.log(d.getDate(),'/',d.getMonth()+1,'/',d.getFullYear(),' -                         ', dayName(d.getDay()));
//     for (var testno = 0; testno < tests.length; testno++) {
//         console.log('"',tests[testno][0], '" = ', parse_dateCondition(tests[testno][0], d, "test"))
//         console.log("TEST END");
//         console.log("-");
//         // console.log(testno);
//     }
//     console.log("-");
//     console.log("-");
//     console.log("-");
// }
