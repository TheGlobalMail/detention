define([
  'jquery',
  'lodash',
  'backbone'
], function($, _){

  var Flags = {};

  // API url
  var api = 'http://detention-api.herokuapp.com';
  //var api = 'http://localhost:8080';

  // The current unnormalised flagged data
  var unnormalisedData = {};

  // The current max number of flaggings across all incidents
  var maxFlaggings = 0;

  // The current flagged data
  Flags.data = {};

  // Stores references to any previous flaggings made in this session so that
  // they can be unflagged by this user
  Flags.previousFlags = {};

  // Load all data described which incidents have been flagged
  // Returns a promise that is fulfilled when the data is returned from the API
  Flags.load = function(){
    var defer = $.Deferred();
    $.ajax(api + '/api/flagged')
      .done(function(data){
        unnormalisedData = data.flags;
        Flags.recalculateData();
        defer.resolve();
      })
      .fail(defer.reject);
    return defer;
  };

  // Flags an event via the API
  Flags.flag = function(id){
    var defer = $.Deferred();
    $.post(api + '/api/flag', {id: id})
      .done(function(data){
        Flags.previousFlags[id] = data.flag;
        Flags.data[id] = data.flagged;
        defer.resolve();
      })
      .fail(defer.reject);
    return defer;
  };

  // Unflags an event via the API
  Flags.unflag = function(id){
  };

  // An event emmitter that triggers the following events:
  // * `reload`
  Flags.vent = _.extend({}, Backbone.Events);

  Flags.recalculateData = function(){
    maxFlaggings = _.max(_.values(unnormalisedData));
    if (!maxFlaggings || !isFinite(maxFlaggings)) maxFlaggings = 1;
    Flags.data = {};
    _.each(unnormalisedData, function(flagged, id){
      Flags.data[id] = flagged / maxFlaggings;
    });
    Flags.vent.trigger('reload', Flags.data);
  };

  return Flags;
});
