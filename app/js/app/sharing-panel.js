define([
  'jquery',
  'lodash',
  './flags',
  './router'
], function($, _, flags, router) {
  "use strict";

  var $flaggedCount = $('#flagged-count');
  var $sharingPanel = $('#sharing-panel');

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

  // Update the explanation text on the sharing panel if any incidents have
  // been flagged, and if so, was it by the user
  var $explanation = $('#flagging-explanation');
  router.on('change', function(){
    var text, css;
    if (!flags.anyFlags()){
      text = "Each square in the grid represents a single 'incident report'. The brightest incidents have been flagged by readers as being of particular interest or concern. View an incident to flag it yourself. ";
      css = 'noflags';
    }else if (!flags.anyUserFlags()){
      text = 'Incidents that have been flagged as being of particular interest or concern are displayed in the grid with this icon. View an incident to flag it yourself. ';
      css = 'sharedflags';
    }else{
      text = 'Flagged incidents are displayed in the grid with this icon. Share your flagged incidents using the buttons on the right. ';
      css = 'userflags';
    }
    $sharingPanel.attr('class', $sharingPanel.attr('class').replace(/\w*flags/, css));
    $explanation.text(text);
  });
  $sharingPanel.find('button.close').on('click tap', function(){
    $sharingPanel.attr('data-info-dismissed', 'true');
  });
});
