define([
  'jquery',
  'lodash',
  'backbone'
], function($, _){

  // Module emits the following events: `reload`, `change`
  var Flags = _.extend({}, Backbone.Events);

  // API url
  var api = 'http://detention-api.herokuapp.com';
  //var api = 'http://localhost:8080';

  // The current unnormalised flagged data
  var unnormalisedData = {};

  // The current max number of flaggings across all incidents
  var maxFlaggings = 0;

  // Flagged data from the API. Key is incident id and value is # of flaggings
  Flags.data = {};

  // Stores references to prior flaggings so they can be unflagged by this user
  Flags.flaggedByUser = {};

  // Stores references to all flaggings (either by user or shared with them)
  Flags.flagged = {};

  // True if any data is loaded
  Flags.loaded = false;

  // Load flags data from API. Returns Deferred object
  Flags.load = function(){
    return $.ajax(api + '/api/flagged')
      .done(function(data){
        Flags.loaded = true;
        unnormalisedData = data.flags;
        Flags.recalculateData();
        Flags.trigger('load');
      });
  };

  // Checks if the incident is currently flagged
  Flags.isFlagged = function(id){
    return Flags.flagged[id];
  };

  // Checks if the incident is currently flagged by this user
  Flags.isUserFlagged = function(id){
    return Flags.flaggedByUser[id];
  };

  // Returns a list of all incident ids that are flagged
  Flags.flaggedIds = function(){
    return _.keys(Flags.flagged).sort();
  };

  // Returns true if there are any flags
  Flags.anyFlags = function(){
    return !_.isEmpty(Flags.flagged);
  };

  // Returns true if there are any flags
  Flags.anyUserFlags = function(){
    return !_.isEmpty(Flags.flaggedByUser);
  };

  // Flags or unflags depending on current state
  Flags.toggleFlag = function(id){
    return !Flags.isFlagged(id) ? Flags.flag(id) : Flags.unflag(id);
  };

  // Flags an event via the API. Returns Deferred. Triggers `change` event
  Flags.flag = function(id, notMadeByUser){
    if (_.isNull(Flags.data[id])){
      return;
    }
    if (notMadeByUser){
      Flags.flagged[id] = notMadeByUser;
    }else{
      Flags.flaggedByUser[id] = 'pending';
      Flags.flagged[id] = 'pending';
    }
    // Do this quickly here so that the counts update before the server
    // responds. The final server response will correct any errors
    unnormalisedData[id] = (unnormalisedData[id] || 0) + 1;
    Flags.trigger('change', _.keys(Flags.flagged).length, notMadeByUser);
    Flags.trigger('flag', id);
    if (!notMadeByUser){
      return $.post(api + '/api/flag', {id: id})
        .done(function(data){
          Flags.flaggedByUser[id] = data.flag;
          Flags.flagged[id] = data.flag;
          Flags.data[id] = data.flagged;
          Flags.recalculateData();
        });
    }
  };

  // Unflags an event via the API. Returns Deferred or null. Triggers `change` event
  Flags.unflag = function(id){
    var defer;
    var flag = Flags.flaggedByUser[id];
    delete Flags.flagged[id];
    if (Flags.flaggedByUser[id] && Flags.flaggedByUser[id] !== 'pending'){
      unnormalisedData[id] = unnormalisedData[id] - 1;
      delete Flags.flaggedByUser[id];
      defer = $.post(api + '/api/unflag', {id: id, flag: flag})
        .done(function(data){
          Flags.data[id] = data.flagged;
          Flags.recalculateData();
        });
    }
    Flags.trigger('change', _.keys(Flags.flagged).length);
    Flags.trigger('unflag', id);
    return defer;
  };

  // Unflags all events. User flagged events update the api. Triggers `change`
  Flags.clearAll = function(){
    _.each(Flags.flagged, function(flag, id){
      Flags.unflag(id);
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

  // Flag incidents that were shared
  Flags.setSharedFlags = function(ids){
    _.each(ids, function(id){
      Flags.flag(id, 'shared');
    });
  };
  
  // Flag incidents that were shared
  Flags.numberOfTimesFlagged = function(id){
    return unnormalisedData[id] || 0;
  };

  return Flags;
});
