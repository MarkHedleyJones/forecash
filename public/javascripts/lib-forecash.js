Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function dateAsLocale (date) {
    return date.getUTCDate() + '/' + ( date.getUTCMonth() + 1 ) + '/' + date.getUTCFullYear();
}

function dateDiff (dateRef, dateCmp) {
    diff = dateCmp.valueOf() - dateRef.valueOf();
    return Math.floor(diff / 86400000);
}

var epoh = new Date(1970, 0, 4); // First JS day of the week (Sunday) 1970

// epoh.setTime(Math.floor(epoh.getTime() / ms_day));
// Monday is ISO first day of the, but Sunday is day 0 in Javascript so Sunday is used

var Monday = 1;
var Tuesday = 2;
var Wednesday = 3;
var Thursday = 4;
var Friday = 5;
var Saturday = 6;
var Sunday = 0;

var ms_day = 1000.0*60.0*60.0*24.0;
var ms_week = ms_day * 7;
var today = new Date();

epoh.setTime(Math.floor(epoh.getTime() / ms_day));
// console.log(Math.floor(epoh.getTime() / ms_day));

var stride_week = function(date, stride, offset) {
    date.setHours(0,0,0,0);
    // console.log(date, stride, offset);
    /*
    Takes a date and a stride (as in 2 for fortnight, 3 for three weeks)
    and returns whether this week falls within that date.
    An offset can shift the week within the window
    */

    if (offset instanceof Date) {
        od = offset;
        od.setHours(0,0,0,0);
        offset = (od.getTime() - epoh.getTime()) % (ms_week * stride);
    }
    else offset = 0;

    var full_width = (Math.ceil(date.getTime()/ms_week)*ms_week) - (Math.ceil(epoh.getTime()/ms_week) * ms_week) + offset;
    var stride = ms_week * stride;
    var displacement = full_width % stride;
    var displacement_days = Math.ceil(displacement / ms_day);

    // console.log('offset =',offset,'=',offset/ms_day,'days');
    // console.log(epoh);
    // console.log(date);
    // console.log('date.getTime() = ', date.getTime(), "=", (date.getTime()/ms_day), 'days since epoh');
    // console.log('epoh.getTime() = ', epoh.getTime(), "=", (epoh.getTime()/ms_day), 'days since epoh');
    // console.log('full_width =', full_width,'=',full_width/ms_day,'days');
    // console.log('stride =',stride,'=',stride/ms_day,'days');
    // console.log('displacement =',displacement,'=',displacement/ms_day,'days');
    // console.log('displacement_days =',displacement_days,'days');
    // console.log('safe_zone =', ms_week,'=',ms_week/ms_day,'days');

    if (stride <= 1) return true;
    else return displacement_days < 7;
}

function secondsBetween(date_ref, date_cmp) {
    var diff = (date_cmp.getTime() - date_ref.getTime()) / 1000;
    return diff;
}

function minutes_from_seconds(seconds) {
    return seconds / 60;
}

function hours_from_seconds(seconds) {
    return minutes_from_seconds(seconds) / 60;
}

function days_from_seconds(seconds) {
    return hours_from_seconds(seconds) / 24;
}

function weeks_from_seconds(seconds) {
    return days_from_seconds(seconds) / 7;
}

function seconds_from_minutes(minutes) {
    return minutes * 60;
}

function seconds_from_hours(hours) {
    return seconds_from_minutes(hours * 60);
}

function seconds_from_days(days) {
    return seconds_from_hours(days * 24);
}

function seconds_from_weeks(weeks) {
    return seconds_from_days(weeks * 7);
}

function whole(items) {
    return Math.floor(items);
}

function seconds_between(date_ref, date_cmp) {
    var timediff_sec = secondsBetween(date_ref, date_cmp);
    if (date_ref.getTimezoneOffset() != date_cmp.getTimezoneOffset()) {
        // Daylight savings time changed between these dates
        var change_sec = seconds_from_minutes(date_ref.getTimezoneOffset() - date_cmp.getTimezoneOffset());
        timediff_sec = timediff_sec - change_sec;
    }
    return timediff_sec;
}

