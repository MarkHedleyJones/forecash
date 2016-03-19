var layout_wide = false;
var app = angular.module("forecash", ['nvd3ChartDirectives']);
var dStart = null;
var dEnd = null;
var redraw_trigger = null;
var events = null;
var datapoints = null;
var transaction_container = null;
var today = new Date();
var account = document.URL.split('/')[3];
if (account == '') {
    var home_url = "/events";
}
else {
    var home_url = "/" + account + "/events";
}
var dialog;


var tableObj = $( "#forecast" );
var tableHeadObj = $( "#forecastHead" );
var plotObj = $( "#chart" );

nv.tooltip.calcTooltipPosition = function(pos, gravity, dist, container) {

    var height = parseInt(container.offsetHeight),
        width = parseInt(container.offsetWidth),
        windowWidth = nv.utils.windowSize().width,
        windowHeight = nv.utils.windowSize().height,
        scrollTop = window.pageYOffset,
        scrollLeft = window.pageXOffset,
        left, top;

    windowHeight = window.innerWidth >= document.body.scrollWidth ? windowHeight : windowHeight - 16;
    windowWidth = window.innerHeight >= document.body.scrollHeight ? windowWidth : windowWidth - 16;

    gravity = gravity || 's';
    dist = dist || 20;

    var tooltipTop = function ( Elem ) {
        return nv.tooltip.findTotalOffsetTop(Elem, top);
    };

    var tooltipLeft = function ( Elem ) {
        return nv.tooltip.findTotalOffsetLeft(Elem,left);
    };

    switch (gravity) {
      case 'e':
        left = pos[0] - width - dist;
        top = pos[1] - (height / 2);
        break;

      case 'w':
        left = pos[0] + dist;
        top = pos[1] - (height / 2);
        break;

      case 'n':
        left = pos[0] - (width / 2) - 5;
        top = pos[1] + dist;
        break;
      case 's':
        left = pos[0] - (width / 2);
        top = pos[1] - height - dist;
        break;

      case 'none':
        left = pos[0];
        top = pos[1] - dist;
        break;
    }

    container.style.left = left+'px';
    container.style.top = top+'px';
    container.style.opacity = 1;
    container.style.position = 'absolute';

    return container;
};


function adjustLayout() {

    layout_wide = false;

    $("#fixed").css({
        'bottom': '0',
        'left': '0',
        'right': '0',
        'padding': '0',
        'height': '360px'
    });

    $("#main").css({
        'float': 'none',
        'width': 'auto',
        'margin-top': '410px'
    });
    tableHeadObj.css('width', tableObj.width());
    for (var i = 0; i < 5; i++) {
        $( "#thf" + i ).css('width', $( "#th" + i).width());
    }

    setTimeout(function() {
        $('#nv-point-highlighted').attr('r',5);
        $('#nv-point-today').attr('r',5);
    }, 50);
}

