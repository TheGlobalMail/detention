define([
  'jquery',
  'lodash'
], function($, _) {
  "use strict";

  function Cell() {
    var _this = this;

    function constructor(data) {
      var element = _this.element = $('<div class="cell">');
      _this.data = data;

      var levelClass = data['Level'].toLowerCase() + '-incident';
      element.addClass(levelClass);

      setBindings();
      return element;
    }

    function cellOnMouseOver() {
      console.log(_this.data);
    }

    function cellOnClick() { // click/touch
      $(this).toggleClass('active');
    }

    function setBindings() {
      _this.element.on('mouseover', cellOnMouseOver);
      _this.element.on('click touch', cellOnClick);
    }

    return constructor.apply(this, Array.prototype.slice.apply(arguments));
  }

  return {
    Cell: Cell
  };
});