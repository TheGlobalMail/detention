define([
  'jquery',
  'lodash',
  './flags'
], function($, _, flags) {
  "use strict";

  var $flaggedCount = $('#flagged-count');

  flags.on('change', function(flagged){
    var text;
    if (!flagged){
      text = 'No incidents have';
    }else if (flagged === 1){
      text = '1 incident has';
    }else{
      text = flagged.toString() + ' incidents have';
    }
    text += ' been flagged';
    $flaggedCount.text(text);
  });

  $('#clear-all-btn').on('click', flags.clearAll);
});
