define([
  'jquery',
  './flags',
], function($, flags){

  // Only continue if embedded
  if (!window.location.href.match(/\/embed/i)) return { embedded: false };

  function getParameterByName(name) {
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(window.location.search);
    return results ? decodeURIComponent(results[1].replace(/\+/g, " ")) : '';
  }

  var message = getParameterByName('m');
  $('#message').text(message);

  // When data is loaded, update the share in context url
  flags.on('load', function(){
    var sharedUrl = window.location.href.match(/flagged\/(.*)/i);
    var viewInContextUrl = '/';
    if (sharedUrl){
      viewInContextUrl += sharedUrl[0];
    }
    $('#view-in-context').attr('href', viewInContextUrl);
  });

  return {embedded: true};

});
