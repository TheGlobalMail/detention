define([
  'jquery',
  'lodash',
  './process-data'
], function($, _, incidents) {
  'use strict';

  var gridContainer = $('.incident-grid');

  function buildIncidentMonthGrid() {
    if (gridContainer.children().length) {
      gridContainer.children().remove();
    }

    var rowElements = _(incidents.months)
      .map(function(month) {
        var rowElement = $('<div class="date">');
        _(month.incidents)
          .each(function(id) {
            rowElement.append('<div class="cell" data-incident-number="' + id + '">');
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
