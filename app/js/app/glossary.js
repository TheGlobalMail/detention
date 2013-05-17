define(['lodash'], function(_){

  var glossary = {
    'VHS': 'Voluntary Hunger Strike',
    'DIAC': 'Department of Immigration &amp; Citizenship',
    'IR': 'Incident Report'
  };

  // Replaces words in the glossary with spans
  var applyToHtml = function(html){
    var glossarisedHtml = html;
    var usedGlossary = [];
    _.each(glossary, function(defn, abbrev){
      if (glossarisedHtml.match(abbrev)){
        usedGlossary.push(defn);
        glossarisedHtml = glossarisedHtml
          .replace(new RegExp(abbrev, 'gm'), abbrev + '<sup>' + usedGlossary.length + '</sup>');
      }
    });
    if (usedGlossary.length){
      glossarisedHtml += '<ol class="glossary">';
      glossarisedHtml += _.map(usedGlossary, function(glossary){
        return '<li>' + glossary + '</li>';
      }).join('');
      glossarisedHtml += '</ol>';
    }
    return glossarisedHtml;
  };

  return { applyToHtml: applyToHtml };

});
