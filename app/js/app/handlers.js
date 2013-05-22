define([
  'jquery',
  'lodash',
  './../utils/getScrollY',
  'incidents',
  './events'
], function($, _, getScrollY, incidents, events) {
  "use strict";

  var body = $('body');

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
              (
                i == 0 &&
                !filterMenuMonthText
              ) ||
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
    var onClassName = 'pinned';
    var offClassName = 'hide';

    return _.throttle(function() {
      var top = grid.offset().top;
      if (
        top <= window.innerHeight + getScrollY() - 100 &&
        !body.hasClass('loading')
      ) {
        flagPanel
          .removeClass(offClassName)
          .addClass(onClassName);
      } else {
        flagPanel.removeClass(onClassName);
        // Circumventing the iPad's broken position: fixed implementation
        setTimeout(function() {
          flagPanel.addClass(offClassName);
        }, 150)
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

    $(window).resize(onResize);

    var flaggingPanelScrollHandler = getFlaggingPanelScrollHandler();
    flaggingPanelScrollHandler();
    $(window).on('scroll', flaggingPanelScrollHandler);

    events.on('grid/complete', function() {
      _.defer(setMonthBindings);
    });
  }

  return {
    setBindings: setBindings
  };
});