function Forecast(dateStart, dateEnd, events, openingBalance) {

    var daysToForecast = dateDiff(dateStart, dateEnd);
    var forecast = [];

    // console.log(events)

    for (var d = new Date(dateStart); d <= dateEnd; d.setDate(d.getDate() + 1)) {

        date = new Date(d);

        for (var key = 0; key < events.transactions.length; key++) {
            financeEvent = events.transactions[key];
            if (parse_dateCondition(financeEvent['occurs'],date, financeEvent['name'])) {
                forecast.push({
                    'name':     financeEvent['name'],
                    'amount':   financeEvent['amount'],
                    'date':     new Date(date)
                })
            }
        }
    }

    // Create day-by-day balance and event list
    var out = [];
    currentBalance = openingBalance;

    for (var d = new Date(dateStart); d <= dateEnd; d.setDate(d.getDate() + 1)) {

        var date = new Date(d);

        var eventList = [];
        for (var key  = 0; key < forecast.length; key++) {
            if (forecast[key]['date'].toDateString() === date.toDateString()) {
                currentBalance += forecast[key]['amount'];
                eventList.push({
                    'name': forecast[key]['name'],
                    'amount': forecast[key]['amount']
                });
            }
        }
        out.push({'date': date, 'balance': Math.round(100 * currentBalance) / 100.00, 'events': eventList});
    }

    if (events.relative.length) {

        currentBalance = openingBalance;
        var balance_minimumAllowed = -1600.00;

        for (offset = 0; offset < forecast.length; offset++) {
            currentBalance += forecast[offset].amount;
        }
        var balance_final = currentBalance;

        for (var index = 0; index < events.relative.length; index++) {

            // Determine if it's possible to add this event without breaking
            // the minimum balance condition at the final day

            if (balance_final + events.relative[index].amount >= balance_minimumAllowed) {

                for (var test = 0; test < out.length; test++) {
                    var okay = true;
                    for (var tmp = test; tmp < daysToForecast; tmp++) {
                        if (out[tmp].balance + events.relative[index].amount < balance_minimumAllowed) {
                            okay = false;
                            break;
                        }
                    }
                    if (okay === true) break;
                }
                if (okay) {
                    var amount = events.relative[index].amount;

                    balance_final += amount;

                    for (var offset = 0; offset < out.length; offset++) {

                        if (offset === test) {
                            out[test].events.push({
                                'name': events.relative[parseInt(index)].name,
                                'amount': amount
                            })
                            out[test].balance += amount;
                        }
                        else if (offset > test) {
                            out[offset].balance += amount;
                        }
                    }
                }
            }
        }
    }

    var preDate = dateStart;
    preDate.setUTCDate(preDate.getUTCDate() - 1);
    out.splice(0,0,{
        'date': preDate,
        'balance': openingBalance,
        'events': [
            {
                'name': 'Opening balance',
                'amount': openingBalance
            }
        ]
    });

    return out;
}


function ForecastTable(forecast) {

    var element = "";

    $( "#forecast" ).html('<thead style="height:44px">' +
            '<tr style="height: 40px">' +
                '<th id="th0">Date</th>' +
                '<th id="th1">Balance</th>' +
                '<th id="th2">Credit</th>' +
                '<th id="th3">Debt</th>' +
                '<th id="th4">Description</th>' +
            '</tr>' +
        '</thead>');

    var appendRow = function(row) {
        return "<tr>" +
            "<td>" + row['date'] + "</td>" +
            "<td>" + row['balance'] + "</td>" +
            "<td>" + row['credit'] + "</td>" +
            "<td>" + row['debit'] + "</td>" +
            "<td>" + row['description'] + "</td>" +
            "</tr>";
    }

    var appendDay = function(rows, groupid, hide, customClass) {
        var header = '<tbody id="' + groupid + '"';
        if (customClass != false) header = header + ' class="' + customClass + '"';
        header = header + ' onclick="javascript:tableClick(this);"';
        header = header + '>';
        $( "#forecast" ).append(header + rows);
    }

    for (var day = 0; day <forecast.length; day++) {
        group = "";
        hide = false;

        row = {
            'date': dateString(forecast[day]['date']),
            'balance': forecast[day]['balance'].formatMoney(),
            'credit': '',
            'debit': '',
            'description': ''
        }


        var rowClass = false;
        if (dateISO(forecast[day]['date']) == dateISO(new Date())) rowClass = 'today';


        if (forecast[day].events.length > 0) {

            for (var index = 0; index <forecast[day].events.length; index++) {
                trans = forecast[day]['events'][index];
                if (trans['amount'] > 0) row['credit'] = trans['amount'].formatMoney();
                else row['debit'] = (-1.0 * trans['amount']).formatMoney();
                row['description'] = trans['name'];
                group = group + appendRow(row);
                row.date = '';
                row.balance = '';
                row.credit = '';
                row.debit = '';
                row.description = '';
            }
        }
        else {
            row.description = 'No transactions';
            group = appendRow(row);
            hide = true;
        }
        appendDay(group, "table-pt-" + day, hide, rowClass);
    }
}

