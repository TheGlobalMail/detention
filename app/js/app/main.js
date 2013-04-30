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

    _(incidents.months)
      // Build the grid in rows of months
      .map(function(obj) {
        var rowElement = $('<div class="date ' + obj.month +'">');
        _.each(obj.incidents, function(ID) {
          rowElement.append(
            new models.Cell(incidents.data[ID])
          );
        });
        return rowElement;
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
