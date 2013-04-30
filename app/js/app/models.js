define([
  'jquery',
  'lodash',
  './../../components/tgm-bootstrap/components/bootstrap/js/bootstrap-modal'
], function($, _, modal) {
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
      // TODO: display a small detail..?
    }

    function cellOnClick() { // click/touch
      // Update the modal dialog's content before displaying it

      var modal = $('.modal');
      modal.find('.incident-number').text(_this.data["Incident Number"]);
      modal.find('.date').text(_this.data["Occurred On"]);
      modal.find('.facility').text(_this.data["Location"]);
      modal.find('.incident-type').text(_this.data["Type"]);
      modal.find('.level').text(_this.data["Level"]);
      modal.find('.summary').text(_this.data["Summary"]);
      modal.modal();
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