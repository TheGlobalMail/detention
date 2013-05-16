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

  var firstExample = tourContainer.find('.first-example');
  var firstExampleText = firstExample.find('.text-container');
  var firstExampleNext = firstExample.find('.next');
  var firstExampleMonth;

  var secondExample = tourContainer.find('.second-example');
  var secondExampleText = secondExample.find('.text-container');
  var secondExampleNext = secondExample.find('.next');
  var secondExampleMonth;

  var flagIntro = tourContainer.find('.flag-intro');
  var flagIntroText = flagIntro.find('.text-container');
  var flagIntroNext = flagIntro.find('.next');
  var flagIntroMonth;

  function startTour() {
    body.addClass('in-tour');
    tourContainer.addClass('show');

    // Introduction
    var incidentTop = incidentContainer.offset().top;
    introText.css({
      top: incidentTop + (window.innerHeight - introText.height()) / 2,
      left: (window.innerWidth - introText.width()) / 2
    });
    introNext.css({
      top: incidentTop + window.innerHeight - introNext.height() - 100,
      left: (window.innerWidth - introNext.width()) / 2
    });
    $.scrollTo(incidentTop, scrollDuration);

    // First example
    incidentTop = firstExampleMonth.offsetTop;
    // TODO: lineup cell with nearest one
    firstExampleText.css({
      top: incidentTop + (window.innerHeight - firstExampleText.height()) / 2,
      left: (window.innerWidth - firstExampleText.width()) / 2
    });
    firstExampleNext.css({
      top: incidentTop + window.innerHeight - firstExampleNext.height() - 100,
      left: (window.innerWidth - firstExampleNext.width()) / 2
    });

    // Second example
    incidentTop = secondExampleMonth.offsetTop;
    secondExampleText.css({
      top: incidentTop + (window.innerHeight - secondExampleText.height()) / 2,
      left: (window.innerWidth - secondExampleText.width()) / 2
    });
    secondExampleNext.css({
      top: incidentTop + window.innerHeight - secondExampleNext.height() - 100,
      left: (window.innerWidth - secondExampleNext.width()) / 2
    });

    // Flagging introduction
    incidentTop = flagIntroMonth.offsetTop;
    flagIntroText.css({
      top: incidentTop + (window.innerHeight - flagIntroText.height()) / 2,
      left: (window.innerWidth - flagIntroText.width()) / 2
    });
    flagIntroNext.css({
      top: incidentTop + window.innerHeight - flagIntroNext.height() - 100,
      left: (window.innerWidth - flagIntroNext.width()) / 2
    });
  }

  function scrollToFirstExample() {
    $.scrollTo(firstExampleMonth.offsetTop, scrollDuration);
  }

  function scrollToSecondExample() {
    $.scrollTo(secondExampleMonth.offsetTop, scrollDuration);
  }

  function scrollToFlagIntro() {
    $.scrollTo(flagIntroMonth.offsetTop, scrollDuration);
  }

  function endTour() {
    body.removeClass('in-tour');
    tourContainer.removeClass('show');
  }

  function setBindings() {
    introNext.on('click', scrollToFirstExample);
    firstExampleNext.on('click', scrollToSecondExample);
    secondExampleNext.on('click', scrollToFlagIntro);

    backdrop.on('click', endTour);
    exit.on('click', endTour);
    flagIntroNext.on('click', endTour);

    var months = incidentContainer.find('.date');
    firstExampleMonth = months.get(8);
    secondExampleMonth = months.get(13);
    flagIntroMonth = months.get(18);

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