define([
  'jquery',
  'lodash',
  'incidents',
  'scrollto'
], function($, _, incidents){

  var filters = [
    {type: 'facility', el: '#facilities', alllabel: 'All Facilities', attr: 'location' },
    {type: 'category', el: '#categories', alllabel: 'All Incidents', attr: 'incident_category' }
  ];

  _.each(filters, buildFilter);

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
      var label = name === 'protest' ? 'protest by detainees' : name;
      $filter.append(
        '<li>' +
        '<a data-' + options.type + '="' + name + '" href="#' + name + '">' +
        label + ' <span class="filter-count">(' + filtered[name].length + ')</span>' +
        '</a></li>'
      );
    });

    // Click events on filter menu items
    $filter.find('a').click(function(e){
      var value = $(this).data(options.type);
      e.preventDefault();
      Filter.filterBy(options.type, value);
      updateAllFilterCounts(options);
      var labelText = $(this).text().replace(/ \(.*\)/, '');
      $filter.parent().find('a[data-toggle]').text(labelText);
    });
  }

  function updateAllFilterCounts(updatedFilter){
    _.each(filters, function(filter){
      // Update the counts on all filters but the one that was just updated
      if (filter.type !== updatedFilter.type){
        updateFilterMenu(filter, updatedFilter);
      }
    });
  }

  // When any menu item is selected, go through the filters and updates the counts
  function updateFilterMenu(filter, updatedFilter){
    // Extract the data for each filter category from the incident data
    var state = Filter.stateFor(updatedFilter.type);
    var $filter = $(filter.el);
    var filtered = {};
    _.each(incidents.data, function(incident){
      var value = incident[filter.attr];
      if (!value) value = 'unknown';
      if (!filtered[value]){
        filtered[value] = [];
      }
      if (Filter.isSelected(incident, updatedFilter.type, updatedFilter.attr)){
        filtered[value].push(incident.id);
      }
    });
    var names = _.keys(filtered).sort();
    var total = 0;
    _.each(names, function(name){
      var $count = $filter.find('a[data-' + filter.type + '="' + name + '"] .filter-count');
      var count = filtered[name].length;
      var text = '(' + count;
      total += count;
      if (state !== 'all'){
        text += ' for  ' + state;
      }
      text += ')';
      $count.text(text);
      $count.parents('li').toggleClass('no-incidents', !count);
    });
    var $count = $filter.find('a[data-' + filter.type + '="all"] .filter-count');
    var text = '(' + total;
    if (state !== 'all'){
      text += ' for  ' + state;
    }
    text += ')';
    $count.text(text);
    $count.parents('li').toggleClass('no-incidents', !total);
  }

  // Manages the state of the filters
  var Filter = {

    // filter panel 
    $filters: $('#filters'),

    // Keep track of the current filtered facility
    state: {facility: 'all', category: 'all'},

    // Update filter data and then call filter
    filterBy: function(type, value){
      if (this.state[type] === value) return;
      this.state[type] = value;
      this.filter();
    },

    // Return true if incident matches current filter state
    isSelected: function(incident, type, attr){
      var value = this.state[type];
      return value === 'all' || value === incident[attr];
    },

    // Return the current state of the type
    stateFor: function(type){
      return this.state[type];
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
      if (this.state.facility === 'all' && this.state.category === 'all'){
        this.resetCells();
      }else{
        this.filterCells();
      }
    },

    // Clear all filtering classes and scroll to the first cell
    resetCells: function(){
      $('.cell').removeClass('filtered');
      $('.cell').removeClass('filter-selected');
      $.scrollTo($('.cell:first'), { duration: 500, offset: -140, easing: 'easeInOutQuad'});
      this.$filters.removeClass('active');
    },

    // Filter cells based on the current values in this.state
    filterCells: function(){
      var filters = [
        {type: 'facility', value: this.state.facility},
        {type: 'category', value: this.state.category}
      ];
      // ignore any filter item set to 'all'
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
      this.$filters.addClass('active');
    }

  };

});
