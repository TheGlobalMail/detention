define([
  'jquery',
  'lodash',
  './grid',
  './events',
  'incidents',
  './../utils/getScrollY'
], function($, _, grid, events, incidents, getScrollY) {
  "use strict";

  var defaultScrollDuration = 1000;

  var body = $('body');
  var incidentContainer = $('#incidents');

  var tourContainer = $('.tour-container');
  var backdrop = tourContainer.find('.backdrop');
  var exit = tourContainer.find('.close');

  var intro = tourContainer.find('.intro');
  var introText = intro.find('.text-container');
  var introNext = intro.find('.next');
  var introScrollTo;

  var firstExample = tourContainer.find('.first-example');
  var firstExampleText = firstExample.find('.text-container');
  var firstExampleNext = firstExample.find('.next');
  var firstExampleMonth;
  var firstExampleScrollTo;

  var secondExample = tourContainer.find('.second-example');
  var secondExampleText = secondExample.find('.text-container');
  var secondExampleNext = secondExample.find('.next');
  var secondExampleMonth;
  var secondExampleScrollTo;

  var flagIntro = tourContainer.find('.flag-intro');
  var flagIntroText = flagIntro.find('.text-container');
  var flagIntroNext = flagIntroText.find('.next');
  var flagIntroImage = flagIntroText.find('img');
  var flagIntroMonth;
  var flagIntroScrollTo;

  var scrollCallbackIndex = 0;
  var scrollCallbacks = [];

  var months;

  var inTour = false;

  function startTour() {
    inTour = true;
    body.addClass('in-tour');
    tourContainer.addClass('show');
    positionElements();
    scrollToIntro();
  }

  function positionElements() {
    // Introduction
    introScrollTo = incidentContainer.offset().top;
    introText.css({
      top: introScrollTo + (window.innerHeight - introText.height()) / 2,
      left: (window.innerWidth - introText.width()) / 2
    });
    introNext.css({
      top: introScrollTo + window.innerHeight - introNext.height() - 100,
      left: (window.innerWidth - introNext.width()) / 2
    });

    // First example
    firstExampleScrollTo = firstExampleMonth.offsetTop;
    firstExampleText.css({
      top: firstExampleScrollTo + (window.innerHeight - firstExampleText.height()) / 2,
      left: (window.innerWidth - firstExampleText.width()) / 2
    });
    firstExampleScrollTo += positionCellOnNearestCell(firstExampleText);
    firstExampleNext.css({
      top: firstExampleScrollTo + window.innerHeight - firstExampleNext.height() - 100,
      left: (window.innerWidth - firstExampleNext.width()) / 2
    });

    // Second example
    secondExampleScrollTo = secondExampleMonth.offsetTop;
    secondExampleText.css({
      top: secondExampleScrollTo + (window.innerHeight - secondExampleText.height()) / 2,
      left: (window.innerWidth - secondExampleText.width()) / 2
    });
    secondExampleScrollTo += positionCellOnNearestCell(secondExampleText);
    secondExampleNext.css({
      top: secondExampleScrollTo + window.innerHeight - secondExampleNext.height() - 100,
      left: (window.innerWidth - secondExampleNext.width()) / 2
    });

    // Flagging introduction
    flagIntroScrollTo = flagIntroMonth.offsetTop;
    flagIntroText.css({
      top: flagIntroScrollTo + (window.innerHeight - flagIntroText.height()) / 2,
      left: (window.innerWidth - flagIntroText.width()) / 2
    });
    var offsetDifference = getOffsetDifference(flagIntroImage, getNearestCell(flagIntroImage));
    flagIntroScrollTo += offsetDifference.top;
    // Shift the image inline with the nearest cell
    flagIntroImage.css(offsetDifference);
    flagIntroNext.css('top', offsetDifference.top);
  }

  function getOffsetDifference(originElement, toElement) {
    // Find the positional difference between the nearest cell and the image
    var toElementOffset = toElement.offset();
    var originElementOffset = originElement.offset();
    return {
      top: toElementOffset.top - originElementOffset.top,
      left: toElementOffset.left - originElementOffset.left
    };
  }

  function getNearestCell(element) {
    // Find the month underneath `element` and then find the nearest cell.
    // If there is no month underneath, find the first month above `element`.

    var nearestMonth;
    var lastMonthAbove;
    var elementHeight = element.height();
    var elementOffset = element.offset();

    for (var i = 0; i < months.length; i++) {
      var month = $(months[i]);
      var monthHeight = month.height();
      var monthOffset = month.offset();
      // If the element is inline with or below the month
      if (elementOffset.top >= monthOffset.top) {
        lastMonthAbove = month;
        // If the element is within the month
        if (monthHeight + monthOffset.top >= elementHeight + elementOffset.top) {
          nearestMonth = month;
          break;
        }
      // If we have gone past the element
      } else {
        break;
      }
    }
    if (!nearestMonth) {
      nearestMonth = lastMonthAbove;
    }

    // Find the nearest cell below the element
    var cells = nearestMonth.find('.cell');
    var cellWidth = cells.first().outerWidth(true);
    var cellsPerRow = Math.floor(nearestMonth.width() / cellWidth);
    var cellCountFromLeft = Math.floor((elementOffset.left - monthOffset.left) / cellWidth);
    var cellRowCountFromTop = Math.floor((elementOffset.top - monthOffset.top) / cellWidth);
    var nearestCellIndex = (cellRowCountFromTop * cellsPerRow) + cellCountFromLeft;

    return $(cells.get(nearestCellIndex));
  }

  function positionCellOnNearestCell(tourTextElement) {
    var tourCell = tourTextElement.find('.cell');
    // Find the positional difference between the nearest cell and tour cell
    var offsetDifference = getOffsetDifference(tourCell, getNearestCell(tourCell));
    // Shift the cell and the pull quote inline with the nearest cell
    var pullQuote = tourTextElement.find('.pullquote');
    tourCell
      .add(pullQuote)
      .css(offsetDifference);
    tourTextElement.find('p')
      .css({
        'top': offsetDifference.top
      });
    return offsetDifference.top
  }

  var scrollToIntro = _.throttle(function() {
    scrollCallbackIndex = 0;
    var scrollDuration = defaultScrollDuration;
    var scrollY = getScrollY();
    // Make the starting animation's duration a fraction
    // of the distance from the starting point
    var offsetFromScrollStart = Math.abs(scrollY - introScrollTo);
    if (offsetFromScrollStart <= window.innerHeight) {
      scrollDuration = (offsetFromScrollStart / window.innerHeight) * defaultScrollDuration;
    }
    $.scrollTo(introScrollTo, scrollDuration);
  }, defaultScrollDuration);
  scrollCallbacks.push(scrollToIntro);

  var scrollToFirstExample = _.throttle(function() {
    scrollCallbackIndex = 1;
    $.scrollTo(firstExampleScrollTo, defaultScrollDuration);
  }, defaultScrollDuration);
  scrollCallbacks.push(scrollToFirstExample);

  var scrollToSecondExample = _.throttle(function() {
    scrollCallbackIndex = 2;
    $.scrollTo(secondExampleScrollTo, defaultScrollDuration);
  }, defaultScrollDuration);
  scrollCallbacks.push(scrollToSecondExample);

  var scrollToFlagIntro = _.throttle(function() {
    scrollCallbackIndex = 3;
    $.scrollTo(flagIntroScrollTo, defaultScrollDuration);
  }, defaultScrollDuration);
  scrollCallbacks.push(scrollToFlagIntro);

  function endTour() {
    inTour = false;
    body.removeClass('in-tour');
    tourContainer.removeClass('show');
  }

  var onResize = _.debounce(function() {
    if (inTour) {
      positionElements();
      scrollCallbacks[scrollCallbackIndex]();
    }
  }, 100);

  function setBindings() {
    introNext.on('click', scrollToFirstExample);
    firstExampleNext.on('click', scrollToSecondExample);
    secondExampleNext.on('click', scrollToFlagIntro);

    exit.on('click', endTour);
    flagIntroNext.on('click', endTour);

    months = incidentContainer.find('.date');
    firstExampleMonth = months.get(8);
    secondExampleMonth = months.get(13);
    flagIntroMonth = months.get(16);

    $('.start-tour').on('click', startTour);

    $(window).on('resize', onResize);
  }

  function init() {
    events.on('grid/complete', setBindings)
  }

  return {
    init: init
  }
});