function tableClick(a) {
    highlightByIndex(a.id.substr(9));
}

function dateToIndex(isoDate) {
    for (key in window.forcast) {
        if (dateISO(window.forecast[key]['date']) == isoDate) break;
    }
    return key;
}

function highlightByIndex(pointIndex) {
    if (layout_wide) extraOffset = 110;
    else extraOffset = 468;
    highlightToday();
    var tableTarget = "#table-pt-" + pointIndex;
    var plotTarget = ".nv-point-" + pointIndex;

    var prevPoint = $('#nv-point-highlighted');
    if (prevPoint.length) {
        prevPoint.attr('class',prevPoint.attr('prevclass'));
        prevPoint.attr('id',false);
        prevPoint.attr('prevclass',false);
    }


    $(plotTarget).attr('prevclass', 'nv-point nv-point-' + pointIndex);
    $(plotTarget).attr('id', 'nv-point-highlighted');
    $(plotTarget).attr('class', 'nv-point nv-point-' + pointIndex + ' highlighted');
    $(plotTarget).attr('r',6);
    $('html, body').animate({
        scrollTop: $(tableTarget).offset().top - extraOffset
    },500);
    $('.highlighted').removeClass('highlighted');
    $(tableTarget).addClass('highlighted');
}

function ForecastControl($scope) {

    window.$scope = $scope;

    $.ajax({
        dataType: "json",
        url: home_url,
        success: createPage,
        async: false,
        error: function() {alert("Unable to fetch transactions")}
    });

    var forecast = [];

    $scope.options = {
       scaleGridLineColor : "rgb(0,0,0)"
    }

    $scope.fetchData = function() {
        return window.datapoints;
    }

    $scope.forecastData = $scope.fetchData();


    $scope.xAxisTickFormatFunction = function(){
        return function(d){
            date = new Date(d);
            return d3.time.format('%e' + dateSuffix(date) + ' %b')(date); //uncomment for date format
        }
    }

    $scope.yAxisTickFormatFunction = function(){
        return function(d){
            return '$' + d.formatMoney();
        }
    }


    $scope.toolTipContentFunction = function(){
        return function(key, x, y, e, graph) {
            return '<span>' + key + '</span>' +
                '<p>' +  y + ' on ' + x + '</p>'
        }
    }

    $scope.$on('elementClick.directive', function(angularEvent, event){
        highlightByIndex(event.pointIndex);
    });

    redraw_trigger.change(function() {
        $scope.$apply(function() {
            updateForecast();
            $scope.forecastData = window.datapoints;
        })
    });

    // Needs to be enabled at appropriate time!!!! When the page is rendered etc.
    dStart.change(function() {
        $scope.$apply(function() {
            updateForecast();
            $scope.forecastData = window.datapoints;
        })
    });

    dEnd.change(function() {
        $scope.$apply(function() {
            updateForecast();
            //$scope.forecastData = window.datapoints;
            trigger_redraw();
        })
    });

}

function trigger_redraw() {
    $("#redraw_trigger").trigger('change');
}

function highlightToday() {
    $(".nv-point-" + window.todayIndex).attr('id', 'nv-point-today');
    setTimeout(function() {
        $('#nv-point-today').attr('r',5);
    },1);
}

