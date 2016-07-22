#!/usr/bin/env node

var program = require('commander');
var generator = require('json-schema-generator');
var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;
var package = require('../package.json');

program
  .version(package.version)
  .option('--src', 'source directory')
  .option('--out', 'output directory')
  .description(package.description)
  .parse(process.argv);

// Do not run if there are no args
if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  // Sources directory
  var srcDir = argv.src;
  // Destenation directory
  var destDir = argv.out;
  // Get array of files from the directory
  fs.readdir(srcDir, function(err, files) {
    // Throw if error reading file(s) or continue
    if (err) throw err;
    files
    // We only interested in json file extentions
      .filter(function(file) {
        return path.extname(file) === '.json'
      })
      // Loop through files
      .map(function(file) {
        fs.readFile(path.join(srcDir, file), 'utf8', function(err, realFile) {
          if (err) throw err;
          // Proccess file contents with json-schema-generator
          var schema = generator(JSON.parse(realFile));
          // Write formated file to disk
          fs.writeFile(path.join(destDir, file), JSON.stringify(schema, true, 4), function(err) {
            if (err) throw err;
          });
        });
      });
  });
}
