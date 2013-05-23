define([
  './flags',
  './events',
  './handlers',
  './grid',
  './tour',
  // dependencies
  './sharing-panel',
  './router',
  './tracking',
  './filters',
  './footer',
  'dropdown',
  'easing',
  './../utils/vertScrollTo'
], function(flags, events, handlers, grid, tour) {
  'use strict';

  function setBindings() {
    events.on('grid/complete', function() {
      // Deactivate the loading state
      document.body.classList.remove('loading');
    });
  }

  function init() {
    flags
      .load()
      .always(
        grid.build
      );

    handlers.setBindings();
    tour.init();

    setBindings();
  }

  return {
    init: init
  }
});