function createPage(data) {

    // if (typeof events === 'undefined') events = window.events;
    // else window.events = events;

    events = data;

    // if (typeof events["relative"] == 'undefined') {
    //     events['relative'] = {};
    // }
    // for (var i = 0; i < events['transactions'].length; i++) {
    //     events['transactions'][i]['amount'] = parseFloat(events['transactions'][i]['amount']);
    // }
    // for (var i = 0; i < window.events['balances'].length; i++) {
    //     events['balances'][i]['balance'] = parseFloat(events['balances'][i]['balance']);
    // }

    openingBalance = 0;

    // var date_forecastStart = newDate(2014,8,01);
    // var date_forecastEnd = newDate(2015,6,01);

    var date_forecastStart = newDate(2016,3,01);
    var date_forecastEnd = newDate(2016,10,01);

    if (events['balances'] != undefined) {
        date_forecastStart = new Date(1970, 0, 1);
        for (key in events['balances']) {
            if (stringToDate(events['balances'][key]['date']).getTime() > date_forecastStart.getTime()) {
                date_forecastStart = stringToDate(events['balances'][key]['date']);
                openingBalance = events.balances[key].balance;
            }
        }
    }

    dStart = $( "#date_forecastStart");
    dEnd = $( "#date_forecastEnd");
    redraw_trigger = $( "#redraw_trigger" );
    dStart.datepicker();
    dEnd.datepicker();
    dStart.datepicker( "option", "dateFormat", "yy-mm-dd" );
    dEnd.datepicker( "option", "dateFormat", "yy-mm-dd" );
    dStart.val(dateISO(date_forecastStart));
    dEnd.val(dateISO(date_forecastEnd));


    var today = new Date();
    forecast = new Forecast(date_forecastStart, date_forecastEnd, events, openingBalance);
    table = ForecastTable(forecast);
    window.forecast = forecast;

    todayIndex = 0;

    for (todayIndex in forecast) {
        if (dateISO(forecast[todayIndex]['date']) == dateISO(today)) break;
    }

    datapoints = [{
        "key": "Main Account",
        "values": []
    }];

    for (day in forecast) {
        datapoints[0]['values'].push([forecast[day]['date'].getTime(),forecast[day]['balance']]);
    }

    nv.dispatch.render_end = function() {
        highlightToday();
    }

    adjustLayout();
}

function updateForecast() {

    dateStart = new Date(dStart.val());
    dateEnd = new Date(dEnd.val());

    forecast = new Forecast(dateStart, dateEnd, events, openingBalance);
    table = ForecastTable(forecast);

    // This may not be unnecessary
    window.forecast = forecast;

    var datapoints = [{
        "key": "Main Account",
        "values": []
    }];

    for (day in forecast) {
        datapoints[0]['values'].push([forecast[day]['date'].getTime(),forecast[day]['balance']]);
    }
    window.datapoints = datapoints;
}


$(window).resize(function() {
    adjustLayout();

});


