define([
  'jquery',
  'lodash',
  'moment',
  './process-data',
  './models',
  './flags'
], function($, _, moment, incidents, models, flags) {
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

  function getScrollY() {
    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }

  function getFilterNavScrollHandler() {
    var getMonthsToWatch = function() {
      return $('.date .month');
    };
    var monthsToWatch = getMonthsToWatch();

    var filterMenu = $('.filter-menu');
    var filterMenuMonth = filterMenu.find('.month');
    var filterMenuMonthText = filterMenuMonth.text();
    var filterMenuOriginalTopOffset = filterMenu.offset().top;

    var className = 'affix';
    var navHeight = $('.navbar').outerHeight();

    return function() {
      // Continuously update the element list until
      // we've cached all that are expected
      if (monthsToWatch.length < incidents.months.length) {
        monthsToWatch = getMonthsToWatch();
      }
      var scrollY = getScrollY();
      if (monthsToWatch.length) {
        // Fix the filter menu's position
        if (filterMenu.offset().top <= scrollY + navHeight) {
          filterMenu.addClass(className);
        }
        // Unfix the filter menu's position
        if (filterMenuOriginalTopOffset > scrollY + navHeight) {
          filterMenu.removeClass(className);
        }
        // Check each month's position
        var lastMonthText = null;
        _.each(monthsToWatch, function(element) {
          element = $(element);
          if (element.offset().top <= scrollY + navHeight + filterMenu.outerHeight()) {
            lastMonthText = element.text();
          }
        });
        // Update the filter nav if we've hit another month
        if (lastMonthText && lastMonthText !== filterMenuMonthText) {
          filterMenuMonthText = lastMonthText;
          filterMenuMonth.text(filterMenuMonthText);
        }
      }
    }
  }

  var filterNavScrollEvent = 'scroll.filter-nav';

  function setFilterNavBindings() {
    var filterNavScrollHandler = getFilterNavScrollHandler();
    filterNavScrollHandler();
    $(window).on(filterNavScrollEvent, filterNavScrollHandler);
  }

  function unsetFilterNavBindings() {
    $(window).off(filterNavScrollEvent);
  }

  function onResize() {
    unsetFilterNavBindings();
    setFilterNavBindings();
  }

  function setBindings() {
    setFilterNavBindings();
    $(window).resize(onResize);
  }

  function init() {
    flags
      .load()
      .always(buildIncidentMonthGrid);
    setBindings();
  }

  return {
    init: init
  }
});
