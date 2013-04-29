define([
  'jquery',
  'lodash',
  './processed-data'
], function($, _, data) {
  'use strict';

  var gridContainer = $('.incident-grid');

  function buildIncidentMonthGrid() {
    resetGridContainer();

    var countData = data.monthCounts;
    var dateKey = 'month';
    var rowElements = _.map(
      data.months,
      function(date) {
        var rowElement = $('<div class="date ' + date.dateClass +'">');
        _(countData[date[dateKey]])
          .times(function(i) {
            rowElement.append('<div class="cell">');
          }).tap(function() {
            rowElement.append('<div class="clear">');
          });
        return rowElement;
      }
    );

    _.each(rowElements, function(element, i) {
      setTimeout(function() {
        gridContainer.append(element)
      }, i * 100);
    });

    // Set some random ones as active
    setTimeout(function() {
      var cells = gridContainer.find('.cell');
      for (var i = 0; i < Math.floor(cells.length / 50); i++) {
        var cell = cells[Math.floor(Math.random() * cells.length)];
        $(cell).addClass('active');
      }
    }, rowElements.length * 100);
  }

  function resetGridContainer() {
    gridContainer.children().remove();
  }

  function bindControls() {
    var controls = $('.controls');

    controls.find('.month')
      .on('click', buildIncidentMonthGrid);

    gridContainer.on('click touch', '.date .cell', function() {
      $(this).toggleClass('active');
    })
  }

  function init() {
    buildIncidentMonthGrid();
    bindControls();
  }

  return {
    init: init
  }
});
