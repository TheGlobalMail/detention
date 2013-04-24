define([
  'jquery',
  'lodash',
  'data/incidents'
], function($, _, incidents) {
  'use strict';

  var gridContainer = $('.incident-grid');
  var data;

  function processDateStrings() {
    incidents["Occurred On"] = _.map(
      incidents["Occurred On"],
      function(date) {
        // `date` takes the format MM/DD/YYYY

        var split = date.split('/');
        var normal = [split[2], split[0], split[1]].join('/');
        var unix = (new Date(normal.split('/'))).getTime();
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
    var occurredOn = incidents["Occurred On"];

    var dates = _(occurredOn)
      .unique('original')
      .sortBy('unix')
      .value();
    var dateCounts = _.countBy(occurredOn, 'original');

    var months = _.unique(dates, 'month');
    var monthCounts = _.countBy(occurredOn, 'month');

    data = {
      dates: dates,
      dateCounts: dateCounts,
      months: months,
      monthCounts: monthCounts
    };
  }

  function buildIncidentDayGrid() {
    resetGridContainer();

    _.each(
      data.dates,
      getAddDateToGrid(
        data.dateCounts,
        'original'
      )
    );

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
    resetGridContainer();

    _.each(
      data.months,
      getAddDateToGrid(
        data.monthCounts,
        'month'
      )
    );

    // Set some random ones as active
    setTimeout(function() {
      var cells = gridContainer.find('.cell');
      for(var i = 0; i < Math.floor(cells.length / 50); i++) {
        var cell = cells[Math.floor(Math.random() * cells.length)];
        $(cell).addClass('active');
      }
    }, 1000);
  }

  function getAddDateToGrid(countData, dateKey) {
    var i = 0;
    return function addDateToGrid(date) {
      // Delay for an increasingly larger time period so that
      // we don't halt the browser
      setTimeout(function() {
        gridContainer.append('<div class="date ' + date.dateClass +'">');
        var rowElement = gridContainer.find('.' + date.dateClass);
        _(countData[date[dateKey]])
          .times(function(i) {
            rowElement.append('<div class="cell">');
          }).tap(function() {
            rowElement.append('<div class="clear">');
          });
      }, i++);
    }
  }

  function resetGridContainer() {
    gridContainer.children().remove();
  }

  function bindControls() {
    var controls = $('.controls');

    controls.find('.day')
      .on('click', buildIncidentDayGrid);
    controls.find('.month')
      .on('click', buildIncidentMonthGrid);
  }

  function init() {
    processDateStrings();
    processIncidentData();
    buildIncidentDayGrid();
    bindControls();
  }

  return {
    init: init
  }
});
