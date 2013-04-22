var fs = require('fs');
var csv = require('csv');

if (process.argv.length < 4) {
  console.log(
    'Provide two args, an infile (CSV) and an outfile (JSON).\n' +
    'File paths should be relative to the csv-to-json.js file.\n' +
    '\n' +
    'Example usage: `node analysis/csv-to-json.js ../data/processed.csv ../data/processed.json`'
  );
} else {
  var infile = process.argv[2];
  var outfile = process.argv[3];
  var rows = [];

  csv()
    .from.stream(fs.createReadStream(
      __dirname + '/' + infile
    ))
    .on('record', function(row) {
      rows.push(row);
    })
    .on('end', function(){
      // Convert the parsed CSV document to JSON and
      // write to `outfile`

      var json = {};
      var headers = rows[0];
      var columns = rows.slice(1);

      headers.forEach(function(header, i) {
        var column = [];
        columns.forEach(function(row) {
          column.push(row[i]);
        });
        json[header] = column;
      });

      fs.writeFile(
        __dirname + '/' + outfile,
        JSON.stringify(json, null, 2),
        function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('Saved to "' + __dirname + outfile + '"');
          }
        }
      );
    })
    .on('error', function(error){
      console.log(error.message);
    });
}