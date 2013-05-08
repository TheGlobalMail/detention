define([
  'jquery',
  'lodash',
  'moment',
  './process-data',
  './models',
  './flags',
  './sharing-panel',
  './router',
  './tracking',
  './filters',
  'dropdown'
], function($, _, moment, incidents, models, flags, sharingPanel, router, tracking) {
  'use strict';

  var gridContainer = $('.incident-grid');

  function buildIncidentMonthGrid() {
    if (gridContainer.children().length) {
      gridContainer.children().remove();
    }

    var grid = new models.GridController;
    var start = +new Date;

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
          rowElement[0].appendChild(cell.element);
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
      })
      .tap(function() {
        requestAnimationFrame(setMonthBindings);
      })
      .tap(function() {
        requestAnimationFrame($('.loading').removeClass('loading'));
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
      var scrollY = getScrollY();
      if (monthsToWatch.length) {
        // Trigger the application of the render classes
        _.each(datesToWatch.filter(':not(.render)'), function(element) {
          element = $(element);
          var elementTop = element.offset().top;
          if (elementTop <= scrollY + window.innerHeight + 100) {
            element.addClass('render');
          }
        });
        // Fix the filter menu's position
        if (filterMenu.offset().top <= scrollY + navHeight) {
          filterMenu.addClass(filterMenuClassName);
        }
        // Unfix the filter menu's position
        if (filterMenuOriginalTopOffset > scrollY + navHeight) {
          filterMenu.removeClass(filterMenuClassName);
          filterMenuMonthText = '';
          filterMenuMonth.text(filterMenuMonthText);
        }
        // Check each month's position
        var lastMonthText = null;
        _.each(monthsToWatch, function(element) {
          element = $(element);
          if (element.offset().top <= scrollY + navHeight + filterMenu.outerHeight()) {
            lastMonthText = element.text();
          }
        });
        // Update the filter menu if we've hit another month
        if (
          lastMonthText &&
          lastMonthText !== filterMenuMonthText &&
          filterMenu.hasClass(filterMenuClassName)
        ) {
          filterMenuMonthText = lastMonthText;
          filterMenuMonth.text(filterMenuMonthText);
        }
      }
    }, 100);
  }

  function getFlaggingPanelScrollHandler() {
    var flagPanel = $('#sharing-panel');
    var grid = $('.incident-grid');
    var className = 'pinned';
    return _.throttle(function() {
      if (grid.offset().top <= $(window).height() + getScrollY()) {
        flagPanel.addClass(className);
      } else {
        flagPanel.removeClass(className);
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
      .always(buildIncidentMonthGrid);
    setBindings();
  }

  return {
    init: init
  }
});
