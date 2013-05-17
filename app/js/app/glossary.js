define(['lodash'], function(_){

  var glossary = {
    'VHS': 'Voluntary Hunger Strike',
    'DIAC': 'Department of Immigration &amp; Citizenship',
    'IR': 'Incident Report'
  };

  // Replaces words in the glossary with spans
  var applyToHtml = function(html){
    var glossaryHtml = '';
    var usedGlossary = [];
    _.each(glossary, function(defn, abbrev){
      if (html.match(abbrev)){
        usedGlossary.push(defn);
        html = html
          .replace(new RegExp(abbrev, 'gm'), abbrev + '<sup>' + usedGlossary.length + '</sup>');
      }
    });
    if (usedGlossary.length){
      glossaryHtml += _.map(usedGlossary, function(glossary){
        return '<li>' + glossary + '</li>';
      }).join('');
    }
    return {html: html, glossary: glossaryHtml};
  };

  return { applyToHtml: applyToHtml };

});
