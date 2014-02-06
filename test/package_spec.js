/* global describe, context, beforeEach, it */
'use strict';

var path       = require('path')
  , yo         = require('yeoman-generator')
  , assert     = yo.assert
  , mockPrompt = yo.test.mockPrompt
  , pkg        = require('./harness/package')


describe('JinglePackage', function() {
  beforeEach(function (done) {
    yo.test.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) return done(err)

      this.generator = yo.test.createGenerator('jingle:package', ['../../lib/generators/package'])
      this.generator.options['skip-install'] = true
      mockPrompt(this.generator, {})

      done()
    }.bind(this))
  })

  it('creates base files', function(done) {
    this.generator.run({}, function () {
      assert.file(['package.json', 'LICENSE', 'README.md', 'lib/index.js'])
      done()
    })
  })

  it('creates dotfiles', function(done) {
    this.generator.run({}, function () {
      assert.file(['.gitignore', '.jshintrc', '.jshintignore', '.travis.yml'])
      done()
    })
  })

  describe('LICENSE', function() {
    it('contains the MIT license', function(done) {
      this.generator.run({}, function () {
        assert.fileContent('LICENSE', /The MIT License[\s\S]*PROVIDED 'AS IS'/)
        done()
      })
    })

    it('lists the copyright holder', function(done) {
      var copyright = [new Date().getFullYear(), 'John Doe', '<john@doe.com>'].join(' ')
      mockPrompt(this.generator, { userName: 'John Doe', userEmail: 'john@doe.com' })

      this.generator.run({}, function () {
        assert.fileContent('LICENSE', new RegExp(copyright))
        done()
      })
    })
  })

  it('README.md refers to the package', function(done) {
    mockPrompt(this.generator, { packageName: 'some-awesome Package' })

    this.generator.run({}, function () {
      assert.fileContent('README.md', /^# node-some-awesome-package/)
      assert.fileContent('README.md', /\$ npm install some-awesome-package/)
      done()
    })
  })

  describe('package.json', function() {
    beforeEach(function() {
      mockPrompt(this.generator, {
        packageName: 'some-awesome Package',
        githubUser:  'johndoe',
        userName:    'John Doe',
        userEmail:   'john@doe.com'
      })
    })

    it('sets the package name', function(done) {
      this.generator.run({}, function () {
        assert.equal(pkg.read('name'), 'some-awesome-package')
        done()
      })
    })

    it('sets the author', function(done) {
      this.generator.run({}, function () {
        assert.deepEqual(pkg.read('author'), {
          name:  'John Doe',
          email: 'john@doe.com',
          url:   'https://github.com/johndoe'
        })
        done()
      })
    })

    it('sets the description', function(done) {
      this.generator.run({}, function () {
        assert.equal(pkg.read('description'), 'description for some-awesome-package')
        done()
      })
    })

    it('sets the homepage', function(done) {
      this.generator.run({}, function () {
        assert.equal(pkg.read('homepage'), 'https://github.com/johndoe/node-some-awesome-package')
        done()
      })
    })

    it('sets the bugs page', function(done) {
      this.generator.run({}, function () {
        assert.equal(pkg.read('bugs'), 'https://github.com/johndoe/node-some-awesome-package/issues')
        done()
      })
    })

    it('sets the repository', function(done) {
      this.generator.run({}, function () {
        assert.deepEqual(pkg.read('repository'), {
          type: 'git',
          url: 'https://github.com/johndoe/node-some-awesome-package.git'
        })
        done()
      })
    })
  })

  context('when no tests are included', function() {
    beforeEach(function() {
      mockPrompt(this.generator, { includeTests: false })
    })

    it('does not create test files', function(done) {
      this.generator.run({}, function () {
        assert.noFile(['test', 'test/mocha.opts', 'test/support.js', 'test/specs/jshint_spec.js'])
        done()
      })
    })

    it('does not add dev dependencies related to testing', function(done) {
      this.generator.run({}, function () {
        assert.deepEqual(pkg.read('devDependencies'), {})
        done()
      })
    })
  })

  context('when tests are included', function() {
    context('when no test additions are chosen', function() {
      beforeEach(function() {
        mockPrompt(this.generator, { includeTests: true, testAdditions: [] })
      })

      it('creates files for basic testing', function(done) {
        this.generator.run({}, function () {
          assert.file(['test/mocha.opts', 'test/support.js'])
          done()
        })
      })

      it('does not add a jshint spec', function(done) {
        this.generator.run({}, function () {
          assert.noFile('test/specs/jshint_spec.js')
          done()
        })
      })

      describe('test/support.js', function() {
        it('sets up Chai.js', function(done) {
          this.generator.run({}, function () {
            assert.fileContent('test/support.js', /var chai = require\('chai'\)/)
            assert.fileContent('test/support.js', /chai.should\(\)/)
            assert.fileContent('test/support.js', /global.chai = chai/)
            done()
          })
        })

        it('does not set up Sinon / Sinon-Chai', function(done) {
          this.generator.run({}, function () {
            assert.noFileContent('test/support.js', /sinon/)
            done()
          })
        })
      })

      describe('package.json', function() {
        it('adds dev dependencies for basic testing', function(done) {
          this.generator.run({}, function () {
            var devDependencies = Object.keys(pkg.read('devDependencies'))

            assert.deepEqual(devDependencies, ['chai', 'mocha'])
            done()
          })
        })

        it('sets the test script', function(done) {
          this.generator.run({}, function () {
            assert.equal(pkg.read('scripts', 'test'), 'mocha test')
            done()
          })
        })
      })
    })

    context('With test addition Mocha-JSHint', function() {
      beforeEach(function() {
        mockPrompt(this.generator, { includeTests: true, testAdditions: ['mochaJSHint'] })
      })

      it('creates the spec file', function(done) {
        this.generator.run({}, function () {
          assert.file('test/specs/jshint_spec.js')
          done()
        })
      })

      it('adds dev dependencies', function(done) {
        this.generator.run({}, function () {
          assert(pkg.read('devDependencies', 'mocha-jshint'))
          done()
        })
      })
    })

    context('With test addition Sinon / Sinon-Chai', function() {
      beforeEach(function() {
        mockPrompt(this.generator, { includeTests: true, testAdditions: ['sinon'] })
      })

      it('adds dev dependencies', function(done) {
        this.generator.run({}, function () {
          var devDependencies = pkg.read('devDependencies')

          assert(devDependencies.sinon && devDependencies['sinon-chai'])
          done()
        })
      })

      it('sets up Chai.js', function(done) {
        this.generator.run({}, function () {
          assert.fileContent('test/support.js', /var sinonChai = require\('sinon-chai'\)/)
          assert.fileContent('test/support.js', /chai.use\(sinonChai\)/)
          assert.fileContent('test/support.js', /global.sinon = require\('sinon'\)/)
          done()
        })
      })
    })
  })
})
