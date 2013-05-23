define([
  './requestAnimationFrame',
  './classList'
], function(requestAnimationFrame) {
  "use strict";

  return function() {
    requestAnimationFrame();
  }
});