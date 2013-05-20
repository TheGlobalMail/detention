define([
  'jquery'
], function($){
  'use strict';

  var scrollAnimation = {
    duration: 500,
    easing: 'easeInOutQuad'
  };

  $('.title .arrow').on('click', function(){
    $.scrollTo(
      '#' + $(this).data('next'),
      scrollAnimation
    );
  });

  $('.intro .arrow').on('click', function(){
    // Don't do anything unless loading has completed
    if ($('body').hasClass('loading')) {
      return;
    }

    $.scrollTo(
      '#' + $(this).data('next'),
      scrollAnimation
    );
  });


});
