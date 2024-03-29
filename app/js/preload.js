(function(window, document, $){
  'use strict';

  var body = $('body');

  var embedded = window.location.href.match(/\/embed\//i);

  var navBar = $('.navbar');
  var introContainer = $('#intro-container');

  var title = introContainer.find('.title');
  var titleArrow = title.find('.arrow');
  var titleH1 = title.find('h1');
  var titleH2 = title.find('h2');

  var intro = introContainer.find('.intro');
  var introArrow = intro.find('.arrow');
  var introPara = intro.find('p');

  var incidents = $('#incidents');

  var scrollAnimationDuration = 500;

  var inPreLoad = true;

  function setBindings() {
    titleArrow.on('click', function(){
      var top = intro.offset().top;
      $.scrollTo(top, scrollAnimationDuration);
    });

    introArrow.on('click', function(){
      if (!localStorage.getItem('initialTourRun')) {
        return;
      }

      // Don't do anything unless we've left the loading state
      if (body.hasClass('loading')) {
        return;
      }

      var top = incidents.offset().top - 10;
      $.scrollTo(top, scrollAnimationDuration);
    });

    if (!embedded){
      $(window).resize(
        debouncer(scaleContainers, 100)
      );
    }
  }

  function debouncer(func, timeout) {
	  // Delays calling `func` until `timeout` has expired,
		// successive calls reset timeout and enforce the wait

    timeout = timeout || 200;
    var timeoutID = null;

    return function() {
      var scope = this;
      var args = arguments;

      clearTimeout(timeoutID);
      timeoutID = setTimeout(function() {
        func.apply(
          scope,
          Array.prototype.slice.call(args)
        );
      }, timeout);
    };
  }

  function scaleContainers() {
    // Increase the height of the header and intro sections such that
    // they fill the viewport, then vertically center their children.

    var titleHeight = window.innerHeight - navBar.outerHeight() - 1;
    title.css('min-height', titleHeight + 'px');

    var headerHeight = titleH1.height() + titleH2.outerHeight(true);
    var headerOffset = -30;
    titleH1.css('padding-top', ((titleHeight - headerHeight) / 2) + headerOffset + 'px');

    var introHeight = window.innerHeight;
    intro.css('min-height', introHeight + 'px');

    var childHeight = 0;
    introPara.each(function() {
      childHeight += $(this).outerHeight(true);
    });
    childHeight += introArrow.outerHeight(true);

    introPara.first()
      .css('padding-top', (introHeight - childHeight) / 2 + 'px');

    if (inPreLoad) {
      setTimeout(endPreLoad, 0);
    }
  }

  function endPreLoad() {
    // Let the initial content display
    inPreLoad = false;
    body.removeClass('pre-load');
  }

  setBindings();
  if (!embedded){
    scaleContainers();
  }else{
    endPreLoad();
  }

})(window, document, jQuery);
