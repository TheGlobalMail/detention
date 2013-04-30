define([
  'lodash',
  './../data/incidents'
], function(_, incidents) {
  "use strict";

  // Remove this when we have the processed JSON
  incidents = (function() {

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
  })();

  function processDateStrings() {
    // Adds a `date` prop to each obj in incidents
    incidents =  _.map(incidents, function(obj) {

        // Takes the format MM/DD/YYYY
        var date = obj["Occurred On"];

        var split = date.split('/');
        var normal = [split[2], split[0], split[1]].join('/');
        var unix = (new Date(split[2], split[0], split[1])).getTime();
        var month = normal.split('/').slice(0,2).join('/');

        obj.date = {
          original: date,
          normal: normal,
          unix: unix,
          month: month
        };

        return obj;
      }
    );
  }

  function processIncidentsPerMonth() {
    processDateStrings();

    // Ordered list of months
    var months = [];
    var incidentsByMonth = {};

    _.each(incidents, function(incident) {
      var month = incident.date.month;
      if (!_.contains(months, month)) {
        months.push(month)
      }
      if (incidentsByMonth[month] === undefined) {
        incidentsByMonth[month] = [];
      }
      incidentsByMonth[month].push(incident);
    });

    months = _.sortBy(months, function(month) {
      var split = month.split('/');
      return +(new Date(split[0], split[1]));
    });

    return {
      months: months,
      incidentsByMonth: incidentsByMonth
    };
  }

  return processIncidentsPerMonth();
});