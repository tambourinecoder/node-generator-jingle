"use strict";

var path = require('path')
  , _s = require('underscore.string')

function joinAndUnderscore(base, parts) {
  function binJoin(a, b) { return path.join(a, b) }
  var joinedPath = parts.reduce(binJoin, base)

  return _s.underscored(joinedPath)
}

exports.libDir = function(names) {
  return joinAndUnderscore('lib', names)
}

exports.specDir = function(names) {
  var dirParts = names.slice(0, -1)

  return joinAndUnderscore('test/specs', dirParts)
}
