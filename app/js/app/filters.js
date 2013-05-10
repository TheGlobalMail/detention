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

  locationNames = _.keys(locations).sort();

  var $facilities = $('#facilities');
  $facilities.append('<li><a data-facility="all" href="#all">All Facilities</a></li>');
  _.each(locationNames, function(name){
    $facilities.append('<li><a data-facility="' + name + '" href="#' + name + '">' + name + '</a></li>');
  });

  $facilities.find('a').click(function(e){
    e.preventDefault();
    Filter.byFacility($(this).data('facility'));
    $facilities.parent().find('a[data-toggle]').text($(this).text());
  });

  var Filter = {

    // Keep track of the current filtered facility
    currentFacility: 'all',

    // Add `filtered` class to cells where data-facility doesn't match facility
    byFacility: function(facility){
      var existingFacility = this.currentFacility;
      if (facility === existingFacility) return;
      this.currentFacility = facility;
      if (facility === 'all'){
        $('.cell').removeClass('filtered');
        $('.cell').removeClass('filter-selected');
      }else{
        $('.cell[data-facility!="'+facility+'"]').addClass('filtered');
        $('.cell[data-facility="'+facility+'"]').removeClass('filtered');
        $('.cell[data-facility="'+facility+'"]').addClass('filter-selected');
      }
      this.currentFacility = facility;
    }

  };

});
