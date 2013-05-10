define([
  'jquery',
  'lodash',
  './process-data',
  'scrollto'
], function($, _, incidents){

  var locations = {};
  var locationNames;

  // Extract the facility locations from the incident data
  _.each(incidents.data, function(incident){
    if (!incident.location) incident.location = 'unknown';
    if (!locations[incident.location]){
      locations[incident.location] = [];
    }
    locations[incident.location].push(incident.id);
  });
  locationNames = _.keys(locations).sort();

  // Populate the facility menu items
  var $facilities = $('#facilities');
  $facilities.append('<li><a data-facility="all" href="#all">All Facilities (' + _.keys(incidents.data).length + ')</a></li>');
  _.each(locationNames, function(name){
    $facilities.append(
      '<li>' +
      '<a data-facility="' + name + '" href="#' + name + '">' +
      name + ' (' + locations[name].length + ')' +
      '</a></li>'
    );
  });

  // Click events on filter menu items
  $facilities.find('a').click(function(e){
    e.preventDefault();
    Filter.byFacility($(this).data('facility'));
    $facilities.parent().find('a[data-toggle]').text($(this).text());
  });

  // Manages the state of the filters
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
        // Scroll to the first matching cell
        var selected = $('.cell[data-facility="'+facility+'"]');
        selected
          .removeClass('filtered')
          .addClass('filter-selected');
        // Scroll to the first matching element so that it is in the centre of
        // the page
        $.scrollTo(selected, { duration: 500, offset: - 140});
      }
      this.currentFacility = facility;
    }

  };

});
