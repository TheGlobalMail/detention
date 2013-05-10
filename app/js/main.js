requirejs.config({
  paths: {
    jquery: '../components/jquery/jquery',
    scrollto: '../components/jquery.scrollTo/jquery.scrollTo',
    xdr: './utils/xdr',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone',
    moment: '../components/moment/moment',
    dropdown: '../components/bootstrap/js/bootstrap-dropdown'
  },
  shim: {
    xdr: { deps: ['jquery'] },
    tooltips: { deps: ['jquery'] },
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
  shims();
  $(app.init);
});
