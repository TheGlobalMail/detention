define([
  'jquery',
  'lodash',
  './process-data'
], function($, _, data) {
  'use strict';

  var gridContainer = $('.incident-grid');

  function buildIncidentMonthGrid() {
    resetGridContainer();

    var countData = data.monthCounts;
    var dateKey = 'month';
    var rowElements = _(data.months)
      .map(function(date) {
        var rowElement = $('<div class="date ' + date.dateClass +'">');
        var count = countData[date[dateKey]];
        _(count)
          .times(function(i) {
            rowElement.append('<div class="cell">');
          }).tap(function() {
            rowElement.append('<div class="clear">');
          });
        return rowElement;
      })
      .each(function(element, i) {
        requestAnimationFrame(function() {
          gridContainer.append(element);
        });
      });

    // Set some random ones as active
    requestAnimationFrame(function() {
      var cells = gridContainer.find('.cell');
      for (var i = 0; i < Math.floor(cells.length / 50); i++) {
        var cell = cells[Math.floor(Math.random() * cells.length)];
        $(cell).addClass('active');
      }
    });
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
