define([
  'jquery',
  'lodash',
  './grid',
  './events',
  'incidents',
  './../utils/getScrollY'
], function($, _, grid, events, incidents, getScrollY) {
  "use strict";

  var defaultAnimation = {
    duration: 1000
  };

  var inTour = false;
  var scrollCallbackIndex = 0;
  var scrollCallbacks = [];
  var originalScrollPosition;

  var body = $('body');
  var incidentContainer = $('#incidents');
  var months;
  var startTourElement = $('.start-tour');
  var introArrow = $('.intro .arrow');

  var tourContainer = $('.tour-container');
  var backdrop = tourContainer.find('.backdrop');
  var exit = tourContainer.find('.close');

  var intro = tourContainer.find('.intro');
  var introText = intro.find('.text-container');
  var introNext = intro.find('.next');
  var introScrollTo;

  var firstExample = tourContainer.find('.first-example');
  var firstExampleText = firstExample.find('.text-container');
  var firstExampleBack = firstExample.find('.back');
  var firstExampleNext = firstExample.find('.next');
  var firstExampleScrollTo;

  var secondExample = tourContainer.find('.second-example');
  var secondExampleText = secondExample.find('.text-container');
  var secondExampleBack = secondExample.find('.back');
  var secondExampleNext = secondExample.find('.next');
  var secondExampleScrollTo;

  var flagIntro = tourContainer.find('.flag-intro');
  var flagIntroText = flagIntro.find('.text-container');
  var flagIntroBack = flagIntro.find('.back');
  var flagIntroNext = flagIntroText.find('.next');
  var flagIntroImage = flagIntroText.find('img');
  var flagIntroScrollTo;

  function startTour(scrollPositionOverride) {
    inTour = true;
    if (typeof scrollPositionOverride === 'number') {
      originalScrollPosition = scrollPositionOverride;
    } else {
      originalScrollPosition = getScrollY();
    }
    body.addClass('in-tour');
    grid.grid.hideModals();
    tourContainer.addClass('display');
    _.defer(function() {
      tourContainer.addClass('show');
    });
    bindEscapeKey();
    positionElements();
    scrollToIntro();
  }

  function endTour() {
    inTour = false;
    body.removeClass('in-tour');
    tourContainer.addClass('hide');
    _.defer(function() {
      _.delay(function() {
        tourContainer.removeClass('display show hide');
      }, 750);
    });
    $.scrollTo(originalScrollPosition, defaultAnimation);
    unbindEscapeKey();
  }

  function bindEscapeKey() {
    $(document).on('keyup.escape-modal', function(e) {
      if (e.keyCode === 27) {
        endTour();
      }
    });
  }

  function unbindEscapeKey() {
    $(document).off('keyup.escape-modal');
  }

  function positionElements() {
    // Introduction
    introScrollTo = incidentContainer.offset().top;
    introText.css({
      top: introScrollTo + (window.innerHeight - introText.height()) / 2,
      left: (window.innerWidth - introText.width()) / 2
    });
    var introTextBottom = introText.offset().top + introText.outerHeight();
    var introTextTop = introScrollTo + window.innerHeight - introNext.height() - 100;
    if (introTextTop < introTextBottom) {
      introTextTop += introTextBottom - introTextTop + 20;
    }
    introNext.css({
      top: introTextTop,
      left: (window.innerWidth - introNext.width()) / 2
    });

    // First example
    firstExampleScrollTo = introScrollTo + (window.innerHeight * 2);
    var firstExampleTextTop = firstExampleScrollTo + (window.innerHeight - firstExampleText.height()) / 2;
    var firstExampleTextBottom = firstExampleTextTop + firstExampleText.outerHeight();
    firstExampleText.css({
      top: firstExampleTextTop,
      left: (window.innerWidth - firstExampleText.width()) / 2
    });
    firstExampleScrollTo += positionCellOnNearestCell(firstExampleText);
    var firstExampleBackHeight = firstExampleBack.outerHeight();
    var firstExampleBackTop = firstExampleScrollTo + firstExampleBackHeight;
    var firstExampleBackBottom = firstExampleBackTop + firstExampleBackHeight;
    if (firstExampleBackBottom >= firstExampleTextTop) {
      firstExampleBackTop -= firstExampleBackBottom - firstExampleTextTop;
      firstExampleScrollTo -= firstExampleBackBottom - firstExampleTextTop;
    }
    firstExampleBack.css({
      top: firstExampleBackTop,
      left: (window.innerWidth - firstExampleBack.width()) / 2
    });
    var firstExampleNextTop = firstExampleScrollTo + window.innerHeight - firstExampleNext.height() - 100;
    if (firstExampleNextTop < firstExampleTextBottom) {
      firstExampleNextTop += firstExampleTextBottom - firstExampleNextTop + 20;
    }
    firstExampleNext.css({
      top: firstExampleNextTop,
      left: (window.innerWidth - firstExampleNext.width()) / 2
    });

    // Second example
    secondExampleScrollTo = firstExampleScrollTo + (window.innerHeight * 2);
    var secondExampleTextTop = secondExampleScrollTo + (window.innerHeight - secondExampleText.height()) / 2;
    var secondExampleTextBottom = secondExampleTextTop + secondExampleText.outerHeight();
    secondExampleText.css({
      top: secondExampleTextTop,
      left: (window.innerWidth - secondExampleText.width()) / 2
    });
    secondExampleScrollTo += positionCellOnNearestCell(secondExampleText);
    var secondExampleBackHeight = secondExampleBack.outerHeight();
    var secondExampleBackTop = secondExampleScrollTo + secondExampleBackHeight;
    var secondExampleBackBottom = secondExampleBackTop + secondExampleBackHeight;
    if (secondExampleBackBottom >= secondExampleTextTop) {
      secondExampleBackTop -= secondExampleBackBottom - secondExampleTextTop;
      secondExampleScrollTo -= secondExampleBackBottom - secondExampleTextTop;
    }
    secondExampleBack.css({
      top: secondExampleBackTop,
      left: (window.innerWidth - secondExampleBack.width()) / 2
    });
    var secondExampleNextTop = secondExampleScrollTo + window.innerHeight - secondExampleNext.height() - 100;
    if (secondExampleNextTop < secondExampleTextBottom) {
      secondExampleNextTop += secondExampleTextBottom - secondExampleNextTop;
    }
    secondExampleNext.css({
      top: secondExampleNextTop,
      left: (window.innerWidth - secondExampleNext.width()) / 2
    });

    // Flagging introduction
    flagIntroScrollTo = secondExampleNextTop + secondExampleNext.outerHeight() + window.innerHeight;
    var flagIntroTextHeight = flagIntroText.outerHeight();
    var flagIntroTextTop = flagIntroScrollTo + (window.innerHeight - flagIntroTextHeight) / 2;
    flagIntroText.css({
      top: flagIntroTextTop,
      left: (window.innerWidth - flagIntroText.width()) / 2
    });
    var offsetDifference = getOffsetDifference(flagIntroImage, getNearestCell(flagIntroImage));
    flagIntroScrollTo += offsetDifference.top;
    var flagIntroBackTop = flagIntroScrollTo + flagIntroBack.outerHeight();
    var flagIntroBackBottom = flagIntroBackTop + flagIntroBack.outerHeight();
    if (flagIntroBackBottom > flagIntroTextTop) {
      flagIntroBackTop += flagIntroTextTop - flagIntroBackBottom - 20;
      flagIntroScrollTo += flagIntroTextTop - flagIntroBackBottom - 10;
    }
    flagIntroBack.css({
      top: flagIntroBackTop,
      left: (window.innerWidth - flagIntroBack.width()) / 2
    });
    // Shift the image inline with the nearest cell
    if (offsetDifference.top < -5) {
      offsetDifference.top = 0;
    }
    flagIntroImage.css(offsetDifference);
    flagIntroNext.css('top', offsetDifference.top);
  }

  function getOffsetDifference(originElement, nearestCell) {
    // Find the positional difference between a cell and the nearest cell
    var nearestCellHeight = nearestCell.outerHeight(true);
    var nearestCellWidth = nearestCell.outerWidth(true);
    var toElementOffset = nearestCell.offset();
    var originElementOffset = originElement.offset();
    var difference = {
      top: toElementOffset.top - originElementOffset.top,
      left: toElementOffset.left - originElementOffset.left
    };
    if (
      difference.top > nearestCellHeight ||
      difference.top < -nearestCellHeight
    ) {
      difference.top = 0;
    }
    if (
      difference.left > nearestCellWidth ||
      difference.left < -nearestCellWidth
    ) {
      difference.left = 0;
    }
    return difference;
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
      if (!lastMonthAbove) {
        return;
      }
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
    var nearestCell = getNearestCell(tourCell);
    if (nearestCell && nearestCell.length) {
      var offsetDifference = getOffsetDifference(tourCell, nearestCell);
      // Suppressing a weird bug
      if (offsetDifference.left >= tourCell.outerWidth(true)) {
        offsetDifference.left = 0;
      }
      // Shift the cell and the pull quote inline with the nearest cell
      var pullQuote = tourTextElement.find('.pullquote');
      tourCell
        .add(pullQuote)
        .css(offsetDifference);
      tourTextElement.find('p').first()
        .css({
          'margin-top': offsetDifference.top
        });
      return offsetDifference.top
    } else {
      return 0;
    }
  }

  var scrollToIntro = _.throttle(function() {
    scrollCallbackIndex = 0;
    var scrollDuration = defaultAnimation.duration;
    var scrollY = getScrollY();
    // Make the starting animation's duration a fraction
    // of the distance from the starting point
    var offsetFromScrollStart = Math.abs(scrollY - introScrollTo);
    if (offsetFromScrollStart <= window.innerHeight) {
      scrollDuration = (offsetFromScrollStart / window.innerHeight) * defaultAnimation.duration;
    }
    $.scrollTo(introScrollTo, {'duration': scrollDuration});
  }, defaultAnimation.duration);
  scrollCallbacks.push(scrollToIntro);

  var scrollToFirstExample = _.throttle(function() {
    scrollCallbackIndex = 1;
    $.scrollTo(firstExampleScrollTo, defaultAnimation);
  }, defaultAnimation.duration);
  scrollCallbacks.push(scrollToFirstExample);

  var scrollToSecondExample = _.throttle(function() {
    scrollCallbackIndex = 2;
    $.scrollTo(secondExampleScrollTo, defaultAnimation);
  }, defaultAnimation.duration);
  scrollCallbacks.push(scrollToSecondExample);

  var scrollToFlagIntro = _.throttle(function() {
    scrollCallbackIndex = 3;
    $.scrollTo(flagIntroScrollTo, defaultAnimation.duration);
  }, defaultAnimation.duration);
  scrollCallbacks.push(scrollToFlagIntro);

  var onResize = _.debounce(function() {
    if (inTour) {
      positionElements();
      scrollCallbacks[scrollCallbackIndex]();
    }
  }, 100);

  function setBindings() {
    if (!localStorage.getItem('initialTourRun')) {
      introArrow.one('click', function() {
        localStorage.setItem('initialTourRun', 'passed');
        startTour(incidentContainer.offset().top)
      });
    }
    startTourElement.on('click', startTour);
    exit.on('click', endTour);
    introNext.on('click', scrollToFirstExample);
    firstExampleBack.on('click', scrollToIntro);
    firstExampleNext.on('click', scrollToSecondExample);
    secondExampleBack.on('click', scrollToFirstExample);
    secondExampleNext.on('click', scrollToFlagIntro);
    flagIntroBack.on('click', scrollToSecondExample);
    flagIntroNext.on('click', endTour);

    $(window).on('resize', onResize);

    months = incidentContainer.find('.date');
  }

  function init() {
    events.on('grid/complete', setBindings)
  }

  return {
    init: init
  }
});
