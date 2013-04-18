(function() {
  'use strict';

  $(renderGraphs);

  function renderGraphs(){
    var idcs = ['christmas-island', 'curtin-idc', 'perth-idc', 'villawood-idc', 'scherger-idc',
      'maribyrnong-idc'].sort();

    $('#incident-category-graphs').html(_.map(idcs, function(idc){
      var html = '<h3>' + idc + '</h3>';
      html += '<img src="graphs/' + idc + '-incident-categories.png" />';
      html += '<img class="incident-population" src="graphs/' + idc + '-population.png" />';
      return html;
    }).join('\n'));
  }

}());
