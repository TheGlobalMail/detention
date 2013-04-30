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

  function toRowLayout() {
    // Convert

    var data = [];
    var incidentLength = incidents["Occurred On"].length;

    _.times(incidentLength, function(i) {
      var point = {};
      _.each(incidents, function(value, key) {
        point[key] = value[i];
      });
      data.push(point);
    });

    return data;
  }

  function processIncidentData() {
    processDateStrings();

    var occurredOn = incidents["Occurred On"];

    var dates = _(occurredOn)
      .unique('original')
      .sortBy('unix')
      .value();
    var dateCounts = _.countBy(occurredOn, 'original');

    // Ordered list of months
    var months = _.unique(dates, 'month');
    // Number of incidents per month
    var monthCounts = _.countBy(occurredOn, 'month');
    // Data for each incident, grouped by month
    var monthData = {};

    return {
      dates: dates,
      dateCounts: dateCounts,
      months: months,
      monthCounts: monthCounts
    };
  }

  return processIncidentData();
});