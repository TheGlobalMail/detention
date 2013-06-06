define([
  'jquery',
  'lodash',
  './flags',
  './router',
  './models'
], function($, _, flags, router, models) {
  "use strict";

  // Disable for embedded
  if (window.embedded) return;

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
  // View these 2 incidents in Australian detention centres, and explore more LINK #detentionlogs via @TheGlobalMail
  var defaultTweet = 'View incidents in Australian detention centres, and explore more';
  var flaggedTweet = 'View these x incidents in Australian detention centres, and explore more';
  var facebookShares = {
    default:
      'Incidents in Australian detention centres, ' +
      'from a dump of detention logs obtained under FOI. ' +
      'Explore the logs at http://behindthewire.theglobalmail.org',
    singular:
      'This incident in an Australian detention centre is worth flagging, ' +
      'from a dump of detention logs obtained under FOI. ' +
      'Explore the logs at http://behindthewire.theglobalmail.org',
    plural:
      'Here are __count__ incidents in Australian detention centres worth flagging, ' +
      'from a dump of detention logs obtained under FOI. ' +
      'Explore the logs at http://behindthewire.theglobalmail.org'
  };

  var $twitterShare = $sharingPanel.find('li.twitter a');
  var $facebookShare = $sharingPanel.find('li.facebook a');
  var $embedShare = $sharingPanel.find('li.embed a');
  // hide all other modals when this is clicked
  $embedShare.click(function(){
    models.vent.trigger('modals:hide');
  });
  var $emailShare = $sharingPanel.find('li.email a');

  router.on('change', function(){
    var twitterText;
    var facebookText;
    var flagged = flags.flaggedIds().length;
    if (!flagged){
      twitterText = defaultTweet;
      facebookText = facebookShares.default;
    }else if (flagged === 1){
      twitterText = flaggedTweet.replace(/these x incidents/, 'an incident');
      facebookText = facebookShares.singular;
    }else{
      twitterText = flaggedTweet.replace(/x/, flagged);
      facebookText = facebookShares.plural.replace(/__count__/, flagged);
    }
    var twitterHref = $twitterShare.attr('href');
    var emailText = facebookText + ' ' + window.location;
    twitterHref = twitterHref.replace(/&text=.*$/, '');
    twitterHref += '&text=' + encodeURIComponent(twitterText);
    twitterHref += '&url=' + encodeURIComponent(window.location);
    $twitterShare.attr('href', twitterHref);
    var facebookHref = $facebookShare.attr('href');
    facebookHref = facebookHref.replace(/p\[summary\]=.*&/i, 'p[summary]=' + encodeURIComponent(facebookText) + '&');
    facebookHref = facebookHref.replace(/p\[url\]=.*$/i, 'p[url]=' + encodeURIComponent(window.location));
    $facebookShare.attr('href', facebookHref);
    var emailHref = 'mailto:info@theglobalmail.org?subject=' + encodeURIComponent($('title').text());
    emailHref += '&body=' + encodeURIComponent(emailText);
    $emailShare.attr('href', emailHref);

    $('#embed-share-link').val(window.location.href);
    $('#embed-share-message').val(facebookText.replace(/ Explore.*$/, ''));
    updateEmbedForm();
  });

  function updateEmbedForm(){
    var iframeLink = window.location.href.replace(/\/flagged\//i, '/embed/flagged/');
    iframeLink += '?m=' + encodeURIComponent($('#embed-share-message').val());
    var dimensions = $('#embed-share-dimensions').val().split('x');
    var iframe = '<iframe width="'+dimensions[0]+'" height="'+dimensions[1]+'" src="'+iframeLink+'"></iframe>';
    $('#embed-share-html').val(iframe);
  }

  // Setup embed form to update on change
  $('#embed-share-message,#embed-share-dimensions').on('change', updateEmbedForm);

  // Update the explanation text on the sharing panel if any incidents have
  // been flagged, and if so, was it by the user
  var $explanation = $('#flagging-explanation');
  router.on('change', function(){
    var text, css;
    if (!flags.anyFlags()){
      text = "Each square in the grid represents a single 'incident report'. The brightest incidents have been flagged by readers as being of concern. ";
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
    $sharingPanel.find('#show-next-flag').text('Show');
  });
  $sharingPanel.find('button.close').on('click tap', function(){
    $sharingPanel.attr('data-info-dismissed', 'true');
  });

  // Clicking on the flag icon scrolls to the first flagged event
  var currentFlagIndex = 0;
  var currentFlagCell = null;
  $sharingPanel.find('#show-next-flag').on('click', function(){
    var flaggedIncidents = flags.flaggedIncidents();
    if (!flaggedIncidents.length) return;
    if (currentFlagIndex >= flaggedIncidents.length){
      currentFlagIndex = 0;
    }
    var showIncident = flaggedIncidents[currentFlagIndex];
    if (currentFlagCell){
      currentFlagCell.removeAttr('data-being-shown');
    }
    currentFlagCell = $('.flagged[data-incident-number="' + showIncident.id + '"]');
    currentFlagCell.attr('data-being-shown', 'true');
    $.scrollTo(
      currentFlagCell,
      {
        duration: 500,
        offset: -140,
        easing: 'easeInOutQuad',
        complete: function() {
          currentFlagCell.trigger('mouseover');
        }
      }
    );
    currentFlagIndex++;
    if (flaggedIncidents.length > 1){
      $(this).text('Show Next');
    }else{
      $(this).text('Show');
    }
    models.vent.trigger('modals:hide');
  });

  flags.on('change', function(){
    if (currentFlagCell){
      if (!flags.isFlagged(currentFlagCell.data('incident-number'))){
        currentFlagCell.removeAttr('data-being-shown');
        currentFlagCell = null;
        currentFlagIndex = 0;
      }
    }
  });
});
