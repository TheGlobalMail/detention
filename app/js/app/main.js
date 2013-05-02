define([
  'jquery',
  'lodash',
  'moment',
  './process-data',
  './models'
], function($, _, moment, incidents, models) {
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
        var rowElement = $(
          '<div class="date ' + obj.month +'">' +
            '<div class="month">' +
            moment(Date.parse(obj.month)).format('MMMM YYYY') +
            '</div>' +
          '</div>'
        );
        _.each(obj.incidents, function(ID) {
          var cell = new models.Cell(incidents.data[ID]);
          grid.addCell(cell);
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
