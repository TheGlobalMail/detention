tgm = window.tgm || {};
tgm.app = (function() {
  'use strict';

  var gridContainer = $('.incident-grid');
  var data;

  function getProcessedIncidentData() {
    var occuredOn = tgm.data.incidents["Occurred On"];
    var types = tgm.data.incidents["Type"];
    var dates = _(occuredOn)
      .unique()
      .sortBy(function(date) {
        return new Date(date.split('/'));
      }).value();
    var counts = _.countBy(occuredOn, _.identity);
    return {
      // Ordered list of dates
      dates: dates,
      // Map of date -> incident count
      counts: counts
    };
  }

  function buildIncidentDayGrid() {
    gridContainer.find('.cell').remove();
    var i = 0;
    var addDateToGrid = function(date) {
      // Delay for an increasingly larger time period so that
      // we don't halt the browser
      setTimeout(function() {
        var dateClass = date.replace(/\//g, '-'); // Replace slashes with dashes
        gridContainer.append('<div class="date ' + dateClass +'">');
        var dateElement = gridContainer.find('.' + dateClass);
        _(data.counts[date])
          .times(function(i) {
            dateElement.append('<div class="cell">');
          }).tap(function() {
            dateElement.append('<div class="clear">');
          });
      }, i++)
    };

    _.each(data.dates, addDateToGrid);

    // Set some random ones as active
    setTimeout(function() {
      var cells = gridContainer.find('.cell');
      for(var i = 0; i < Math.floor(cells.length / 20); i++) {
        var cell = cells[Math.floor(Math.random() * cells.length)];
        $(cell).addClass('active');
      }
    }, 1000);
  }

  function buildIncidentMonthGrid() {
    var i = 0;
    var addDateToGrid = function(date) {
      // Delay for an increasingly larger time period so that
      // we don't halt the browser
      setTimeout(function() {
        var dateClass = date.replace(/\//g, '-'); // Replace slashes with dashes
        gridContainer.append('<div class="date ' + dateClass +'">');
        var dateElement = gridContainer.find('.' + dateClass);
        _(data.counts[date])
          .times(function(i) {
            dateElement.append('<div class="cell">');
          }).tap(function() {
            dateElement.append('<div class="clear">');
          });
      }, i++)
    };

    _.each(data.dates, addDateToGrid);

    // Set some random ones as active
    setTimeout(function() {
      var cells = gridContainer.find('.cell');
      for(var i = 0; i < Math.floor(cells.length / 20); i++) {
        var cell = cells[Math.floor(Math.random() * cells.length)];
        $(cell).addClass('active');
      }
    }, 1000);
  }

  function bindControls() {
    var controls = $('.controls');

    controls.find('.day')
      .on('click', buildIncidentDayGrid);
    controls.find('.month')
      .on('click', buildIncidentMonthGrid);
  }

  function init() {
    data = getProcessedIncidentData();
    buildIncidentDayGrid();
    bindControls();
  }

  return {
    init: init
  }
})();

$(tgm.app.init);
