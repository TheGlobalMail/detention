define([
  'jquery',
  'lodash',
  './flags',
  'backbone'
], function($, _, flags){

  // Emit `change` events for any module that uses url e.g. share buttons
  var vent = _.extend({}, Backbone.Events);

  $(function(){
    Backbone.history.start({pushState: true});
  });

  // Listen to flag/unflag events and update the url with change
  flags.on('change', function(data, notMadeByUser){
    // Don't bother updating if change was triggered by a non user change
    if (notMadeByUser) return;

    var url = '/';
    var ids = flags.flaggedIds();
    if (ids.length){
      url = 'flagged/' + ids.join(',');
    }
    Backbone.history.navigate(url, {trigger: false, replace: true});
    vent.trigger('change');
  });

  // When data is loaded, flag whatever ids are in the url
  flags.on('load', function(){
    var sharedUrl = location.pathname.match(/flagged\/(.*)/i);
    if (sharedUrl){
      flags.setSharedFlags(sharedUrl[1].split(','));
    }
    vent.trigger('change');
  });

  return vent;
});