function view_manageTransactions() {
    $( "#main" ).html('<ul id="transactions_management"><li><a href="#main-1">Transactions (' + events['transactions'].length + ')</a></li><li><a href="#main-2">Relative (' + events['relative'].length + ')</a></li><li><a href="#main-3">Balances (' + events['balances'].length + ')</a></li></ul><div id="main-1" class="view_category"></div><div id="main-2" class="view_category"></div><div id="main-3" class="view_category"></div><div id="main-4" class="view_category"></div>');
    $( "#main").tabs();
    $( "#button_view" ).attr('onclick', 'view_forecastTable()');
    $( "#button_view" ).html('<span>FORECAST VIEW</span>');
    $( "#main-1" ).html('<div id="hidden_popup_transactions" style="display: none"></div><form><div class="view_panel"><div style="-moz-user-select: none;" class="button btn_red" onclick="manageTransaction(-1)"><span><b>+</b> ADD NEW</span></div></div><div class="view_tableContainer"><table id="table_reoccurring" class="mc col1r col2l col2p20r col3r col3p20 col4l col4p20 trans_view"></table></div></form>');
    $( "#main-2" ).html('<form><div class="view_panel"></div><div class="view_tableContainer"><table id="table_relative" class="mc col1r col2l col2p20r col3r col3p20 col4l col4p20 trans_view"></table></div></form>');
    $( "#main-3" ).html('<form><div class="view_panel"></div><div class="view_tableContainer"><table id="table_balances" class="mc col1r col2l col2p20r col3p20 col3r trans_view"></table></div></form>');
    var e = null;
    var displayClass = '';
    for (var i=0; i< events['transactions'].length; i++) {
        e = events['transactions'][i];
        positive = events['amount'] >= 0;
        if (positive) displayClass = 'green';
        else displayClass = 'red';
        $( "#table_reoccurring" ).append('<tbody><tr><td><input type="checkbox"></td><td onclick="manageTransaction('+i+');">' + e['name'] + '</td><td onclick="manageTransaction('+i+');">$' + e['amount'].formatMoney() + '</td><td onclick="manageTransaction('+i+');">' + e['occurs'] + '</td></tr></tbody>');
    }
    for (var i=0; i< events['relative'].length; i++) {
        e = events['relative'][i];
        $( "#table_relative" ).append('<tbody><tr><td><input type="checkbox"></td><td onclick="edit_event_relative('+i+')">' + e['name'] + '</td><td onclick="edit_event_relative('+i+')">$' + e['amount'].formatMoney() +'</td></tr></tbody>');
    }
    for (var i=0; i< events['balances'].length; i++) {
        e = events['balances'][i];
        $( "#table_balances" ).append('<tbody><tr><td><input type="checkbox"></td><td onclick="edit_event_balance('+i+')">' + e['date'] + '</td><td onclick="edit_event_balance('+i+')">$' + e['balance'].formatMoney() + '</td></tr></tbody>');
    }

    var d = "";
    d += '<div class="hidden" title="Add new transaction" id="form_reocurring" class="dialogForm">';
    d += '  <form onsubmit="saveTransaction(); return false;">';
    d += '    <fieldset>';
    d += '      <div>';
    d += '        <div class="form_container" style="width: 445px">';
    d += '          <label for="name">Name:</label><input type="text" name="name" id="name" value="" class="text ui-widget-content ui-corner-all">';
    d += '        </div>';
    d += '        <div class="form_container" style="width: 240px">';
    d += '          <label for="amount">Amount:</label><input id="amount" name="amount" value="10.00" class="text ui-widget-content ui-corner-all">';
    d += '        </div>';
    d += '        <div class="form_container" style="width: 200px">';
    d += '          <span class="spent green" onclick="spentSlider_setSpent(false);">Earnt</span><input type="checkbox" class="js-switch" name="spent" id="spent" checked><span class="spent red" onclick="spentSlider_setSpent(true);">Spent</span>';
    d += '        </div>';
    d += '      </div>';
    d += '      <div id="calendarView"></div>';
    d += '      <div class="form_container" style="width: 920px">';
    d += '        <label for="occurrence_pattern" style="display: inline-block">Occurring:</label><input name="occurrence_pattern" id="occurrence_pattern" type="text" value="Every Wednesday" class="text ui-widget-content ui-corner-all" style="width: 725px">';
    d += '        <div style="-moz-user-select: none; padding-bottom: 3px; vertical-align: top; margin-top: 2px" class="button btn_green" onclick="parse_occurrence_pattern()"><span>CHECK</span></div>';
    d += '      </div>';
    d += '    </fieldset>';
    d += '    <input type="hidden" name="transaction_index" id="transaction_index" value="-1">';
    d += '    <input type="submit" style="display: none"/>';
    d += '  </form>';
    d += '</div>';
    $( "#hidden_popup_transactions").html(d);
    $( "#calendarView").html('<div onclick="render_calendars(-1)" class="calendar_control"><span style="background-position: 0 0"></span></div><div id="calendar_1" class="view_calendar"></div><div id="calendar_2" class="view_calendar"></div><div id="calendar_3" class="view_calendar"></div><div onclick="render_calendars(1)" class="calendar_control"><span style="background-position: -26px 0"></span></div>');
    window.spentSliderContainer = document.querySelector('.js-switch');
    window.spentSlider = new Switchery(window.spentSliderContainer, {secondaryColor: '#64BD63', color: '#DB5552'});
}

