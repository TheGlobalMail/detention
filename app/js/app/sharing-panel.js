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
      text = 'No incidents ';
    }else if (flagged === 1){
      text = '1 incident ';
    }else{
      text = flagged.toString() + ' incidents ';
    }
    text += ' have been flagged';
    $flaggedCount.text(text);
  });

  $('#clear-all-btn').on('click', flags.clearAll);
});
