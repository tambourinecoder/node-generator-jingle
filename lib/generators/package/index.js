'use strict';

var yo = require('yeoman-generator')
  , util = require('util')
  , _s = require('underscore.string')
  , buildPrompts = require('./prompts')


var JinglePackage = module.exports = function(args, options) {
  yo.generators.Base.apply(this, arguments)

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] || false })
  })
}

util.inherits(JinglePackage, yo.generators.Base)

JinglePackage.prototype.greet = function greet() {
  console.log(this.yeoman)
}

JinglePackage.prototype.promptUser = function() {
  var done = this.async()
    , prompts = buildPrompts(this.user.git)

  this.prompt(prompts, function (answers) {
    this.packageName = _s.slugify(answers.packageName)
    this.githubUser = answers.githubUser
    this.userName = answers.userName
    this.userEmail = answers.userEmail

    this.githubUrl = util.format('https://github.com/%s', this.githubUser)
    this.repoName = _s.slugify('node ' + this.packageName)
    this.repoUrl = util.format('%s/%s', this.githubUrl, this.repoName)

    this.includeTests = answers.includeTests

    if (this.includeTests) {
      var testAdditions = answers.testAdditions

      this.includeMochaJSHint = testAdditions.indexOf('mochaJSHint') !== -1
      this.includeSinon = testAdditions.indexOf('sinon') !== -1
    }
    done()
  }.bind(this))
}

JinglePackage.prototype.createBaseFiles = function() {
  this.template('_package.json', 'package.json')
  this.template('_LICENSE', 'LICENSE')
  this.template('_README.md', 'README.md')
  this.directory('lib', 'lib')
}

JinglePackage.prototype.createDotFiles = function() {
  this.copy('jshintrc', '.jshintrc')
  this.copy('jshintignore', '.jshintignore')
  this.copy('gitignore', '.gitignore')
  this.copy('travis.yml', '.travis.yml')
}

JinglePackage.prototype.createTestFiles = function() {
  if (this.includeTests) {
    this.copy('test/mocha.opts', 'test/mocha.opts')
    this.template('test/_support.js', 'test/support.js')

    if (this.includeMochaJSHint) {
      this.copy('test/specs/jshint_spec.js', 'test/specs/jshint_spec.js')
    }
  }
}
