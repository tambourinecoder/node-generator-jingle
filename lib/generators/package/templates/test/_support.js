/**
 * Setup Chai
 */
var chai = require('chai')
chai.should()<% if (includeSinon) {%>

/**
 * Sinon-Chai
 */
var sinonChai = require('sinon-chai')
chai.use(sinonChai)<% } %>

/**
 * Globals
 */
global.chai = chai<% if (includeSinon) {%>
global.sinon = require('sinon')<% } %>