function minutes_between(date_ref, date_cmp) {
    return minutes_from_seconds(seconds_between(date_ref, date_cmp));
}

function hours_between(date_ref, date_cmp) {
    return hours_from_seconds(seconds_between(date_ref, date_cmp));
}

function days_between(date_ref, date_cmp) {
    return days_from_seconds(seconds_between(date_ref, date_cmp));
}

function weeks_between(date_ref, date_cmp) {
    return weeks_from_seconds(seconds_between(date_ref, date_cmp));
}

function months_between(date_ref, date_cmp) {
    var months;
    if (date_ref.toDateString() == date_cmp.toDateString()) return 0;
    else if (date_ref.getTime() > date_cmp.getTime()) {
        var dateRef = date_cmp;
        var dateComp = date_ref;
        var invert = true;
    }
    else {
        var dateRef = date_ref;
        var dateComp = date_cmp;
        var invert = false;
    }
    months = (dateComp.getFullYear() - dateRef.getFullYear()) * 12;
    months -= dateRef.getMonth();
    months += dateComp.getMonth();
    if (dateRef.getDate() > dateComp.getDate()) months--;
    if (invert) months *= -1;
    return months;
}


var dollarRound = function(dollars) {
    return Math.round(dollars * 100.00) / 100
}

function newDate(year, month, day) {
    return new Date(year, month - 1, day);
}

function dateSuffix(date) {
    date = date % 20;
    if (date === 1) return 'st';
    else if (date === 2) return 'nd';
    else if (date === 3) return 'rd';
    else return 'th';
}

function monthName(month) {
    if (month == 0) return 'January';
    else if (month == 1) return 'February';
    else if (month == 2) return 'March';
    else if (month == 3) return 'April';
    else if (month == 4) return 'May';
    else if (month == 5) return 'June';
    else if (month == 6) return 'July';
    else if (month == 7) return 'August';
    else if (month == 8) return 'September';
    else if (month == 9) return 'October';
    else if (month == 10) return 'November';
    else if (month == 11) return 'December';
}

function dayName(day) {
    if (day === 0) return 'Sunday';
    else if (day === 1) return 'Monday';
    else if (day === 2) return 'Tuesday';
    else if (day === 3) return 'Wednesday';
    else if (day === 4) return 'Thursday';
    else if (day === 5) return 'Friday';
    else if (day === 6) return 'Saturday';
}

