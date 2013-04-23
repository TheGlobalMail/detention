requirejs.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone'
  }
});

requirejs([
  'jquery',
  'app/main'
],
function ($, app) {
  $(app.init);
});