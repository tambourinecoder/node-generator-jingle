"use strict";

var fs = require('fs')

var readPackage = function() {
  var contents = fs.readFileSync('package.json', 'utf-8')

  return JSON.parse(contents)
}

exports.read = function() {
  var keys = Array.prototype.slice.call(arguments)
    , lookup = function(obj, key) { return obj[key] }

  return keys.reduce(lookup, readPackage())
}
