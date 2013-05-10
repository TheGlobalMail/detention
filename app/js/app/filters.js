define([
  'jquery',
  'lodash',
  './process-data',
  'scrollto'
], function($, _, incidents){

  buildFilter({type: 'facility', el: '#facilities', alllabel: 'All Facilities', attr: 'location' });
  buildFilter({type: 'category', el: '#categories', alllabel: 'All Incidents', attr: 'incident_category' });

  $('#reset-filter').click(function(e){
    e.preventDefault();
    $('#facilities-label').text('All Facilities');
    $('#categories-label').text('All Categories');
    Filter.clear();
  });

  function buildFilter(options){
    var filtered = {};
    var names;

    // Extract the data for each filter category from the incident data
    _.each(incidents.data, function(incident){
      var value = incident[options.attr];
      if (!value) value = 'unknown';
      if (!filtered[value]){
        filtered[value] = [];
      }
      filtered[value].push(incident.id);
    });
    names = _.keys(filtered).sort();

    // Populate the filter menu items
    var $filter = $(options.el);
    $filter.append(
      '<li><a data-' + options.type + '="all" href="#all">' + options.alllabel +
      ' <span class="filter-count">(' + _.keys(incidents.data).length + ')</span>' +
      '</a></li>'
    );
    _.each(names, function(name){
      $filter.append(
        '<li>' +
        '<a data-' + options.type + '="' + name + '" href="#' + name + '">' +
        name + ' <span class="filter-count">(' + filtered[name].length + ')</span>' +
        '</a></li>'
      );
    });

    // Click events on filter menu items
    $filter.find('a').click(function(e){
      var value = $(this).data(options.type);
      e.preventDefault();
      Filter.filterBy(options.type, value);
      if (value === 'all'){
        $filter.parent().find('a[data-toggle]').text(options.alllabel);
      }else{
        $filter.parent().find('a[data-toggle]').text($(this).text());
      }
    });
  }

  // Manages the state of the filters
  var Filter = {

    // Keep track of the current filtered facility
    state: {facility: 'all', category: 'all'},

    // Update filter data and then call filter
    filterBy: function(type, value){
      if (this.state[type] === value) return;
      this.state[type] = value;
      this.filter();
    },

    // Clear all existing filters
    clear: function(){
      this.state.category = 'all';
      this.state.facility = 'all';
      this.filter();
      $.scrollTo($('.cell:first'), { duration: 500, offset: -140, easing: 'easeInOutQuad'});
    },

    // Add `filtered` class to cells where data-facility doesn't match facility
    filter: function(){
      var facility = this.state.facility;
      var category = this.state.category;
      if (facility === 'all' && category === 'all'){
        $('.cell').removeClass('filtered');
        $('.cell').removeClass('filter-selected');
        $.scrollTo($('.cell:first'), { duration: 500, offset: -140, easing: 'easeInOutQuad'});
      }else{
        var filters = [
          {type: 'facility', value: facility},
          {type: 'category', value: category}
        ];
        filters = _.select(filters, function(filter){ return filter.value !== 'all'; });
        var filterSelector = _.map(filters, function(filter){
          return '.cell[data-'+filter.type +'!="'+filter.value+'"]';
        }).join(',');
        var selectredSelector = '.cell' + _.map(filters, function(filter){
          return '[data-'+filter.type +'="'+filter.value+'"]';
        }).join('');
        $(filterSelector)
          .addClass('filtered')
          .removeClass('filter-selected');
        // Scroll to the first matching cell
        var selected = $(selectredSelector);
        selected
          .removeClass('filtered')
          .addClass('filter-selected');
        // Scroll to the first matching element so that it is in the centre of
        // the page
        if (selected.length){
          $.scrollTo(selected, { duration: 500, offset: -140, easing: 'easeInOutQuad'});
        }
      }
    }

  };

});
