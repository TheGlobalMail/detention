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

  // The current flagged data
  Flags.data = {};

  // Stores references to prior flaggings so they can be unflagged by this user
  Flags.flaggedByUser = {};

  // Stores references to all flaggings (either by user or shared with them)
  Flags.flagged = {};

  // Stores references to prior flaggings so they can be unflagged by this user
  Flags.currentlyFlagged = 0;

  // Load flags data from API. Returns Deferred object
  Flags.load = function(){
    return $.ajax(api + '/api/flagged')
      .done(function(data){
        unnormalisedData = data.flags;
        Flags.recalculateData();
      });
  };

  // Checks if the incident is currently flagged
  Flags.isFlagged = function(id){
    return Flags.flagged[id];
  };

  // Returns a list of all incident ids that are flagged
  Flags.flaggedIds = function(){
    return _.keys(Flags.flagged).sort();
  };

  // Flags or unflags depending on current state
  Flags.toggleFlag = function(id){
    return !Flags.isFlagged(id) ? Flags.flag(id) : Flags.unflag(id);
  };

  // Flags an event via the API. Returns Deferred. Triggers `change` event
  Flags.flag = function(id, notMadeByUser){
    Flags.currentlyFlagged += 1;
    if (notMadeByUser){
      Flags.flagged[id] = notMadeByUser;
    }else{
      Flags.flaggedByUser[id] = 'pending';
      Flags.flagged[id] = 'pending';
    }
    Flags.trigger('change', Flags.currentlyFlagged, notMadeByUser);
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
    Flags.flagged[id] = null;
    if (Flags.currentlyFlagged > 0){
      Flags.currentlyFlagged = Flags.currentlyFlagged - 1;
    }
    // Only update the api if this user did actually flag this event
    if (Flags.flaggedByUser[id] && Flags.flaggedByUser[id] !== 'pending'){
      Flags.flaggedByUser[id] = null;
      defer = $.post(api + '/api/unflag', {id: id, flag: flag})
        .done(function(data){
          Flags.data[id] = data.flagged;
          Flags.recalculateData();
        });
    }
    Flags.trigger('change', Flags.currentlyFlagged);
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
      console.error('sharing for' + id);
      // check to see if ids is valid
      if (Flags.data[id]){
        console.error('flaggin!');
        Flags.flag(id, 'shared');
      }
    });
  };

  return Flags;
});
