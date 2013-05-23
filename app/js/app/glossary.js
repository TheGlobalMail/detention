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
    'RFS': 'Refugee Family Services',
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
