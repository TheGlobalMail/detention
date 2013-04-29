define([
  'jquery',
  'lodash',
  'data/incidents',
  'kinetic',
  'jquery_inwindow'
], function($, _, incidents, Kinetic) {
  'use strict';

  window.tgm = window.tgm || {};

  var gridContainer = $('.incident-grid');
  var data;

  function processDateStrings() {
    incidents["Occurred On"] = _.map(
      incidents["Occurred On"],
      function(date) {
        // `date` takes the format MM/DD/YYYY

        var split = date.split('/');
        var normal = [split[2], split[0], split[1]].join('/');
        var unix = (new Date(normal.split('/'))).getTime();
        var dateClass = normal.replace(/\//g, '-'); // Replace slashes with dashes
        var month = normal.split('/').slice(0,2).join('/');
        var monthClass = month.replace(/\//g, '-'); // Replace slashes with dashes

        return {
          original: date,
          normal: normal,
          unix: unix,
          dateClass: dateClass,
          month: month,
          monthClass: monthClass
        }
      }
    )
  }

  function processIncidentData() {
    var occurredOn = incidents["Occurred On"];

    var dates = _(occurredOn)
      .unique('original')
      .sortBy('unix')
      .value();

    var dateCounts = _.countBy(occurredOn, 'original');

    var months = _.unique(dates, 'month');
    var monthCounts = _.countBy(occurredOn, 'month');

    data = {
      dates: dates,
      dateCounts: dateCounts,
      months: months,
      monthCounts: monthCounts
    };
  }

  function buildIncidentMonthGrid() {
    resetGridContainer();

    _.each(
      data.months,
      getAddDateToGrid(
        data.monthCounts,
        'month'
      )
    );

    // Set some random ones as active
    setTimeout(function() {
      var cells = gridContainer.find('.cell');
      for(var i = 0; i < Math.floor(cells.length / 50); i++) {
        var cell = cells[Math.floor(Math.random() * cells.length)];
        $(cell).addClass('active');
      }
    }, 500);
  }

  function buildIncidentCanvas(container, toCreate) {

    var squareOpts = {
      width: 20,
      height: 20,
      xSpacing: 4,
      ySpacing: 4,
      initialFill: "grey",
      onHoverFill: "pink"
    };

    var stage = new Kinetic.Stage({
      container: container.get(0),
      width: container.width(),
      height: 200
    });

    var layer = new Kinetic.Layer();

    var canvasWidth = container.width();
    var squares = [];
    var column = 0;
    var row = 0;
    var w = squareOpts.width;
    var h = squareOpts.height;
    var perRow = Math.floor(canvasWidth / (w + squareOpts.xSpacing));
    var columnsNeeded = Math.round(toCreate / perRow);
    var columnHeight = h + squareOpts.ySpacing;
    var heightNeeded = columnsNeeded * columnHeight;
    stage.setHeight(heightNeeded);

    function squareOnMouseOver() {
      this.setFill(squareOpts.onHoverFill);
      this.getLayer().draw();
    }

    function squareOnMouseOut() {
      this.setFill(squareOpts.initialFill);
      this.getLayer().draw();
    }

    for (var i = 0; i < toCreate; i++) {
      var x = column * (w + squareOpts.xSpacing);
      var y = row * (h + squareOpts.ySpacing);

      var square = new Kinetic.Rect({
        x: x,
        y: y,
        width: w,
        height: h,
        fill: squareOpts.initialFill,
        strokeWidth: 0
      });

      square.on("mouseover", squareOnMouseOver);
      square.on("mouseout", squareOnMouseOut);

      // add the shape to the layer
      layer.add(square);

      if (x + (w * 2) > canvasWidth) {
        row++;
        column = 0;
      } else {
        column++;
      }

      squares.push(square);
    }

    stage.add(layer);

    function checkSquareVisibility(square) {
      _.each(squares, function(square) {
        if (!square.isVisible()) {
          square.setListening(false);
        } else if (!square.isListening()) {
          square.setListening(true);
        }
      })
    }

    checkSquareVisibility();
    $(window).scroll(checkSquareVisibility);

    return {
      container: container,
      stage: stage,
      squares: squares
    }
  }

  function testAnimation() {
    var canvasInWindow = $('canvas').inWindow();
    _(tgm.canvas)
      .filter(function(canvas) {
        return
      })
    _.each(tgm.canvas, function(obj) {
      var stage = obj.stage;
      var squares = obj.squares;
      _.each(squares, function(square) {
        square.stopListening();
        square.transitionTo({
          width: 0,
          duration: 100
        });
      });
    });
  }
  tgm.testAnimation = testAnimation;

  function buildIncidentCanvases() {
    tgm.canvas = _.map(
      data.months,
      function(month) {
        var canvasContainer = $('<div class="canvas-container ' + month.monthClass + '">');
        gridContainer.append(canvasContainer);
        return buildIncidentCanvas(
          canvasContainer,
          data.monthCounts[month.month]
        )
      }
    );
  }

  function resetGridContainer() {
    gridContainer.children().remove();
  }

  function init() {
    processDateStrings();
    processIncidentData();
//    buildIncidentMonthGrid();
    buildIncidentCanvases();
  }

  return {
    init: init
  }
});
