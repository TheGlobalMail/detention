(function() {
  'use strict';

  $(renderGraphs);

  function renderGraphs(){
    var idcs = ['north-west-point-immigration-facility', 'curtin-idc', 'perth-idc', 'villawood-idc', 'scherger-idc',
      'maribyrnong-idc', 'northern-idc'].sort();
    var facilities = ['overall'].concat(idcs).concat(['domestic', 'offshore']);

    $('#incident-category-graphs').html(_.map(facilities, function(graph){
      var html = ''; //'<h3>' + idc + '</h3>';
      html += '<img src="graphs/' + graph + '-incident-categories.png" />';
      if (!graph.match(/domestic|offshore/)){
        html += '<img class="incident-population" src="graphs/' + graph + '-population.png" />';
      }
      if (graph.match(/villawood|curtin|nothern|north-west/i)){
        html += '<img class="incident-contraband" src="graphs/' + graph + '-contraband-incident-categories.png" />';
      }
      return html;
    }).join('\n'));
  }

}());
