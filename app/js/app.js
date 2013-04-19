(function() {
  'use strict';

  $(renderGraphs);

  function renderGraphs(){
    var idcs = ['north-west-point-immigration-facility', 'curtin-idc', 'perth-idc', 'villawood-idc', 'scherger-idc',
      'maribyrnong-idc', 'northern-idc'].sort();
    var facilities = ['overall'].concat(idcs);

    $('#incident-category-graphs').html(_.map(facilities, function(idc){
      var html = ''; //'<h3>' + idc + '</h3>';
      html += '<img src="graphs/' + idc + '-incident-categories.png" />';
      html += '<img class="incident-population" src="graphs/' + idc + '-population.png" />';
      return html;
    }).join('\n'));
  }

}());
