define([
  'jquery',
  'lodash',
  'moment',
  'incidents',
  './models',
  './flags',
  './sharing-panel',
  './router',
  './tracking',
  './filters',
  './footer',
  'dropdown',
  'easing'
], function($, _, moment, incidents, models, flags, sharingPanel, router, tracking) {
  'use strict';

  var $gridContainer = $('.incident-grid');
  var gridContainer = $gridContainer[0];
  var loadingComplete = false;

  function buildIncidentMonthGrid() {
    if ($gridContainer.children().length) {
      $gridContainer.children().remove();
    }

    var grid = new models.GridController;

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
          gridContainer.appendChild(fragment);
        });
      })
      // Cleanup and handlers
      .tap(function() {
        // Set the scroll handlers for the months/filter menu interactions
        setTimeout(setMonthBindings, 0);

        // Deactivate the loading state
        loadingComplete = true;
        $('body').removeClass('loading');
      });
  }

  function getScrollY() {
    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }

  function getMonthScrollHandler() {
    var getDatesToWatch = function() {
      return $('.date');
    };
    var datesToWatch = getDatesToWatch();
    var getMonthsToWatch = function() {
      return datesToWatch.find('.month');
    };
    var monthsToWatch = getMonthsToWatch();

    var filterMenu = $('.filter-menu');
    var filterMenuMonth = filterMenu.find('.month');
    var filterMenuMonthText = filterMenuMonth.text();
    var filterMenuOriginalTopOffset = filterMenu.offset().top;
    var filterMenuClassName = 'affix';

    var navHeight = $('.navbar').outerHeight();

    return _.throttle(function() {
      // Continuously update the element list until
      // we've cached all that are expected
      if (monthsToWatch.length < incidents.months.length) {
        datesToWatch = getDatesToWatch();
        monthsToWatch = getMonthsToWatch();
      }

      var yScrollOffset = getScrollY() + navHeight;

      if (monthsToWatch.length) {
        if (
          filterMenuOriginalTopOffset <= yScrollOffset &&
          filterMenu.offset().top <= yScrollOffset
        ) {
          // Fix the filter menu's position
          filterMenu.addClass(filterMenuClassName);
          // Check each month's position
          var lastMonthText = null;
          _.each(monthsToWatch, function(element, i) {
            element = $(element);
            if (
              // Automatically pick up the first element due to a delay between
              // triggering the visibility of the menu and hitting the
              // OR conditional.
              (i == 0 && !filterMenuMonthText) ||
              element.offset().top <= yScrollOffset
            ) {
              lastMonthText = element.text();
            }
          });
          // Update the filter menu if we've hit another month
          if (
            lastMonthText &&
            lastMonthText !== filterMenuMonthText
          ) {
            filterMenuMonthText = lastMonthText;
            filterMenuMonth.text(filterMenuMonthText);
          }
        } else {
          // Unfix the filter menu's position
          filterMenu.removeClass(filterMenuClassName);
          // Suppress the text
          filterMenuMonthText = null;
        }
      }
    }, 100);
  }

  function getFlaggingPanelScrollHandler() {
    var flagPanel = $('#sharing-panel');
    var grid = $('.incident-grid');
    var className = 'pinned';
    return _.throttle(function() {
      if (loadingComplete) {
        if (grid.offset().top <= window.innerHeight + getScrollY()) {
          flagPanel.addClass(className);
        } else {
          flagPanel.removeClass(className);
        }
      }
    }, 50);
  }

  var monthScrollEvent = 'scroll.incident-month';

  function setMonthBindings() {
    var monthScrollHandler = getMonthScrollHandler();
    monthScrollHandler();
    $(window).on(monthScrollEvent, monthScrollHandler);
  }

  function unsetMonthBindings() {
    $(window).off(monthScrollEvent);
  }

  function onResize() {
    unsetMonthBindings();
    setMonthBindings();
  }

  function setBindings() {

    var flaggingPanelScrollHandler = getFlaggingPanelScrollHandler();
    flaggingPanelScrollHandler();
    $(window).scroll(flaggingPanelScrollHandler);

    $(window).resize(onResize);
  }

  function init() {
    flags
      .load()
      .always(
        buildIncidentMonthGrid
      );
    setBindings();
  }

  return {
    init: init
  }
});