var monthnames = ["january", "febuary", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
var daysofweek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
var quantifier = ["noneth", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelth", "thirteenth", "fourteenth", "fifteenth", "eighteenth", "ninteenth", "twentyith", "twentyfirst", "twentysecond", "twentythird", "twentyfourth", "twentyfifth", "twentysixth", "twentyseventh", "twentyeighth", "twentyninth", "thirtyith", "thirtyfirst"];
var numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "ninteen", "twenty", "twentyone", "twentytwo", "twentythree", "twentyfour", "twentyfive", "twentysix", "twentyseven", "twentyeight", "twentynine", "thirty", "thirtyone"];
var digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
var dom_suffix = ["st", "nd", "rd", "th"];


function dateString(date) {
    return date.getDate() + '<sup>' + dateSuffix(date.getDate()) + '</sup> ' + monthName(date.getMonth()).substr(0,3) + '.';
}

function dateISO(date) {
    var out = date.getFullYear() + '-';
    var month = date.getMonth() + 1;
    if (month < 10) out = out + '0';
    out = out + month + '-';
    var day = date.getDate();
    if (day < 10) out = out + '0';
    out = out + day;
    return out;
}

function stringToDate(dateString) {
    var delimiter;
    var iso_order = false;
    dateStr = dateString.valueOf();

    if (dateString.indexOf('/') != -1) delimiter = '/';
    else delimiter = '-';

    // console.log(delimiter);

    var parts = dateStr.split(delimiter);

    if (parts.length == 3) {
        if (parseInt(parts[0]) > parseInt(parts[2])) iso_order = true;
        else iso_order = false;
    }
    if (parts.length == 2) {
        iso_order = true;
        parts.push(today.getFullYear());
    }

    var out_date;

    if (iso_order) out_date = newDate(parts[0], parts[1], parts[2]);
    else out_date = newDate(parts[2], parts[1], parts[0]);

    // console.log(dateString,'->',out_date,parts);
    // console.log(parseInt(parts[2]), parseInt(parts[1]), parseInt(parts[0]));
    return out_date;
}

function date_int(date) {
    return Math.floor(date.getTime() / ms_day);
}


function happensAfter(date, referenceDate) {
    return (date.valueOf() / ms_day) > (referenceDate.valueOf() / ms_day);
}

function happensBefore(date, referenceDate) {
    return (date.getTime() / ms_day) < (referenceDate.valueOf() / ms_day);
}

function parse_dayOfMonth(string) {
    suffix = string.slice(string.length-2, string.length);
    if (dom_suffix.indexOf(suffix) != -1) {
        out = parseInt(string.slice(0,string.length-2));
        if (out < 31) return out;
    }
    return -1;
}

function parse_subNatLang(keys, values) {
    if (arraysEqual(keys, ["dayofmonth"])) {
        // console.log("It must occur before " + values[1]);
        return function(date) { return date.getDate() == values[0]; };
    }
    else if (arraysEqual(keys, ["weekday"])) {
        return function (date) { return date.getDay() == daysofweek.indexOf(values[0]); };
    }
    else if (arraysEqual(keys, ["quantifier", "weekday"])) {
        return function(date) { return (date.getDay() == daysofweek.indexOf(values[1])) && stride_week(date, values[0])};
    }
    else if (arraysEqual(keys, ["weekday", "quantifier"])) {
        return function(date) { return (date.getDay() == daysofweek.indexOf(values[0])) && stride_week(date, values[1])};
    }
    else if (arraysEqual(keys, ["quantifier", "weekday", "date", "date"])) {
        // Every wednesday 16/3/2016
        // console.log('Matched format ["quantifier", "weekday", "date"]')
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[1]) &&
                    stride_week(date, values[0], values[2]) &&
                    date_int(date) >= date_int(values[2]) &&
                    date_int(date) <= date_int(values[3]))
            };
    }
    else if (arraysEqual(keys, ["quantifier", "weekday", "date"])) {
        // Every wednesday 16/3/2016
        // console.log('Matched format ["quantifier", "weekday", "date"]')
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[1]) &&
                    stride_week(date, values[0], values[2]) &&
                    date_int(date) >= date_int(values[2]))
            };
    }
    else if (arraysEqual(keys, ["quantifier", "weekday", "range", "date", "date"])) {
        // Every wednesday from 16/3/2016
        // console.log('Matched format ["quantifier", "weekday", "range", "date", "date"]')
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[1]) &&
                    stride_week(date, values[0], values[3]) &&
                    date_int(date) >= date_int(values[3]) &&
                    date_int(date) <= date_int(values[4]))
            };
    }
    else if (arraysEqual(keys, ["quantifier", "time_unit", "phase_adjust", "date"])) {
        if (values[1] == 'week') {
            return function(date) {
                return (date.getDay() == 0 &&
                        stride_week(date, values[0], values[3]))
                };
        }
        else if (values[1] == 'day') {
            return function(date) {
                return (Math.floor(date.getTime() / ms_day) % values[0]) - (Math.floor(values[3].getTime() / ms_day) % values[0]) == 0;
            }
        }
    }
    else if (arraysEqual(keys, ["quantifier", "weekday", "phase_adjust", "date"])) {
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[1]) &&
                    stride_week(date, values[0], values[3]))
            };
    }
    else if (arraysEqual(keys, ["quantifier", "weekday", "time_unit"]) && values[2] == 'month') {
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[1]) &&
                    date.getDate() > (values[0] - 1) * 7 &&
                    date.getDate() <= (values[0]) * 7)
            };
    }
    else if (arraysEqual(keys, ["weekday", "quantifier", "phase_adjust", "date"])) {
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[0]) &&
                    stride_week(date, values[1], values[3]))
            };
    }
    else if (arraysEqual(keys, ["weekday", "quantifier", "time_unit", "phase_adjust", "date"]) && values[2] == 'week') {
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[0]) && stride_week(date, values[1], values[4]))
        }
    }
    else if (arraysEqual(keys, ["weekday", "quantifier", "time_unit"]) && values[2] == 'week') {
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[0]) && stride_week(date, values[1]))
        }
    }
    else if (arraysEqual(keys, ["quantifier", "weekday", "range_start", "date", "range_end", "date"])) {
        // Every wednesday from 16/3/2016
        // console.log('Matched format ["quantifier", "weekday", "range_start", "date", "range_end", "date"]')
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[1]) &&
                    stride_week(date, values[0], values[3]) &&
                    date_int(date) >= date_int(values[3]) &&
                    date_int(date) <= date_int(values[5]))
            };
    }
    else if (arraysEqual(keys, ["quantifier", "weekday", "range_start", "date"])) {
        // Every wednesday from 16/3/2016
        // console.log('Matched format ["quantifier", "weekday", "range_start", "date"]')
        return function(date) {
            return (date.getDay() == daysofweek.indexOf(values[1]) &&
                    stride_week(date, values[0], values[3]) &&
                    date_int(date) >= date_int(values[3]))
            };
    }
    else if (arraysEqual(keys, ["range_start", "date"])) {
        // console.log("It must occur after " + values[1]);
        return function(date) { return happensAfter(date, values[1]); };
    }
    else if (arraysEqual(keys, ["range_end", "date"])) {
        // console.log("It must occur before " + values[1]);
        return function(date) { return happensBefore(date, values[1]); };
    }
    else if (arraysEqual(keys, ["quantifier", "time_unit", "range_start", "date"])) {
        if (values[1] == 'month') {
            // on the 1st of every third month from 2014-01-01
            // function (date) { return date.getMonth() % 6 == 3 && date.getDate() == 1; }
            return function(date) { return date.getMonth() % values[0] == values[3].getMonth() % values[0]};
        }
        else if (values[1] == 'week') {
            return function(date) { return whole(days_between(date, values[3])) % (7 * values[0])  == 0; };
        }
        else if (values[1] == 'day') {
            return function(date) {
                return ((Math.floor(date.getTime() / ms_day) % values[0]) - (Math.floor(values[3].getTime() / ms_day) % values[0]) == 0) &&
                        date.getTime() >= values[3].getTime();
            }
        }

    }
    else if (arraysEqual(keys, ["quantifier", "time_unit"]) && values[1] == "week") {
        // Every fortnight (no day specified)
        return function(date) {
            return (date.getDay() == 0 && stride_week(date, values[0]));
        }
    }
    else if (arraysEqual(keys, ["quantifier", "time_unit"]) && values[1] == "day") {
        return function(date) {
            return (Math.floor(date.getTime() / ms_day) % values[0]) == 0;
        }
    }
    else if (arraysEqual(keys, ["dayofmonth", "month"])) {
        return function(date) { return date.getMonth() == monthnames.indexOf(values[1]) && date.getDate() == values[0]; };
    }
    else if (arraysEqual(keys, ["date"])) {
        return function(date) { return date.getFullYear() == values[0].getFullYear() && (date.getMonth()) == values[0].getMonth() && date.getDate() == values[0].getDate();}
    }
    else {
        // console.log("Failed to match format", keys);
        return function(date) { return false};
    }
}

