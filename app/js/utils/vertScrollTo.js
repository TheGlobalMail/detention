define([
  'jquery',
  'lodash'
], function($, _) {
  "use strict";

  $.scrollTo = function(selector, options) {

    var elementToScroll = $('html,body');
    var offsetTop;

    if (typeof selector === 'string') {
      offsetTop = $(selector).offset().top;
    } else if (typeof selector === 'number') {
      offsetTop = selector
    } else {
      offsetTop = selector.offset().top;
    }

    var defaultOptions = {
      duration: 0
    };

    if (typeof options === 'number') {
      options = {
        'duration': options
      };
    }

    elementToScroll.animate(
      {scrollTop: offsetTop},
      _.extend(defaultOptions, options)
    );

    return this;
  };
});