define([
  'lodash',
  './../data/incidents'
], function(_, incidents) {
  "use strict";

  function processDateStrings() {
    _.each(incidents.data, function(incident){
      incident.occurredOn = new Date(incident.occurred_on);
      incident.month = new Date(incident.month);
      incident.dateClass = incident.occurred_on;
    });
  }

  function processIncidentsPerMonth() {
    processDateStrings();
    return incidents;
  }

  return processIncidentsPerMonth();
});