function parse_dateCondition(string, date, title) {
    // "every second Tuesday after 2015-2-16"
    // function (date) { return date.getDay() === Tuesday && fortnight_even(date) && (happensAfter(date, newDate(2015,2,16)) || happensBefore(date, newDate(2014,12,10))) }

    chunks = string.toLowerCase().split(' ');

    part_keys = []
    part_vals = []
    // console.log(chunks);
    for (var key = 0; key < chunks.length; key++) {
        part_val = '';
        part_key = '';
        part = chunks[key];
        if (daysofweek.indexOf(part) != -1) {
            part_key = 'weekday';
            part_val = part;
        }
        else if (digits.indexOf(part) != -1) {
            part_key = 'quantifier';
            part_val = digits.indexOf(part);
        }
        else if (part == 'fortnight') {
            part_keys.push('quantifier');
            part_vals.push(2);
            part_key = 'time_unit';
            part_val = 'week';
        }
        else if (part.slice(0,5) == 'month') {
            part_key = 'time_unit';
            part_val = 'month';
        }
        else if (part.slice(0,3) == 'day') {
            part_key = 'time_unit';
            part_val = 'day';
        }
        else if (part.slice(0,4) == 'week') {
            part_key = 'time_unit';
            part_val = 'week';
        }
        else if (monthnames.indexOf(part) != -1) {
            part_key = 'month';
            part_val = part;
        }
        else if (part.slice(0,4) == 'year') {
            part_key = 'time_unit';
            part_val = 'year';
        }
        else if (part == 'odd' || part == 'other') {
            part_key = 'quantifier';
            part_val = -2;
        }
        else if (part.length > 2 && parse_dayOfMonth(part) != -1) {
            part_key = 'dayofmonth';
            part_val = parse_dayOfMonth(part);
        }
        else if (quantifier.indexOf(part) != -1) {
            part_key = 'quantifier';
            part_val = quantifier.indexOf(part);
        }
        else if (numbers.indexOf(part) != -1) {
            part_key = 'quantifier';
            part_val = numbers.indexOf(part);
        }
        else if (part == 'after') {
            part_key = 'range_start';
            part_val = '>';
        }
        else if (part == 'from') {
            part_key = 'range_start';
            part_val = '>';
        }
        else if (part == 'starting') {
            part_key = 'range_start';
            part_val = '>';
        }
        else if (part == 'to') {
            part_key = 'range_end';
            part_val = '<';
        }
        else if (part == 'before') {
            part_key = 'range_end';
            part_val = '<';
        }
        else if (part == 'between') {
            part_key = 'range';
            part_val = '--';
        }
        else if (part == 'including') {
            part_key = 'phase_adjust';
            part_val = '>-<';
        }
        else if (part.indexOf('-') != -1) {
            part_key = 'date';
            part_val = stringToDate(part);
        }
        else if (part.indexOf('/') != -1) {
            part_key = 'date';
            part_val = stringToDate(part);
        }

        // If part parsed, add it to the list
        if (part_key != '') {
            part_keys.push(part_key);
            part_vals.push(part_val);
        }

    }
    // console.log(part_keys);
    // console.log(part_vals);

    logic = []
    // console.log(part_keys + ", " + part_vals);
    log = "";
    var finished = false;
    var loop_count = 0;
    if (part_keys.length > 0) {

        for (var start = 0; start < part_keys.length; start++) {
            last_segment = false;

            for (var end = part_keys.length; end > start; end--) {

                segment = parse_subNatLang(part_keys.slice(start,end), part_vals.slice(start, end));
                if (segment != false) {
                    logic.push(segment);
                    start = end+1;
                }
                if (loop_count > 20) break;
            }
            if (finished) {
                log = log + " || Finished";
                break;
            }
        }
    }
    else {
        return false;
    }
    // console.log(log);
    // console.log(logic);

    var ans = true;
    for (var key = 0; key < logic.length; key++) {
        if (logic[key](date) == false) ans = false;
    }

    return ans;
}