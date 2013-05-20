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

  var scrollAnimation = {
    duration: 500,
    easing: 'easeInOutQuad'
  };

  function setBindings() {
    titleArrow.on('click', function(){
      $.scrollTo(
        titleArrow.data('next'),
        scrollAnimation
      );
    });

    introArrow.on('click', function(){
      // Don't do anything unless loading has completed
      if ($('body').hasClass('loading')) {
        return;
      }

      $.scrollTo(
        introArrow.data('next'),
        scrollAnimation
      );
    });
  }

  function scaleContainers() {
    var titleHeight = window.innerHeight - navBar.outerHeight() - 1;
    title.css('height', titleHeight);

    var headerHeight = titleH1.outerHeight(true) + titleH2.outerHeight(true);
    var headerOffset = -30;
    titleH1.css(
      'padding-top',
      ((titleHeight - headerHeight) / 2) + headerOffset
    );

    var introHeight = window.innerHeight;
    intro.css('height', introHeight);

    var paraHeight = 0;
    _.each(introPara, function(element) {
      paraHeight += $(element).outerHeight(true);
    });
    var paraOffset = -8;
    introPara
      .first()
      .css(
        'padding-top',
        ((introHeight - paraHeight) / 2) + paraOffset
      );

    body.removeClass('pre-load');
  }

  setBindings();
  scaleContainers();
  $(window).on('resize', _.debounce(scaleContainers, 50));
});
