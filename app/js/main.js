requirejs.config({
  paths: {
    jquery: '../components/jquery/jquery',
    scrollto: '../components/jquery.scrollTo/jquery.scrollTo',
    easing: '../components/jquery-easing/jquery.easing',
    touch: '../components/jqueryui-touch-punch/jquery.ui.touch-punch',
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
    touch: { deps: ['jquery'] },
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
