define([
  'jquery'
], function($){
  'use strict';

  $('section.title .arrow').on('click', function(){
    console.error('off to' + $(this).data('next'))
    $.scrollTo(
      '#' + $(this).data('next'),
      { duration: 500, easing: 'easeInOutQuad'}
    );
  });

  $('section.intro .arrow').on('click', function(){
    // Don't do anything unless loading has completed
    if ($('body').hasClass('loading')) return;

    $.scrollTo(
      '#' + $(this).data('next'),
      { duration: 500, easing: 'easeInOutQuad'}
    );
  });
});
