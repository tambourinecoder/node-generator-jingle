"use strict";

var _s = require('underscore.string')
  , path = require('path')


function guessUser(git) {
  return {
    githubUser: git.email.split('@')[0],
    userName: git.username,
    userEmail: git.email
  }
}

function guessPackageName() {
  var cwdBase = path.basename(process.cwd())

  return _s.slugify(
    cwdBase.replace(/^node[-_]/, '')
  )
}

module.exports = function buildPrompts(git) {
  var userGuesses = guessUser(git)

  return [{
    name: 'packageName',
    message: 'Package name?',
    default: guessPackageName()
  }, {
    name: 'githubUser',
    message: 'Github user?',
    default: userGuesses.githubUser
  }, {
    name: 'userName',
    message: 'Name?',
    default: userGuesses.userName
  }, {
    name: 'userEmail',
    message: 'Email?',
    default: userGuesses.userEmail
  }, {
    type: 'confirm',
    name: 'includeTests',
    message: 'Include tests?',
    default: true
  }, {
    when: function(response) { return response.includeTests },

    type: 'checkbox',
    name: 'testAdditions',
    message: 'Choose test additions:',
    choices: [{
      name: 'Mocha-JSHint',
      value: 'mochaJSHint',
      checked: true
    }, {
      name: 'Sinon / Sinon-Chai',
      value: 'sinon',
      checked: false
    }]
  }]
}
