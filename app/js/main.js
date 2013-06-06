requirejs.config({
  paths: {
    jquery: './utils/jquery',
    scrollto: '../components/jquery.scrollTo/jquery.scrollTo',
    easing: '../components/jquery-easing/jquery.easing',
    touchSwipe: '../components/jquery-touchswipe/jquery.touchSwipe',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone',
    moment: '../components/moment/moment',
    dropdown: '../components/bootstrap/js/bootstrap-dropdown',
    incidents: './data/incidents'
  },
  shim: {
    backbone: { deps: ['jquery', 'lodash'] },
    tooltips: { deps: ['jquery'] },
    easing: { deps: ['jquery'] },
    scrollto: { deps: ['jquery'] }
  }
});

requirejs([
  'jquery',
  './utils/shims',
  './app/main',
  'touchSwipe'
],
function ($, shims, app) {
  shims();
  $(app.init);
});
