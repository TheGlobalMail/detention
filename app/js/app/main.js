define([
  'jquery',
  'lodash',
  './process-data',
  './models'
], function($, _, incidents, models) {
  'use strict';

  var gridContainer = $('.incident-grid');

  function buildIncidentMonthGrid() {
    if (gridContainer.children().length) {
      gridContainer.children().remove();
    }

    var grid = new models.GridController;

    _(incidents.months)
      // Build the grid in rows of months
      .map(function(obj) {
        var rowElement = $('<div class="date ' + obj.month +'">');
        _.each(obj.incidents, function(ID) {
          var cell = new models.Cell(incidents.data[ID])
          grid.add(cell);
          rowElement.append(cell.element);
        });
        return rowElement;
      // Insert a clearing div
      }).each(function(rowElement) {
        rowElement.append('<div class="clear">')
      })
      // Progressively append each of the rows
      .each(function(rowElement) {
        requestAnimationFrame(function() {
          gridContainer.append(rowElement);
        });
      });
  }

  function init() {
    buildIncidentMonthGrid();
  }

  return {
    init: init
  }
});
