/* global describe, beforeEach, it */
'use strict';

var path       = require('path')
  , yo         = require('yeoman-generator')
  , assert     = yo.assert


describe('JingleModule', function() {
  beforeEach(function (done) {
    yo.test.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) return done(err)

      this.generator = yo.test.createGenerator(
        'jingle:module',
        ['../../lib/generators/module'],
        'some-module foo-bar baz'
      )

      done()
    }.bind(this))
  })

  it('creates files', function(done) {
    this.generator.run({}, function () {
      assert.file(['lib/some_module/foo_bar/baz/index.js', 'test/specs/some_module/foo_bar/baz_spec.js'])
      done()
    })
  })

  it('the spec should be ready to go', function(done) {
    this.generator.run({}, function () {
      assert.fileContent('test/specs/some_module/foo_bar/baz_spec.js', /var Baz = require\('..\/..\/..\/..\/lib\/some_module\/foo_bar\/baz'\)/)
      assert.fileContent('test/specs/some_module/foo_bar/baz_spec.js', /Baz.should.equal\(42\)/)
      done()
    })
  })
})
