#!/usr/bin/env node

var program = require('commander');
var generator = require('json-schema-generator');
var fs = require('fs');
var path = require('path');
var package = require('../package.json');

program
  .version(package.version)
  .option('-i, --src', 'source directory')
  .option('-o, --out', 'output directory')
  .parse(process.argv);

// Sources directory
var srcDir = program.src;
// Destenation directory
var destDir = program.out;

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