function render_calendars(month_offset) {
    window.calendar_offset += month_offset;
    tmp_date = new Date(today.getTime());
    tmp_date.setMonth(tmp_date.getMonth() + window.calendar_offset);
    $("#calendar_1").html('');
    $("#calendar_2").html('');
    $("#calendar_3").html('');
    render_calendar("calendar_1", tmp_date.getFullYear(), tmp_date.getMonth());
    tmp_date.setMonth(tmp_date.getMonth() + 1);
    render_calendar("calendar_2", tmp_date.getFullYear(), tmp_date.getMonth());
    tmp_date.setMonth(tmp_date.getMonth() + 1);
    render_calendar("calendar_3", tmp_date.getFullYear(), tmp_date.getMonth());
    parse_occurrence_pattern();
}

function parse_occurrence_pattern() {
    value = document.getElementById("occurrence_pattern").value;

    tmp_date = new Date();
    tmp_date.setDate(tmp_date.getDay() - (tmp_date.getDay() - 1)); // Set to 0
    tmp_date.setMonth(tmp_date.getMonth() + window.calendar_offset);
    tmp_date.setHours(0,0,0,0);

    $(".occurrenceMatch").removeClass('occurrenceMatch');

    // Populate a dates array because things get mucked up recycling the same date object
    var dates = []
    for (var i = 0; i < 93; i++) {
        dates.push(new Date(tmp_date));
        tmp_date.setDate(tmp_date.getDate() + 1);
    }

    console.log(dates[0], dates[-1]);

    for (var i = 0; i < 93; i++) {
        out = parse_dateCondition(value, dates[i], "blah");
        if (out) {
            $("#cal_"+dateISO(dates[i])).addClass('occurrenceMatch');
        }
    }
}

function render_calendar(container,year,month) {
    date_start = new Date(year,month,1);
    date_end = new Date(year,month,1);
    tab_data = "";
    tab_data += "<div>"+monthName(date_start.getMonth())+" <span>("+date_start.getFullYear()+")<span></div>";
    tab_data += "<table><tr><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th><th>S</th></tr>";
    date_start.setDate(date_start.getDate() - (date_start.getDay() - 1));
    date = new Date(dateISO(date_start));
    for (var i = 0; i < 6; i++) {
        tab_data += "<tr>";
        for (var j = 0; j < 7; j++) {
            if (date.getMonth() != month) tag = "<td class=\"out_of_month\">";
            else tag = "<td id=\"cal_" + dateISO(date) + "\">";
            tab_data += tag + date.getDate() + "</td>";
            date.setDate(date.getDate() + 1);
        }
        tab_data += "</tr>";
    }
    tab_data += "</table>";
    $( "#" + container).append(tab_data);
}

function view_forecastTable() {
    $( "#main" ).tabs( "destroy" );
    $( "#main" ).html('<table id="forecastHead" class="mc col1dr col1p20 col2r col2p20 col3r col3p20 col4r col4p20 col5dl col5hc"><thead><tr style="height: 40px"><th id="thf0">Date</th><th id="thf1">Balance</th><th id="thf2">Credit</th><th id="thf3">Debt</th><th id="thf4">Description</th></tr></thead></table><table id="forecast" class="mc col1dr col1p20 col2r col2p20 col3r col3p20 col4r col4p20 col5dl col5hc"></table>');
    $( "#button_view" ).attr('onclick', 'view_manageTransactions()');
    $( "#button_view" ).html('<span>TRANSACTION VIEW</span>');
    createPage(events);
}

function spentSlider_setSpent(spent) {
    if (window.spentSliderContainer.checked && !spent) {
        // This just toggles the sliders value, it doesn't set its value directly.
        window.spentSlider.setPosition(true);
        $("#amount").addClass("green");
        $("#amount").removeClass("red");

    }
    else if (spent && !window.spentSliderContainer.checked) {
        $("#amount").addClass("red");
        $("#amount").removeClass("green");
        window.spentSlider.setPosition(true);
    }

}

