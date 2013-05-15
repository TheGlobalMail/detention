define([
  './flags',
  './sharing-panel',
  './router',
  './tracking',
  './events',
  './handlers',
  './grid',
  './tour',
  // dependencies
  './filters',
  './footer',
  'dropdown',
  'easing'
], function(flags, sharingPanel, router, tracking, events, handlers, grid, tour) {
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
