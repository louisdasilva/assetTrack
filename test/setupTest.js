const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<html><body><div id="card-section"></div></body></html>', {
  url: 'http://localhost',
});
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};

// Add any other browser APIs you need to mock
global.$ = require('jquery'); // If you're using jQuery in your code

// Set up chai
const { expect } = require('chai');
global.expect = expect;