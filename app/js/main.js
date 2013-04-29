requirejs.config({
  paths: {
    jquery: '../components/jquery/jquery',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone',
    kinetic: 'libs/kinetic',
    jquery_inwindow: '../components/inwindow/jquery.inwindow'
  }
});

requirejs([
  'jquery',
  'app/main'
],
function ($, app) {
  $(app.init);
});