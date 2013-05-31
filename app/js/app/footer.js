define([
  'jquery'
], function($) {
  "use strict";

  $('a[data-return-to-main]').on('click', function(e){
    e.preventDefault();
    $.scrollTo('#main', 1500);
  });
});
