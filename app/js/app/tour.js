define([
  'jquery',
  'lodash',
  './grid',
  './events',
  'incidents'
], function($, _, grid, events, incidents) {
  "use strict";

  var scrollDuration = 1000;

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
  var flagIntroSecondary = flagIntro.find('.secondary-container');
  var flagIntroNext = flagIntroSecondary.find('.next');
  var flagIntroImage = flagIntroSecondary.find('img');
  var flagIntroMonth;
  var flagIntroScrollTo;

  var scrollCallbackIndex = 0;
  var scrollCallbacks = [];

  function startTour() {
    body.addClass('in-tour');
    tourContainer.addClass('show');
    positionElements();
//    scrollToIntro();
    scrollToFlagIntro()
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
    firstExampleScrollTo += positionCellOnNearestCell(firstExampleMonth, firstExampleText);
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
    secondExampleScrollTo += positionCellOnNearestCell(secondExampleMonth, secondExampleText);
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
    flagIntroSecondary.css({
      top: flagIntroScrollTo + window.innerHeight - flagIntroSecondary.height() - 100,
      left: (window.innerWidth - flagIntroSecondary.width()) / 2
    });
    var $monthElement = $(flagIntroMonth);
    var monthOffset = $monthElement.offset();
    var cells = $monthElement.find('.cell');
    var testCell = cells.first();
    var cellWidth = testCell.outerWidth(true);
    var flagIntroImageOffset = flagIntroImage.offset();
    // Find the nearest cell below the tour cell
    var cellsPerRow = Math.floor($monthElement.width() / cellWidth);
    var cellCountFromLeft = Math.floor((flagIntroImageOffset.left - monthOffset.left) / cellWidth);
    var cellRowCountFromTop = Math.floor((flagIntroImageOffset.top - monthOffset.top) / cellWidth);
    var nearestCellIndex = (cellRowCountFromTop * cellsPerRow) + cellCountFromLeft;
    var nearestCell = $(cells.get(nearestCellIndex));
    // Find the positional difference between the nearest cell and tour cell
    var nearestCellOffset = nearestCell.offset();
    var leftDifference = nearestCellOffset.left - flagIntroImageOffset.left;
    var topDifference = nearestCellOffset.top - flagIntroImageOffset.top;
    // Shift the cell inline with the nearest cell
    flagIntroImage
      .css({
        'top': topDifference,
        'left': leftDifference
      });
    flagIntroNext.css('top', topDifference);
  }

  function positionCellOnNearestCell(monthElement, tourTextElement) {
    var $monthElement = $(monthElement);
    var monthOffset = $monthElement.offset();
    var cells = $monthElement.find('.cell');
    var testCell = cells.first();
    var cellWidth = testCell.outerWidth(true);
    var tourCell = tourTextElement.find('.cell');
    var tourCellOffset = tourCell.offset();
    // Find the nearest cell below the tour cell
    var cellsPerRow = Math.floor($monthElement.width() / cellWidth);
    var cellCountFromLeft = Math.floor((tourCellOffset.left - monthOffset.left) / cellWidth);
    var cellRowCountFromTop = Math.floor((tourCellOffset.top - monthOffset.top) / cellWidth);
    var nearestCellIndex = (cellRowCountFromTop * cellsPerRow) + cellCountFromLeft;
    var nearestCell = $(cells.get(nearestCellIndex));
    // Find the positional difference between the nearest cell and tour cell
    var nearestCellOffset = nearestCell.offset();
    var leftDifference = nearestCellOffset.left - tourCellOffset.left;
    var topDifference = nearestCellOffset.top - tourCellOffset.top;
    // Shift the cell and the pull quote inline with the nearest cell
    var pullQuote = tourTextElement.find('.pullquote');
    tourCell
      .add(pullQuote)
      .css({
        'top': topDifference,
        'left': leftDifference
      });
    tourTextElement.find('p')
      .css({
        'top': topDifference
      });
    return topDifference
  }

  var scrollToIntro = _.throttle(function() {
    scrollCallbackIndex = 0;
    $.scrollTo(introScrollTo, scrollDuration);
  }, scrollDuration);
  scrollCallbacks.push(scrollToIntro);

  var scrollToFirstExample = _.throttle(function() {
    scrollCallbackIndex = 1;
    $.scrollTo(firstExampleScrollTo, scrollDuration);
  }, scrollDuration);
  scrollCallbacks.push(scrollToFirstExample);

  var scrollToSecondExample = _.throttle(function() {
    scrollCallbackIndex = 2;
    $.scrollTo(secondExampleScrollTo, scrollDuration);
  }, scrollDuration);
  scrollCallbacks.push(scrollToSecondExample);

  var scrollToFlagIntro = _.throttle(function() {
    scrollCallbackIndex = 3;
    $.scrollTo(flagIntroScrollTo, scrollDuration);
  }, scrollDuration);
  scrollCallbacks.push(scrollToFlagIntro);

  function endTour() {
    body.removeClass('in-tour');
    tourContainer.removeClass('show');
  }

  var onResize = _.debounce(function() {
    positionElements();
    scrollCallbacks[scrollCallbackIndex]();
  }, 100);

  function setBindings() {
    introNext.on('click', scrollToFirstExample);
    firstExampleNext.on('click', scrollToSecondExample);
    secondExampleNext.on('click', scrollToFlagIntro);

//    backdrop.on('click', endTour);
    exit.on('click', endTour);
    flagIntroNext.on('click', endTour);

    var months = incidentContainer.find('.date');
    firstExampleMonth = months.get(8);
    secondExampleMonth = months.get(13);
    flagIntroMonth = months.get(16);

    $('.start-tour').on('click', startTour);

    $(window).on('resize', onResize);

    // TODO: scrap this
    _.delay(startTour, 300);
  }

  function init() {
    events.on('grid/complete', setBindings)
  }

  return {
    init: init
  }
});