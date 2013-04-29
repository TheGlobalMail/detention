define([
  'lodash',
  './../data/incidents'
], function(_, incidents) {
  "use strict";

  function processDateStrings() {
    incidents["Occurred On"] = _.map(
      incidents["Occurred On"],
      function(date) {
        // `date` takes the format MM/DD/YYYY

        var split = date.split('/');
        var normal = [split[2], split[0], split[1]].join('/');
        var unix = (new Date(split[2], split[0], split[1])).getTime();
        var dateClass = normal.replace(/\//g, '-'); // Replace slashes with dashes
        var month = normal.split('/').slice(0,2).join('/');

        return {
          original: date,
          normal: normal,
          unix: unix,
          dateClass: dateClass,
          month: month
        }
      }
    )
  }

  function processIncidentData() {
    processDateStrings();

    var occurredOn = incidents["Occurred On"];

    var dates = _(occurredOn)
      .unique('original')
      .sortBy('unix')
      .value();
    var dateCounts = _.countBy(occurredOn, 'original');

    var months = _.unique(dates, 'month');
    var monthCounts = _.countBy(occurredOn, 'month');

    return {
      dates: dates,
      dateCounts: dateCounts,
      months: months,
      monthCounts: monthCounts
    };
  }

  return processIncidentData();
});