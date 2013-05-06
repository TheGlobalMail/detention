requirejs.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone',
    moment: '../components/moment/moment'
  }
});

requirejs([
  'jquery',
  './utils/shims',
  './app/main'
],
function ($, shims, app) {
  shims();
  $(app.init);
});
