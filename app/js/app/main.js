define([
  'jquery',
  'lodash',
  './process-data',
  './models'
], function($, _, data, models) {
  'use strict';

  var gridContainer = $('.incident-grid');

  function buildIncidentMonthGrid() {
    if (gridContainer.children().length) {
      gridContainer.children().remove();
    }

    _(data.months)
      // Build the grid in rows of months
      .map(function(month, i) {
        var monthClass = month.replace(/\//g, '-');
        var rowElement = $('<div class="date ' + monthClass +'">');
        var incidents = data.incidentsByMonth[month];
        _(incidents.length)
          .times(function(i) {
            rowElement.append(
              new models.Cell(incidents[i])
            );
          }).tap(function() {
            rowElement.append('<div class="clear">');
          });
        return rowElement;
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
