define([
  'jquery',
  'lodash',
  './../../components/tgm-bootstrap/js/bootstrap-modal'
], function($, _, modal) {
  "use strict";

  var modalContainer = $('#modal-container');
  var rootModal = $('.modal');

  function GridController() {
    var _this = this;

    function constructor() {
      _this.cells = [];

      _this.currentModal = new Modal(_this, false, '.current-modal');

      _this.currentModal.element.on("show", modalOnShow);
      _this.currentModal.element.on("hide", modalOnHide);

      _this.setBindings();

      return _this;
    }

    function modalOnShow() {
      // Called when bootstrap has shown the modal

      _this.currentModal.positionInCenter().display();

      _this.nextModal = new Modal(_this, true, '.next-modal');
      _this.nextModal.positionOffScreenRight();

      _this.prevModal = new Modal(_this, true, '.prev-modal');
      _this.prevModal.positionOffScreenLeft();
    }

    function modalOnHide() {
      // Called when bootstrap has hidden the modal
      _this.currentModal.element.hide();
      _this.nextModal.element.hide();
      _this.prevModal.element.hide();
    }

    _this.addCell = function(cell) {
      cell.grid = _this;
      _this.cells.push(cell)
    };

    _this.hasNextCell = function() {
      return _this.cellIndex < _this.cells.length - 1;
    };

    _this.hasPrevCell = function() {
      return _this.cellIndex > 0;
    };

    _this.showCellModal = function(cell) {
      // Called when a cell is clicked on

      _this.cellIndex = _this.cells.indexOf(cell);

      _this.currentModal
        .setCell(cell)
        .initModal();

      _this.nextModal.positionOffScreenRight().display();
      _this.prevModal.positionOffScreenLeft().display();

      if (_this.hasNextCell()) {
        _this.nextModal.setCell(_this.getNextCell());
        _this.currentModal.element.addClass('has-next');
      } else {
        _this.currentModal.element.removeClass('has-next');
      }

      if (_this.hasPrevCell()) {
        _this.prevModal.setCell(_this.getPrevCell());
        _this.currentModal.element.addClass('has-prev');
      } else {
        _this.currentModal.element.removeClass('has-prev');
      }

      _this.addIdentifierClasses();
    };

    _this.getNextCell = function() {
      return _this.cells[_this.cellIndex + 1];
    };

    _this.getPrevCell = function() {
      return _this.cells[_this.cellIndex - 1];
    };

    _this.addHasNextPrev = function(modal) {
      if (_this.hasNextCell()) {
        modal.element.addClass('has-next');
      } else {
        modal.element.removeClass('has-next');
      }
      if (_this.hasPrevCell()) {
        modal.element.addClass('has-prev');
      } else {
        modal.element.removeClass('has-prev');
      }
    };

    _this.displayNextModal = function() {
      // Called when the next button is clicked on

      _this.cellIndex++;

      _this.currentModal.slideLeft();
      _this.addHasNextPrev(_this.nextModal);
      _this.nextModal.slideIn();

      // Swap the variables around
      var current = _this.currentModal;
      _this.currentModal = _this.nextModal;
      _this.nextModal = _this.prevModal;
      _this.nextModal.positionOffScreenRight();
      _this.prevModal = current;

      // Update nextModal's content
      if (_this.hasNextCell()) {
        _this.nextModal.setCell(_this.getNextCell());
      }

      _this.addIdentifierClasses();
    };

    _this.displayPrevModal = function() {
      // Called when the prev button is clicked on

      _this.cellIndex--;

      _this.currentModal.slideRight();
      _this.addHasNextPrev(_this.prevModal);
      _this.prevModal.slideIn();

      // Swap the variables around
      var current = _this.currentModal;
      _this.currentModal = _this.prevModal;
      _this.prevModal = _this.nextModal;
      _this.prevModal.positionOffScreenLeft();
      _this.nextModal = current;

      // Update prevModal's content
      if (_this.hasPrevCell()) {
        _this.prevModal.setCell(_this.getPrevCell());
      }

      _this.addIdentifierClasses();
    };

    _this.addIdentifierClasses = function() {
      // Add state classes to the modals

      var map = {
        'current-modal': _this.currentModal,
        'next-modal': _this.nextModal,
        'prev-modal': _this.prevModal
      };

      _.each(map, function(modal, className) {
        var element = modal.element;
        _(map).keys().each(function(key) {
          if (className !== key) {
            element.removeClass(key);
          }
        });
        element.addClass(className)
      });
    };

    _this.flag = function() {
      var $cell = _this.cells[_this.cellIndex].element;
      $cell.toggleClass('flagged');
      _this.currentModal.setFlagText();
    };

    _this.windowOnResize = _.debounce(function() {
      _this.currentModal.positionInCenter();
      _this.nextModal.positionOffScreenRight();
      _this.prevModal.positionOffScreenLeft();
    }, 50);

    _this.setBindings = function() {
      $(window).resize(_this.windowOnResize);
    };

    return constructor.apply(_this, Array.prototype.slice.apply(arguments));
  }

  function Modal() {
    var _this = this;

    function constructor(grid, cloneModal, className) {
      _this.grid = grid;

      // Clone and insert the template
      var element = rootModal;
      _this.clonedElement = false;
      // If we've cloned the root already
      if (className !== undefined && element.siblings(className).length) {
        element = rootModal.siblings(className).first();
        _this.clonedElement = true;
      // If we're cloning the rootModal
      } else if (cloneModal) {
        element = rootModal
          .clone(true) // clone handlers as well
          .insertAfter(rootModal);
        _this.clonedElement = true;
      // If we're using the rootModal
      } else {
        setBindings()
      }
      _this.element = element;
      modalContainer.append(element);

      _this.incidentNumber = element.find('.incident-number');
      _this.date = element.find('.date');
      _this.facility = element.find('.facility');
      _this.incidentType = element.find('.incident-type');
      _this.level = element.find('.level');
      _this.summary = element.find('.summary');

      return _this;
    }

    function setBindings() {
      rootModal.on('click.modal', '.next', _this.grid.displayNextModal);
      rootModal.on('click.modal', '.prev', _this.grid.displayPrevModal);
      rootModal.on('click.modal', '.flag-btn', _this.grid.flag);
    }

    _this.setCell = function(cell) {

      _this.cell = cell;

      var $incidentDetails = _this.element.find('.incident-details');
      var $eventDetails = _this.element.find('.event-details');

      if (cell.data.event_type === 'incident') {
        // Set the text
        _this.incidentNumber.text(cell.data["Incident Number"]);
        _this.date.text(cell.data["Occurred On"]);
        _this.facility.text(cell.data["Location"]);
        _this.incidentType.text(cell.data["Type"]);
        _this.level.text(cell.data["Level"]);
        _this.summary.text(cell.data["Summary"]);
        $incidentDetails.show();
        $eventDetails.hide();
      } else {
        if (cell.data.element_id) {
          // insert this html into  modal
        }
        _.each(['occurred_on', 'type', 'facility', 'summary', 'description'], function(field){
          _this[field] = _this.element.find('.' + field)
          _this[field].text(cell.data[field] || '-');
        });
        $incidentDetails.hide();
        $eventDetails.show();
      }

      _this.setFlagText();

      return _this;
    };

    _this.initModal = function() {
      this.element.modal();
    };

    _this.display = function() {
      _this.element.show().addClass("in");
      return _this;
    };

    _this.setFlagText = function() {
      var flagged = _this.cell.element.hasClass('flagged');
      _this.element.find('.flag-btn')
        .toggleClass('unflag', flagged)
        .text((flagged ? 'Unflag' : 'Flag') + ' this incident');
    };

    function getCenterPosition() {
      return ($(window).width() - _this.element.width()) / 2;
    }

    function getLeftOffScreenPosition() {
      return -_this.element.outerWidth() - 200;
    }

    function getRightOffScreenPosition() {
      return $(window).width() + _this.element.outerWidth();
    }

    _this.positionInCenter = function() {
      _this.element.css({
        "left": getCenterPosition() + 'px'
      });
      return _this;
    };

    _this.positionOffScreenLeft = function() {
      _this.element.css("left", getLeftOffScreenPosition());
      return _this;
    };

    _this.positionOffScreenRight = function() {
      _this.element.css("left", getRightOffScreenPosition());
      return _this;
    };

    _this.slideLeft = function() {
      _this.element.animate({
        "left": getLeftOffScreenPosition() + 'px'
      });
    };

    _this.slideRight = function() {
      _this.element.animate({
        "left": getRightOffScreenPosition()  + 'px'
      });
    };

    _this.slideIn = function() {
      _this.element.animate({
        "left": getCenterPosition() + 'px'
      });
    };

    return constructor.apply(_this, Array.prototype.slice.apply(arguments));
  }


  function Cell() {
    var _this = this;

    function constructor(data) {
      var highlight_class;

      var element = _this.element = $('<div class="cell">');
      _this.data = data;
      _this.grid = null;

      if (data.event_type === 'incident') {
        highlight_class = data['Level'].toLowerCase() + '-incident';
      } else {
        highlight_class = data['type'] + '-event event';
      }

      element.addClass(highlight_class);

      setBindings();

      return _this;
    }

    function cellOnMouseOver() {
      // TODO: display a small detail..?
    }

    function cellOnClick() { // click/touch
      _this.grid.showCellModal(_this);
    }

    function setBindings() {
      _this.element.on('mouseover', cellOnMouseOver);
      _this.element.on('click touch', cellOnClick);
    }

    return constructor.apply(_this, Array.prototype.slice.apply(arguments));
  }

  return {
    GridController: GridController,
    Modal: Modal,
    Cell: Cell
  };
});
