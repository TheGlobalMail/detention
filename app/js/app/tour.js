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
  var flagIntroNext = flagIntro.find('.next');
  var flagIntroMonth;
  var flagIntroScrollTo;

  function startTour() {
    body.addClass('in-tour');
    tourContainer.addClass('show');
    positionElements();
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
    scrollToIntro();

    // First example
    firstExampleScrollTo = firstExampleMonth.offsetTop;
    firstExampleText.css({
      top: firstExampleScrollTo + (window.innerHeight - firstExampleText.height()) / 2,
      left: (window.innerWidth - firstExampleText.width()) / 2
    });
    firstExampleScrollTo += positionOnNearestCell(firstExampleMonth, firstExampleText);
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
    secondExampleScrollTo += positionOnNearestCell(secondExampleMonth, secondExampleText);
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
    flagIntroNext.css({
      top: flagIntroScrollTo + window.innerHeight - flagIntroNext.height() - 100,
      left: (window.innerWidth - flagIntroNext.width()) / 2
    });
  }

  function positionOnNearestCell(monthElement, tourTextElement) {
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

  function scrollToIntro() {
    $.scrollTo(introScrollTo, scrollDuration);
  }

  function scrollToFirstExample() {
    $.scrollTo(firstExampleScrollTo, scrollDuration);
  }

  function scrollToSecondExample() {
    $.scrollTo(secondExampleScrollTo, scrollDuration);
  }

  function scrollToFlagIntro() {
    $.scrollTo(flagIntroScrollTo, scrollDuration);
  }

  function endTour() {
    body.removeClass('in-tour');
    tourContainer.removeClass('show');
  }

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

    // TODO: scrap this
//    _.delay(startTour, 300);
  }

  function init() {
    events.on('grid/complete', setBindings)
  }

  return {
    init: init
  }
});