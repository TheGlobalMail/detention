define([
  './flags',
  './events',
  './handlers',
  './grid',
  './tour',
  'incidents',
  // dependencies
  './sharing-panel',
  './router',
  './tracking',
  './filters',
  './footer',
  'dropdown',
  'easing'
], function(flags, events, handlers, grid, tour, incidents) {
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
      .always(funciton(){
        grid.build(incidents);
      });

    handlers.setBindings();
    tour.init();

    setBindings();
  }

  return {
    init: init
  }
});
