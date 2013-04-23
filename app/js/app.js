tgm = (function() {
  'use strict';

  function renderGraphs(){
    var idcs = ['north-west-point-immigration-facility', 'curtin-idc', 'perth-idc', 'villawood-idc', 'scherger-idc',
      'maribyrnong-idc', 'northern-idc'].sort();
    var facilities = ['overall'].concat(idcs).concat(['domestic', 'offshore']);

    var graphs = $('#incident-category-graphs');
    graphs.html(_.map(facilities, function(graph){
      var html = ''; //'<h3>' + idc + '</h3>';
      html += '<img src="graphs/' + graph + '-incident-categories.png" />';
      if (!graph.match(/domestic|offshore/)){
        html += '<img class="incident-population" src="graphs/' + graph + '-population.png" />';
        html += '<img class="incidents-vs-population" src="graphs/' + graph + '-population-vs-incidents.png" />';
      }
      if (graph.match(/villawood|curtin|nothern|north-west/i)){
        html += '<img class="incident-contraband" src="graphs/' + graph + '-contraband-incident-categories.png" />';
      }
      return html;
    }).join('\n'));
    
    graphs.append($('<img src="graphs/total-population-by-nationality.png">'));
  }

  function getProcessedIncidentData() {
    var occuredOn = tgm.data.incidents["Occurred On"];
    var types = tgm.data.incidents["Type"];
    var dates = _(occuredOn)
      .unique()
      .sortBy(function(date) {
        return new Date(date.split('/'));
      }).value();
    var counts = _.countBy(occuredOn, _.identity);
    return {
      // Ordered list of dates
      dates: dates,
      // Map of date -> incident count
      counts: counts
    };
    // {
    //   "1909/2/31": ["Some incident", ...],
    //   ...
    // }
  }

  function buildIncidentGrid() {
    var container = $('.incident-grid');
    var data = getProcessedIncidentData();
    var i = 0;
    var addDateToGrid = function(date) {
      // Delay for an increasingly larger time period so that
      // we don't halt the browser
      setTimeout(function() {
        var dateClass = date.replace(/\//g, '-'); // Replace slashes with dashes
        container.append('<div class="date ' + dateClass +'">');
        var dateElement = container.find('.' + dateClass);
        _(data.counts[date])
          .times(function(i) {
            dateElement.append('<div class="cell">');
          }).tap(function() {
            dateElement.append('<div class="clear">');
          });
      }, i++)
    };
    _.each(data.dates.slice(0, 250), addDateToGrid)

    // Set some random ones as active
    setTimeout(function() {
      var cells = container.find('.cell');
      for(var i = 0; i < 50; i++) {
        var cell = cells[Math.floor(Math.random() * cells.length)];
        $(cell).addClass('active');
      }
    }, 1000);
  }

  function init() {
    renderGraphs();
    buildIncidentGrid();
  }

  return {
    init: init,
    debug: function() {
      debugger
    }
  }
})();

$(tgm.init);
