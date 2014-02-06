"use strict";

var yo = require('yeoman-generator')
  , inherits = require('util').inherits
  , path = require('path')
  , _s = require('underscore.string')
  , pathHelper = require('./path_helper')


var JingleModule = module.exports = function() {
  yo.generators.Base.apply(this, arguments)

  this.names = arguments[0]

  if (this.names.length === 0) { throw 'No module name given!' }
}

inherits(JingleModule, yo.generators.Base)

JingleModule.prototype.inferDirectories = function() {
  this.libDir = pathHelper.libDir(this.names)
  this.specDir = pathHelper.specDir(this.names)
}

JingleModule.prototype.inferNames = function() {
  var lastName = this.names.slice(-1)[0]

  this.snakeName = _s.underscored(lastName)
  this.className = _s.classify(lastName)
}

JingleModule.prototype.createFiles = function() {
  this.copy('index.js', path.join(this.libDir, 'index.js'))
  this.template('_spec.js', path.join(this.specDir, this.snakeName + '_spec.js'))
}
