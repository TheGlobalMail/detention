define([
  'jquery',
  'lodash',
  './flags',
  'backbone'
], function($, _, flags){

  $(function(){
    Backbone.history.start({pushState: true});
  });

  // Listen to flag/unflag events and update the url with change
  flags.on('change', function(data, notMadeByUser){
    // Don't bother updating if change was triggered by a non user change
    if (notMadeByUser) return;

    var url = '/';
    if (flags.currentlyFlagged){
      url = 'flagged/' + flags.flaggedIds().join(',');
    }
    Backbone.history.navigate(url, {trigger: false, replace: true});

  });

  // When data is loaded, flag whatever ids are in the url
  flags.on('reload', function(){
    var sharedUrl = location.pathname.match(/flagged\/(.*)/i);
    if (sharedUrl){
      flags.setSharedFlags(sharedUrl[1].split(','));
    }
  });
});
