define([
  'jquery',
  'lodash',
  './flags',
  './router'
], function($, _, flags, router) {
  "use strict";

  var $flaggedCount = $('#flagged-count');

  // Update the number of incidents flagged on change
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

  // Add clear all flags button to sharing panel
  $('#clear-all-btn').on('click', flags.clearAll);

  // Update the text and urls for the tweet and facebook buttons on change
  var defaultTweet = 'Incidents in Australian detention centres that people should know about';
  var flaggedTweet = 'View these x incidents in Australian detention centres that I think people should know about';
  var $twitterShare = $('#sharing-panel li.twitter a');
  var $facebookShare = $('#sharing-panel li.facebook a');
  var $emailShare = $('#sharing-panel li.email a');
  router.on('change', function(){
    var text;
    var flagged = flags.flaggedIds().length;
    if (!flagged){
      text = defaultTweet;
    }else if (flagged === 1){
      text = flaggedTweet.replace(/these x incidents/, 'an incident');
    }else{
      text = flaggedTweet.replace(/x/, flagged);
    }
    var textWithLink = text + ' ' + window.location;
    var twitterHref = $twitterShare.attr('href');
    $twitterShare.attr('href', twitterHref.replace(/&text=.*$/, '') + '&text=' + encodeURIComponent(textWithLink));
    var facebookHref = $facebookShare.attr('href');
    facebookHref = facebookHref.replace(/p\[summary\]=.*&/i, 'p[summary]=' + encodeURIComponent(text) + '&');
    facebookHref = facebookHref.replace(/p\[url\]=.*$/i, 'p[url]=' + encodeURIComponent(window.location));
    $facebookShare.attr('href', facebookHref);
    var emailHref = 'mailto:info@theglobalmail.org?subject=' + encodeURIComponent($('title').text());
    emailHref += '&body=' + encodeURIComponent(textWithLink);
    $emailShare.attr('href', emailHref);
  });
});
