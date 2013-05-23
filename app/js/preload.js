(function(window, document){
  'use strict';

  var body = document.body;

  var navBar = body.getElementsByClassName('navbar')[0];
  var introContainer = document.getElementById('intro-container');

  var title = introContainer.getElementsByClassName('title')[0];
  var titleArrow = title.getElementsByClassName('arrow')[0];
  var titleH1 = title.getElementsByTagName('h1')[0];
  var titleH2 = title.getElementsByTagName('h2')[0];

  var intro = introContainer.getElementsByClassName('intro')[0];
  var introArrow = intro.getElementsByClassName('arrow')[0];
  var introPara = intro.getElementsByTagName('p');

  var incidents = document.getElementById('incidents');

  var scrollAnimationDuration = 500;

  var inPreLoad = true;

  function scrollTo(element, to, duration) {
    var start = element.scrollTop;
    var change = to - start;
    var currentTime = 0;
    var increment = 20;

    var easeInOutQuad = function(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    };

    var animateScroll = function(){
      currentTime += increment;
      element.scrollTop = easeInOutQuad(currentTime, start, change, duration);
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  function setBindings() {
    titleArrow.addEventListener('click', function(){
      var top = intro.offsetTop + navBar.clientHeight;
      scrollTo(body, top, scrollAnimationDuration);
    });

    introArrow.addEventListener('click', function(){

      // Don't do anything unless we've left the loading state
      if (body.classList.contains('loading')) {
        return;
      }

      var top = incidents.offsetTop - 10;
      scrollTo(body, top, scrollAnimationDuration);
    });
  }

  function scaleContainers() {
    // Increase the height of the header and intro sections such that
    // they fill the viewport, then vertically center their children.

    var titleHeight = window.innerHeight - navBar.clientHeight - 1;
    title.style.minHeight = titleHeight + 'px';

    var headerHeight = titleH1.clientHeight +
      titleH2.clientHeight +
      parseInt(getComputedStyle(titleH2)['margin-top']);
    var headerOffset = -30;
    titleH1.style.paddingTop = ((titleHeight - headerHeight) / 2) + headerOffset + 'px';

    var introHeight = window.innerHeight;
    intro.style.minHeight = introHeight + 'px';

    var childHeight = 0;
    for (var i=0; i < introPara.length; i++) {
      var para = introPara[i];
      childHeight += para.clientHeight;
      childHeight += parseInt(getComputedStyle(para)['margin-bottom']);
    }
    childHeight += introArrow.clientHeight;
    childHeight += parseInt(getComputedStyle(introArrow)['margin-top']);

    introPara[0].style.paddingTop = (introHeight - childHeight) / 2 + 'px';

    if (inPreLoad) {
      setTimeout(endPreLoad, 0);
    }
  }

  function endPreLoad() {
    // Let the initial content display
    inPreLoad = false;
    body.classList.remove('pre-load');
  }

  setBindings();
  scaleContainers();
})(window, document);
