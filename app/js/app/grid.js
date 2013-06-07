define([
  'jquery',
  'lodash',
  './models',
  './events',
  './flags',
  'incidents'
], function($, _, models, events, flags, incidents) {
  "use strict";

  var gridContainer = $('#incident-grid');
  var grid = new models.GridController({$el: gridContainer});

  function build(){
    clearGrid();
    if (window.embedded){
      buildFlaggedGrid()
    }else{
      buildIncidentMonthGrid()
    }
  }

  // Render a single row of all flagged elements. This is the render method
  // used by the embedded widget
  function buildFlaggedGrid() {

    var rowElement = document.createElement('div');
    rowElement.className = 'date';

    // limit of 30 flags
    var flaggedIds = flags.flaggedIds().slice(0, 30);

    _.each(flaggedIds, function(ID) {
      var cell = new models.Cell(incidents.data[ID]);
      grid.addCell(cell);
      rowElement.appendChild(cell.element);
    });

    var clearingElement = document.createElement('div');
    clearingElement.className = 'clear';
    rowElement.appendChild(clearingElement);

    renderRowElements([rowElement]);
  }

  // Render a row of incidents in each month. This is the view when the grid is
  // not embedded
  function buildIncidentMonthGrid() {

    _(incidents.months)
      // Build the grid in rows of months
      .map(function(obj) {
        var rowElement = document.createElement('div');
        rowElement.className = 'date ' + obj.month;

        var monthElement = document.createElement('div');
        monthElement.className = 'month';
        monthElement.textContent = moment(obj.month).format('MMMM YYYY');
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
      .tap(renderRowElements);
  }

  function clearGrid(){
    if (gridContainer.children().length) {
      gridContainer.children().remove();
    }
  }

  // Combine the rows into a fragment and merge into the container
  function renderRowElements(rowElements){
    var fragment = document.createDocumentFragment();
    _.each(rowElements, function(rowElement) {
      fragment.appendChild(rowElement);
    });

    requestAnimationFrame(function() {
      gridContainer[0].appendChild(fragment);
      events.trigger('grid/complete');
    });
  }

  return {
    build: build,
    grid: grid
  };
});