function manageTransaction(index) {
    window.calendar_offset = 0;
    // var dialog;
    var name = $( "#name" ),
    amount = $( "#amount" ),
    pattern = $( "#occurrence_pattern" ),
    transaction_index = $( "#transaction_index" ),
    allFields = $([]).add(name).add(amount).add(pattern),
    tips = $( "#validateTips" );

    if (index != -1) {
        name.val(events['transactions'][index]['name']);
        amount.val(events['transactions'][index]['amount'].formatMoney());
        pattern.val(events['transactions'][index]['occurs']);
        transaction_index.val(index);
        parse_occurrence_pattern();
        spent = events['transactions'][index]['amount'] >= 0
        window.spentSlider.setPosition(spent);
    }
    else transaction_index.val(-1);
    render_calendars(0);

    if (parseInt($("#amount").val().replace(',','')) < 0) {
        $("#amount").addClass("red");
    }
    else {
        $("#amount").addClass("green");
    }

    window.dialog_handle = $( "#form_reocurring" ).dialog({
        autoOpen: false,
        height: 450,
        width: 980,
        modal: true,
        buttons: {
            "Save": saveTransaction,
            Cancel: function() {
                window.dialog_handle.dialog( "close" );
            }
        },
        close: function() {
            allFields.removeClass( "ui-state-error" );
        }
    });
    window.dialog_handle.dialog( "open" );
}

function saveTransaction() {
    // var name = $( "#name" ).val();
    // alert(name);
    // var amount = parseFloat($( "#amount" ).val().replace(',',''));
    // var spent = window.spentSliderContainer.checked;
    // var pattern = $( "#occurrence_pattern" ).val();
    // var index = $( "#transaction_index" ).val();
    // window.dialog_handle.dialog( "close" );

    // console.log(name, amount, spent, pattern, index);

    var name = $( "#name" ).val();
    var amount = parseFloat($( "#amount" ).val().replace(',',''));
    var spent = window.spentSliderContainer.checked;
    var pattern = $( "#occurrence_pattern" ).val();
    var index = $( "#transaction_index" ).val();
    window.dialog_handle.dialog( "close" );
    $(".ui-dialog").remove();

    if ((spent && amount > 0) || (!spent && amount < 0)) amount = -amount;
    transaction = {
        "name": name,
        "amount": amount,
        "occurs": pattern
    }
    console.log(transaction);
    if (index < 0) {
        console.log("Creating new transaction");
        events['transactions'].push(transaction);
    }
    else {
        console.log("Overwriting trans", index, " with", transaction);
        events['transactions'][index] = transaction;
    }

    events['transactions'] = events['transactions'].sort(function(a,b) {
        return a.name > b.name;
    })
    console.log(events['transactions']);
    $.ajax({
        type: "PUT",
        url: home_url,
        data: JSON.stringify(events),
        contentType: 'application/json; charset=utf-8',
        success: saveTransaction_complete,
        complete: function(data) {
            $( "#main" ).tabs( "destroy" );
            $( "#main" ).html();
            trigger_redraw();
            view_manageTransactions();
        },
        dataType: 'json'
    })
}

function saveTransaction_complete(data) {
    if (account == '') {
        window.location = "/" + data;
    }
    else {
        // console.log(events);

        // events["balances"] = []
        // events["transactions"] = []
        // events["relative"] = []

        // count = data["balances"].length
        // for (var i=0; i < count; i++) {
        //     events["balances"].push(data["balances"][i])
        // }

        // count = data["transactions"].length
        // for (var i=0; i < count; i++) {
        //     events["transactions"].push(data["transactions"][i])
        // }

        // count = data["relative"].length
        // for (var i=0; i < count; i++) {
        //     events["relative"].push(data["relative"][i])
        // }

        // console.log(events);
        // window.events = data;
        // dialog.dialog( "close" );
        // $( "#main" ).html();
        // $( "#main" ).tabs( "destroy" );
        // trigger_redraw();
        // view_manageTransactions();
    }
}