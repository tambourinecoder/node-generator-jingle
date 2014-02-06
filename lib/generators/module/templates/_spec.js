/* global describe, it */
"use strict";

var <%= className %> = require('../<%= _.repeat('../', names.length) %><%= libDir %>')

describe('<%= className %>', function() {
  it('knows the answer to life, the universe, and everything', function() {
    <%= className %>.should.equal(42)
  })
})
