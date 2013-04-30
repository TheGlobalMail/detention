define([
  'jquery',
  'lodash',
  './process-data'
], function($, _, data) {
  'use strict';

  var gridContainer = $('.incident-grid');

  function buildIncidentMonthGrid() {
    if (gridContainer.children().length) {
      gridContainer.children().remove();
    }

    _(data.months)
      .map(function(month, i) {
        var monthClass = month.replace(/\//g, '-');
        var rowElement = $('<div class="date ' + monthClass +'">');
        var incidents = data.incidentsByMonth[month];
        _(incidents.length)
          .times(function(i) {
            rowElement.append('<div class="cell">');
          }).tap(function() {
            rowElement.append('<div class="clear">');
          });
        return rowElement;
      })
      .each(function(rowElement) {
        requestAnimationFrame(function() {
          gridContainer.append(rowElement);
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

  function bindControls() {
    var controls = $('.controls');

    controls.find('a')
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
