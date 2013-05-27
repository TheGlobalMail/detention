requirejs.config({
  paths: {
    jquery: './utils/jquery',
    scrollto: '../components/jquery.scrollTo/jquery.scrollTo',
    easing: '../components/jquery-easing/jquery.easing',
    touchSwipe: '../components/jquery-touchswipe/jquery.touchSwipe',
    xdr: './utils/xdr',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone',
    moment: '../components/moment/moment',
    dropdown: '../components/bootstrap/js/bootstrap-dropdown',
    incidents: './data/incidents'
  },
  shim: {
    backbone: { deps: ['jquery', 'lodash'] },
    xdr: { deps: ['jquery'] },
    tooltips: { deps: ['jquery'] },
    easing: { deps: ['jquery'] },
    scrollto: { deps: ['jquery'] }
  }
});

requirejs([
  'jquery',
  'xdr',
  './utils/shims',
  './app/main'
],
function ($, xdr, shims, app) {
  window.XDR_DEBUG = true;
  shims();
  $(app.init);
});
