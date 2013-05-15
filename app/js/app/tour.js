define([
  'jquery',
  'lodash',
  './grid',
  './events'
], function($, _, grid, events) {
  "use strict";

  var scrollDuration = 1000;

  var body = $('body');

  var incidentContainer = $('#incidents');

  var tourContainer = $('.tour-container');
  var backdrop = tourContainer.find('.backdrop');
  var exit = tourContainer.find('.exit');

  var intro = tourContainer.find('.intro');
  var introText = intro.find('.text-container');
  var introNext = intro.find('.next');

  var firstExample = tourContainer.find('.first-example');
  var firstExampleText = firstExample.find('.text-container');
  var firstExampleNext = firstExample.find('.next');
  var firstExampleCell;

  var secondExample = tourContainer.find('.second-example');
  var secondExampleText = secondExample.find('.text-container');
  var secondExampleNext = secondExample.find('.next');
  var secondExampleCell;

  var flagIntro = tourContainer.find('.flag-intro');
  var flagIntroText = flagIntro.find('.text-container');
  var flagIntroNext = flagIntro.find('.next');
  var flagIntroCell;

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
    incidentTop = firstExampleCell.element.offsetTop;
    firstExampleText.css({
      top: incidentTop + (window.innerHeight - firstExampleText.height()) / 2,
      left: (window.innerWidth - firstExampleText.width()) / 2
    });
    firstExampleNext.css({
      top: incidentTop + window.innerHeight - firstExampleNext.height() - 100,
      left: (window.innerWidth - firstExampleNext.width()) / 2
    });

    // Second example
    incidentTop = secondExampleCell.element.offsetTop;
    secondExampleText.css({
      top: incidentTop + (window.innerHeight - secondExampleText.height()) / 2,
      left: (window.innerWidth - secondExampleText.width()) / 2
    });
    secondExampleNext.css({
      top: incidentTop + window.innerHeight - secondExampleNext.height() - 100,
      left: (window.innerWidth - secondExampleNext.width()) / 2
    });
    
    // Flagging introduction
    incidentTop = flagIntroCell.element.offsetTop;
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
    $.scrollTo(firstExampleCell.element.offsetTop, scrollDuration);
  }

  function scrollToSecondExample() {
    $.scrollTo(secondExampleCell.element.offsetTop, scrollDuration);
  }

  function scrollToFlagIntro() {
    $.scrollTo(flagIntroCell.element.offsetTop, scrollDuration);
  }

  function endTour() {
    body.removeClass('in-tour');
    tourContainer.removeClass('show');
  }

  function getCellByIncident(incident) {
    var cells = grid.grid.cells;
    for (var i=0; i < cells.length; i++) {
      var cell = cells[i];
      if (cell.data.id === incident) {
        return cell;
      }
    }
  }

  function setBindings() {
    introNext.on('click', scrollToFirstExample);
    firstExampleNext.on('click', scrollToSecondExample);
    secondExampleNext.on('click', scrollToFlagIntro);

    backdrop.on('click', endTour);
    exit.on('click', endTour);
    flagIntroNext.on('click', endTour);

    firstExampleCell = getCellByIncident('1-3KY9NP');
    secondExampleCell = getCellByIncident('1-5K4R74');
    flagIntroCell = getCellByIncident('1-73O4A6');

    // TODO: remove this
//    _.delay(startTour, 300);
  }
  function init() {
    events.on('grid/complete', setBindings)
  }

  return {
    init: init
  }
});