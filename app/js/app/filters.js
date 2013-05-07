define([
  'jquery',
  'lodash',
  './process-data'
], function($, _, incidents){

  var locations = {};
  var locationNames;

  _.each(incidents.data, function(incident){
    if (!incident.location) incident.location = 'unknown';
    if (!locations[incident.location]){
      locations[incident.location] = [];
    }
    locations[incident.location].push(incident.id);
  });
  console.error(locations);

  locationNames = _.keys(locations).sort();

  var $facilities = $('#facilities');
  _.each(locationNames, function(name){
    $facilities.append('<li>' + name + '</li>');
  });

});
