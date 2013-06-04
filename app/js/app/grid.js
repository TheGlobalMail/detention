define([
  'jquery',
  'lodash',
  './models',
  './events'
], function($, _, models, events) {
  "use strict";

  var gridContainer = $('#incident-grid');
  var grid = new models.GridController({$el: gridContainer});

  function buildIncidentMonthGrid(incidents) {
    if (gridContainer.children().length) {
      gridContainer.children().remove();
    }

    _(incidents.months)
      // Build the grid in rows of months
      .map(function(obj) {
        var rowElement = document.createElement('div');
        rowElement.className = 'date ' + obj.month;

        var monthElement = document.createElement('div');
        monthElement.className = 'month';
        monthElement.textContent = moment(Date.parse(obj.month)).format('MMMM YYYY');
        rowElement.appendChild(monthElement);

        _.each(obj.incidents, function(ID) {
          var cell = new models.Cell(incidents.data[ID]);
          grid.addCell(cell);
          rowElement.appendChild(cell.element);
        });

        return rowElement;
      })
      // Insert a clearing div
      .each(function(rowElement) {
        var clearingElement = document.createElement('div');
        clearingElement.className = 'clear';
        rowElement.appendChild(clearingElement);
      })
      // Combine the rows into a fragment and merge into the container
      .tap(function(rowElements) {
        var fragment = document.createDocumentFragment();
        _.each(rowElements, function(rowElement) {
          fragment.appendChild(rowElement);
        });

        requestAnimationFrame(function() {
          gridContainer[0].appendChild(fragment);
          events.trigger('grid/complete');
        });
      });
  }

  return {
    build: buildIncidentMonthGrid,
    grid: grid
  };
});
