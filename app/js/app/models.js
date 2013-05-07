define([
  'jquery',
  'lodash',
  './../../components/tgm-bootstrap/js/bootstrap-modal',
  './flags',
  'backbone'
], function($, _, modal, flags) {
  "use strict";

  var modalContainer = $('#modal-container');
  var modalSlideshow = modalContainer.find('.modal-slideshow');
  var modalBackdrop = modalContainer.find('.modal-backdrop');
  var rootModal = $('.modal');

  var vent = _.extend({}, Backbone.Events);

  function GridController() {
    var _this = this;

    function constructor() {
      _this.cells = [];
      _this.cellsByIncidentNumber = {};

      _this.currentModal = new Modal(_this, false, '.current-modal');

      _this.currentModal.element.on("show", modalOnShow);
      _this.currentModal.element.on("hide", modalOnHide);

      _this.displayingModal = false;

      _this.setBindings();

      return _this;
    }

    function modalOnShow() {
      // Called when bootstrap has shown the modal

      modalContainer.addClass("show");

      _this.displayingModal = true;

      _this.currentModal.positionInCenter().display();

      _this.currentModal.positionInCenter().display();
      _this.nextModal = new Modal(_this, true, '.next-modal');
      _this.nextModal.positionOffScreenRight();

      _this.prevModal = new Modal(_this, true, '.prev-modal');
      _this.prevModal.positionOffScreenLeft();

      vent.trigger('incident-displayed', _this.cells[_this.cellIndex].data.id);
    }

    function modalOnHide() {
      // Called when bootstrap has hidden the modal

      modalContainer.removeClass("show");

      _this.currentModal.element.hide();
      _this.nextModal.element.hide();
      _this.prevModal.element.hide();

      _this.displayingModal = false;
    }

    _this.addCell = function(cell) {
      cell.grid = _this;
      _this.cells.push(cell);
      _this.cellsByIncidentNumber[cell.data["Incident Number"]] = cell;
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

      _this.postDisplay();
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

      _this.postDisplay();
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

      _this.postDisplay();
    };

    _this.postDisplay = function() {
      _this.resizeContainers();
      _this.addIdentifierClasses();
    };

    _this.resizeContainers = function() {
      var maxHeight = _([_this.prevModal, _this.currentModal, _this.nextModal])
        .pluck('element')
        .invoke('outerHeight')
        .max()
        .value();
      var offset = _this.currentModal.element.offset().top - modalSlideshow.offset().top;
      var height = maxHeight + offset;
      modalBackdrop.css({"height": height});
      modalSlideshow.css({"height": height});
    };

    _this.addIdentifierClasses = function() {
      // Add state classes to the modals

      var map = {
        'current-modal': _this.currentModal,
        'next-modal': _this.nextModal,
        'prev-modal': _this.prevModal
      };

      // Remove classes which refer to a previous state
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
      var cell = _this.cells[_this.cellIndex];
      flags.flag(cell.data.id);
      _this.currentModal.setFlagText();
      _this.currentModal.updateFlagCount();
    };

    _this.unflag = function() {
      var cell = _this.cells[_this.cellIndex];
      flags.unflag(cell.data.id);
      _this.currentModal.setFlagText();
      _this.currentModal.updateFlagCount();
    };

    _this.windowOnResize = _.throttle(function() {
      if (_this.displayingModal) {
        _this.currentModal.positionInCenter();
        _this.nextModal.positionOffScreenRight();
        _this.prevModal.positionOffScreenLeft();
      }
    }, 50);

    _this.cellOnClick = function() {
      var incidentNumber = this.getAttribute('data-incident-number');
      var cell = _this.cellsByIncidentNumber[incidentNumber];
      _this.showCellModal(cell);
    };

    _this.setBindings = function() {
      $(window).resize(_this.windowOnResize);
      $('#incidents').on('click touch', '.cell', _this.cellOnClick)
      modalBackdrop.click(function() {
        _this.currentModal.element.trigger("hide");
      });
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
        setBindings();
      }
      _this.element = element;
      modalSlideshow.append(element);

      return _this;
    }

    function setBindings() {
      rootModal.on('click.modal', '.next', _this.grid.displayNextModal);
      rootModal.on('click.modal', '.prev', _this.grid.displayPrevModal);
      rootModal.on('click.modal', '.flag-btn', _this.grid.flag);
      rootModal.on('click.modal', '.unflag-btn', _this.grid.unflag);
    }

    _this.setCell = function(cell) {
      _this.cell = cell;

      var incidentDetails = _this.element.find('.incident-details');
      var eventDetails = _this.element.find('.event-details');
      var eventModalClass = 'event-modal';

      // Remove any event classes from the modal
      var classList = _this.element.attr('class').split(' ');
      _.each(classList, function(className) {
        if (className.indexOf(eventModalClass) === 0) {
          _this.element.removeClass(className);
        }
      });

      // Generic incidents
      if (cell.data.event_type === 'incident') {

        var map = { // modal element class -> cell.data property
          '.incident-number': 'Incident Number',
          '.date': 'Occurred On',
          '.facility': 'Location',
          '.incident-type': 'Type',
          '.level': 'Level',
          '.summary': 'Summary'
        };

        // Update the modal's text
        _.each(map, function(property, className) {
          var text = cell.data[property] || '';
          if (property === 'Summary') {
            var html = text.replace(/s. 47F\(1\)/gi, ' <span class="redact">NAME REDACTED</span>');
            _this.element.find(className).html(html);
          } else {
            _this.element.find(className).text(text);
          }
        });

        incidentDetails.show();
        eventDetails.hide();

        _this.updateFlagCount();
        _this.setFlagText();
      } else { // Events
        _.each(['occurred_on', 'type', 'facility', 'summary', 'description'], function(field){
          _this[field] = _this.element.find('.' + field);
          _this[field].text(cell.data[field] || '-');
        });

        incidentDetails.hide();
        eventDetails.show();

        _this.element
          .addClass(eventModalClass)
          .addClass(eventModalClass + '-' + cell.data.type);
      }

      return _this;
    };

    _this.initModal = function() {
      _this.element.modal({
        backdrop: false
      });
    };

    _this.display = function() {
      _this.element.show().addClass("in");
      return _this;
    };

    _this.setFlagText = function() {
      var flagged = flags.isFlagged(_this.cell.data.id);
      var flaggedByUser = flags.isUserFlagged(_this.cell.data.id);
      var $flagButton = _this.element.find('.flag-btn');
      var $unflagButton = _this.element.find('.unflag-btn');
      if (flagged){
        if (flaggedByUser){
          $flagButton.hide();
        }else{
          $flagButton.show();
        }
        $unflagButton.show();
      }else{
        $flagButton.show();
        $unflagButton.hide();
      }
      $flagButton.text((!flaggedByUser ? 'Reflag' : 'Flag') + ' this incident');
    };

    _this.updateFlagCount = function() {
      var flaggedCount = flags.numberOfTimesFlagged(_this.cell.data.id)
      var $flaggedByOthers = _this.element.find('.flagged-by-others');
      if (!flaggedCount){
        $flaggedByOthers.text('Be the first to flag this incident');
      }else{
        $flaggedByOthers.text('This incident has been flagged ' +
          (flaggedCount === 1 ? 'once': flaggedCount + ' times')
        );
      }
    };

    function getCenterPosition() {
      return ($(window).width() - _this.element.outerWidth()) / 2;
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
      _this.element.css("left", getLeftOffScreenPosition() + 'px');
      return _this;
    };

    _this.positionOffScreenRight = function() {
      _this.element.css("left", getRightOffScreenPosition() + 'px');
      return _this;
    };

    _this.slideLeft = function() {
      _this.element.css({
        "left": getLeftOffScreenPosition() + 'px'
      });
    };

    _this.slideRight = function() {
      _this.element.css({
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
      var element = _this.element = document.createElement('div');
      element.classList.add('cell');
      _this.data = data;
      _this.grid = null;

      if (data.event_type === 'incident') {
        flags.on('reload change', updateHighlight);
        if (flags.loaded) updateHighlight();
      } else {
        element.classList.add(data['type'] + '-event');
        element.classList.add('event');
      }

      element.setAttribute('data-incident-number', data["Incident Number"]);

      return _this;
    }

    // Update opacity and `flagged` class
    function updateHighlight() {
      var flagWeights = flags.data;
      // Scale the score as a percentage
      var score = Math.round((flagWeights[_this.data.id] || 0) * 100);
      // Scale the scare between 15 and 100
      var backgroundOpacity = ((score / 100) * 95) + 5;
      // Round to the nearest number divisible by 5
      backgroundOpacity = Math.round(backgroundOpacity / 5) * 5;
      var isFlagged = flags.isFlagged(_this.data.id);

      var classes = _this.element.classList;
      if (_this.data.flagScore !== score) {
        _this.data.flagScore = score;
        if (score > 0) {
          if (!isFlagged) {
            _this.element.style.backgroundColor = 'rgba(255,255,255,' + backgroundOpacity / 100 + ')';
          }
        }
      }
      if (isFlagged && _this.element.style.backgroundColor) {
        _this.element.style.backgroundColor = "";
      }
      if (classes.contains('flagged') && !isFlagged) {
        classes.remove('flagged');
      } else if (!classes.contains('flagged') && isFlagged) {
        classes.add('flagged');
      }
    }

    return constructor.apply(_this, Array.prototype.slice.apply(arguments));
  }

  return {
    GridController: GridController,
    Modal: Modal,
    Cell: Cell,
    vent: vent
  };
});
