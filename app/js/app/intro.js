define([
  'jquery',
  'lodash'
], function($, _){
  'use strict';

  var body = $('body');

  var navBar = $('.navbar');
  var introContainer = $('#intro-container');

  var title = introContainer.find('.title');
  var titleArrow = title.find('.arrow');
  var titleH1 = title.find('h1');
  var titleH2 = title.find('h2');

  var intro = introContainer.find('.intro');
  var introArrow = intro.find('.arrow');
  var introPara = intro.find('p');

  var prevHeight;
  var prevWidth;

  var scrollAnimation = {
    duration: 500,
    easing: 'easeInOutQuad'
  };

  var inPreLoad = true;

  function setBindings() {
    titleArrow.on('click', function(){
      var top = $(titleArrow.data('next')).offset().top;
      $.scrollTo(top, scrollAnimation);
    });

    introArrow.on('click', function(){
      // Don't do anything unless loading has completed
      if ($('body').hasClass('loading')) {
        return;
      }

      var top = $(introArrow.data('next')).offset().top;
      $.scrollTo(top, scrollAnimation);
    });
  }

  function scaleContainers() {
    // Increase the height of the header and intro sections such that
    // they fill the viewport, then vertically center their children.

    if (
      prevHeight !== window.innerHeight &&
      prevWidth !== window.innerWidth
    ) {
      prevHeight = window.innerHeight;
      prevWidth = window.innerWidth;

      var titleHeight = window.innerHeight - navBar.outerHeight() - 1;
      title.css('min-height', titleHeight);

      var headerHeight = titleH1.outerHeight(true) + titleH2.outerHeight(true);
      var headerOffset = -30;
      titleH1.css(
        'padding-top',
        ((titleHeight - headerHeight) / 2) + headerOffset
      );

      var introHeight = window.innerHeight;
      intro.css('min-height', introHeight);

      var childHeight = 0;
      _.each(introPara, function(element) {
        childHeight += $(element).outerHeight(true);
      });
      childHeight += introArrow.outerHeight(true);
      var paddingTop = ((introHeight - childHeight) / 2);
      introPara.first()
        .css('padding-top', paddingTop);

      if (inPreLoad) {
        _.defer(endPreLoad);
      }
    }
  }

  function endPreLoad() {
    // Let the initial content display
    inPreLoad = false;
    body.removeClass('pre-load');
  }

  setBindings();
  scaleContainers();
  $(window).on('resize', _.debounce(scaleContainers, 50));
});
