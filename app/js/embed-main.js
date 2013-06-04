define([
  './flags',
  './events',
  './grid',
  // dependencies
  './tracking',
  'easing'
], function(flags, events, grid) {
  'use strict';

  function setBindings() {
    events.on('grid/complete', function() {
      // Deactivate the loading state
      document.body.classList.remove('loading');
    });
  }

  function init() {
    $.when(embed.load(), flags.load())
      .always(grid.build);

    setBindings();
  }

  return {
    init: init
  }
});
