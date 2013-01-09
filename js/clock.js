/**
 * --------------------------------------------------------------------
 * clock.js 
 * conversational time class and functions.
 * 
 * IMPORTANT:
 * window.onload at the end of this file
 * 
 @author Marcin Kononiuk, absolutnie@gmail.com
 @version 1.0

 */

/**
@function init
  Run by window.onload at the end of file.
  Checks is JS enabled (if no user will see only error message).
  Starts conversational clock ecryption for specified input.
*/

function init() {
    var clock = new ConversationalClock();
    // initiate clock for form specified by id
    clock.init('conversationalClock');

    // hide JS-disabled error message
    $('#error').hide();
    $('#container').show();
}

/**
@class ConversationalClock
  converts 24h time string to human readable conversational representation
*/

function ConversationalClock() {

    var curObj = this;

/**
  @function init  
  */
    this.init = function(sourceFormId) {
        $('#' + sourceFormId).submit(function(e) {
            e.preventDefault();

            var time = $("input:first").val();

            // validate and convert time
            if (curObj.validateTime(time)) {
                var convertedTime = curObj.convert(time);
                curObj.createResult('success', convertedTime);
            } else {
                curObj.createResult('error', 'Time format must be 00:00-23:59!');
            }
        });
    };

/**
   @function validateTime
   @param {string} time - checks is time in hh:mm format 
  */
    this.validateTime = function(time) {
        return (/^([01]\d|2[0-3]):([0-5]\d)$/).test(time);
    };

/**
   @function validateTime
   Create result message and append to view.
   
   @param {string} type - notice|error|info|success
   @param {string} message - message to append. 
    
  */
    this.createResult = function(type, message) {
        // get or create result paragraph element
        var container = $("#container");
        var resultP = $("#result");

        if (resultP.length === 0) {
            resultP = $("<p id=\"result\"></p>");
            container.append(resultP);
        }

        // remove previous class
        resultP.removeClass();
        // add class and message
        resultP.addClass(type);
        resultP.text(String(message));
    };

/**
  @function convert
  @param {string} timeStr - string with time in format hh:mm
  @return {string} converted time
   
  */
    this.convert = function(timeStr) {
        // strip to mins and hours
        var time = timeStr.split(":");
        var hoursInt = parseInt(time[0], 10);
        var minutesInt = parseInt(time[1], 10);

        // create timeConverter object
        var timeConverted = new TimeConverter(hoursInt, minutesInt);

        return timeConverted.toString();
    };
}

/*
 * Converts hours and minute to words
 */

function TimeConverter(hours, minutes) {
    var prefix = '',
        conj = '',
        minutesRound = minutes;

    var dictionaryMins = ['', 'five', 'ten', 'quarter', 'twenty', 'twenty five', 'half'];
    var dictionaryHrs = ['midnight',
                                  'one', 'two', 'three', 'four', 'five', 'six', 'seven',
                                  'eight', 'nine', 'ten', 'eleven', 'noon'];

    /*
     * Converts rounded minutes int to words
     */
    this.convertMinsRound = function() {
        var i = minutesRound / 5;

        if (i >= dictionaryMins.length) {
            i = 12 - i;
        }

        return dictionaryMins[i];
    };

    /*
     * Converts hours int to words
     */
    this.convertHours = function() {
        var i = hours;

        // get hour conversion
        if (i >= dictionaryHrs.length) {
            i = hours - 12;
        }

        // get next hour if it's later than half past
        if (minutes > 30) {
            i++;
            // exceptions - for minutes before noon and midnight
            if (i == 13) {
                i = 1;
            } else if (hours == 23) {
                i = 0;
            } else if (i >= dictionaryHrs.length) {
                i = hours - 12;
            }
        }
        return dictionaryHrs[i];
    };

    /*
     * Returns conjunction ' past ' or ' to '
     */
    this.conjunction = function() {
        if (minutes <= 30 && minutes > 2) {
            conj = ' past ';
        } else if (minutes >= 30 && minutes < 57) {
            conj = ' to ';
        }
        return conj;
    };

    /*
     * Returns time converted to words
     */
    this.toString = function() {
        // Return full value or
        // setup a prefix for values other than multiplication of 5
        if (minutes === 0) {
            return this.convertHours();
        } else if (minutes % 5 >= 3 || minutes >= 57) {
            prefix = 'nearly ';
            minutesRound = Math.ceil(minutes / 5) * 5;
        } else if (minutes % 5 > 0 && minutes % 5 < 3) {
            prefix = 'just after ';
            minutesRound = Math.floor(minutes / 5) * 5;
        }

        // return convertedvalue
        return prefix + this.convertMinsRound() + this.conjunction() + this.convertHours();
    };
}

// initiate when window is loaded
window.onload = init;