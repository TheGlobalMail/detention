define([
  'jquery',
  './flags',
], function($, flags){

  // Only continue if embedded
  if (!window.embedded) return;
  
  // When data is loaded, update the share in context url
  flags.on('load', function(){
    var sharedUrl = location.href.match(/flagged\/(.*)/i);
    var viewInContextUrl = '/';
    if (sharedUrl){
      viewInContextUrl += sharedUrl[0];
    }
    $('#view-in-context').attr('href', viewInContextUrl);
  });

});
