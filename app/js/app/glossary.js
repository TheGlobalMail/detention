define(['lodash'], function(_){

  var glossary = {
    'VHS': 'Voluntary Hunger Strike',
    'DIAC': 'Department of Immigration &amp; Citizenship',
    'IR': 'Incident Report'
  };

  // Returns an object with the `html` replaced with sup tags and `glossary`
  // containing the defnitions in list items
  var applyToHtml = function(html){
    var glossaryHtml = '';
    var usedGlossary = [];
    _.each(glossary, function(defn, abbrev){
      var regex = new RegExp('(^| )(' + abbrev + ')($| )', 'gm');
      if (html.match(regex)){
        usedGlossary.push(defn);
        html = html
          .replace(regex, '$1$2<sup>' + usedGlossary.length + '</sup>$3');
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
