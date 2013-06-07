define([
  'jquery',
  './flags',
  './models'
], function($, flags, models){

  flags.on('flag', function(id){
    window._gaq && _gaq.push(['_trackEvent', 'Flag', 'ID', id]);
  });

  flags.on('unflag', function(id){
    window._gaq && _gaq.push(['_trackEvent', 'Unflag', 'ID', id]);
  });

  models.vent.on('incident-displayed', function(id){
    window._gaq && _gaq.push(['_trackEvent', 'Incident', 'ID', id]);
  });

  models.vent.on('adopt-clicked', function(id){
    window._gaq && _gaq.push(['_trackEvent', 'Adopt', 'ID', id]);
  });


});
