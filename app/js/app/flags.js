define([
  'jquery',
  'lodash',
  'backbone'
], function($, _){

  // Module emits the following events: `reload`
  var Flags = _.extend({}, Backbone.Events);

  // API url
  var api = 'http://detention-api.herokuapp.com';
  //var api = 'http://localhost:8080';

  // The current unnormalised flagged data
  var unnormalisedData = {};

  // The current max number of flaggings across all incidents
  var maxFlaggings = 0;

  // The current flagged data
  Flags.data = {};

  // Stores references to prior flaggings so they can be unflagged by this user
  Flags.previousFlags = {};

  // Load flags data from API. Returns Deferred object
  Flags.load = function(){
    return $.ajax(api + '/api/flagged')
      .done(function(data){
        unnormalisedData = data.flags;
        Flags.recalculateData();
      });
  };

  // Flags an event via the API. Returns Deferred object
  Flags.flag = function(id){
    return $.post(api + '/api/flag', {id: id})
      .done(function(data){
        Flags.previousFlags[id] = data.flag;
        Flags.data[id] = data.flagged;
        Flags.recalculateData();
      });
  };

  // Unflags an event via the API. Returns Deferred object
  Flags.unflag = function(id){
    var flag = Flags.previousFlags[id];
    Flags.previousFlags[id] = null;
    return $.post(api + '/api/unflag', {id: id, flag: flag})
      .done(function(data){
        Flags.data[id] = data.flagged;
        Flags.recalculateData();
      });
  };

  // Recaculate all of the flag weights and then trigger `reload` on the vent
  Flags.recalculateData = function(){
    maxFlaggings = _.max(_.values(unnormalisedData));
    if (!maxFlaggings || !isFinite(maxFlaggings)) maxFlaggings = 1;
    Flags.data = {};
    _.each(unnormalisedData, function(flagged, id){
      Flags.data[id] = flagged / maxFlaggings;
    });
    Flags.trigger('reload', Flags.data);
  };

  return Flags;
});
