define([
  './requestAnimationFrame',
  './classList'
], function(requestAnimationFrame, classList) {
  "use strict";

  return function() {
    requestAnimationFrame();
    classList()
  }
});