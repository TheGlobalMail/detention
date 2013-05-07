requirejs.config({
  paths: {
    jquery: '../components/jquery/jquery',
    xdr: './utils/xdr',
    lodash: '../components/lodash/lodash',
    backbone: '../components/backbone/backbone',
    moment: '../components/moment/moment',
    dropdown: '../components/bootstrap/js/bootstrap-dropdown'
  },
  shim: {
    xdr: { deps: ['jquery'] },
    tooltips: { deps: ['jquery'] }
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
