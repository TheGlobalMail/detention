define(['lodash'], function(_){

  var glossary = {
    'VHS': 'Voluntary Hunger Strike',
    'Diac': 'Department of Immigration &amp; Citizenship',
    'DIAC': 'Department of Immigration &amp; Citizenship',
    'IR': 'Incident Report',
    'AFP': 'Australian Federal Police',
    'AHRC': 'Australian Human Rights Commission',
    'AITA': 'Adelaide Immigration Transit Accommodation',
    'APOD': 'Alternative Place of Detention',
    'BITA': 'Brisbane Immigration Transit Accommodation',
    'ITA': 'Immigration Transit Accommodation',
    'Code Red': 'Fire hazard',
    'Code Yellow': 'Self harm attempt',
    'Code Green': 'Detainee escape',
    'Code Black': 'Threat of assault',
    'Code Blue': 'Detainee injured or hurt',
    'Code Purple': 'Minor disturbance or scuffle between clients',
    'CI': 'Christmas Island',
    'CIIDC': 'Christmas Island Immigration Detention Centre',
    'CI DC': 'Christmas Island Immigration Detention Centre',
    'CSO': '(Serco) Client Services Officer',
    'CSM': '(Serco) Client Services Manager',
    'DALAPOD': 'Darwin Airport Lodge Alternative Place of Detention',
    'DAL3': 'Darwin Airport Lodge Stage 3',
    'DPH': 'Darwin Private Hospital',
    'Fowler': 'Fowler Compound, Villawood Immigration Detention Centre',
    'HRC': 'Australian Human Rights Commission',
    'Hughes': 'Secion of Villawood Immigration Detention Centre',
    'IDC': 'Immigration Detention Centre',
    'IDF': 'Immigration Detention Facility',
    'IHMS': 'International Health and Medical Services',
    'IRH': 'Immigration Transit Accommodation',
    'LAPOD': 'Leonora Alternative Place of Detention',
    'Lilac Aqua': 'detention facility located on Christmas Island Detention Centre',
    'MIDC': 'Maribyrnong Immigration Detention Centre',
    'MITA': 'Melbourne Immigration Transit Accommodation',
    'MRRC': 'Metropolitan Remand and Reception Centre at Silverwater Correctional Complex',
    'MSS': 'Australian security company (Previously known as Chubb Security)',
    'NIDC': 'Northern Immigration Detention Centre',
    'NWP': 'North West Point Immigration Facility',
    'OBS': 'Observation Room',
    'PIDC': 'Perth Immigration Detention Centre',
    'PIRH': 'Perth Immigration Residential Housing',
    'Phosphate Hill': 'Temporary immigration facility, Christmas Island',
    'RDH': 'Royal Darwin Hospital',
    'RRT': 'Refugee Review Tribunal',
    // 'RFS': 'Refugee Family Services',
    'SIDC': 'Scherger Immigration Detention Centre',
    'SIRH': 'Sydney Immigration Residential Housing',
    'SASH Watch': 'Suicide and Self-Harm Watch',
    'serco': 'Company contracted to to provide services at Australian immigration facilities',
    'Serco': 'Company contracted to to provide services at Australian immigration facilities',
    'SERCO': 'Company contracted to to provide services at Australian immigration facilities',
    'SKSA': 'Sydney Kingsford Smith Airport',
    'VIDC': 'Villawood Immigration Detention Centre',
    'WAPOL': 'Western Australia Police'
  };

  // Returns an object with the `html` replaced with sup tags and `glossary`
  // containing the defnitions in list items
  var applyToHtml = function(html){
    var glossaryHtml = '';
    var usedGlossary = [];
    // First, find all the references to known abbreviations
    _.each(_.keys(glossary), function(abbrev){
      var regex = new RegExp('(^|[^\w>"])(' + abbrev + ')($|[^\w<"])', 'gm');
      if (html.match(regex)){
        html = html
          .replace(regex, '$1$2<sup data-abbrev="'+abbrev+'"></sup>$3');
      }
    });
    // Second, find all the <sup> tags and correctly apply the reference
    // numbers in the order that they appear in the text
    var referenceNumbers = {};
    var currentNumber = 0;
    html = html.replace(/(<sup data-abbrev=")(\w*)(">)(<\/sup>)/gm, function(sup, p1, abbrev, p2, p3){
      var number;
      if (referenceNumbers[abbrev]){
        number = referenceNumbers[abbrev];
      }else{
        currentNumber += 1;
        number = currentNumber;
        referenceNumbers[abbrev] = number;
        usedGlossary.push(glossary[abbrev]);
      }
      return p1 + abbrev + p2 + number + p3;
    });
    // Third, build the glossary definitions list
    if (usedGlossary.length){
      glossaryHtml += _.map(usedGlossary, function(defn){
        return '<li>' + defn + '</li>';
      }).join('');
    }
    return {html: html, glossary: glossaryHtml};
  };

  return { applyToHtml: applyToHtml };

});
