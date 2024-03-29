define([
  './flags',
  './events',
  './handlers',
  './grid',
  './tour',
  './embed',
  // dependencies
  './sharing-panel',
  './router',
  './tracking',
  './filters',
  './footer',
  'dropdown',
  'easing'
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
      .always(grid.build);

    if (!window.embedded){
      handlers.setBindings();
      tour.init();
    }

    setBindings();
  }

  return {
    init: init
  }
});
