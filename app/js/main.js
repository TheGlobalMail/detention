requirejs.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone'
  }
});

requirejs([
  'jquery',
  'utils/requestAnimationFrame',
  'app/main'
],
function ($, utils, app) {
  $(app.init);
});