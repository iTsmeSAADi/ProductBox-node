// This module implements the plain Node.js with callbacks version
// It exports a single function: getTitles(addresses, callback)
// which will fetch the titles for each provided address and return an HTML string.

const http = require('http');
const https = require('https');
const url = require('url');

// Helper function to fetch a page and extract its <title>
// Uses error-first callback style.
function fetchTitle(address, callback) {
  // If protocol is missing, assume http://
  if (!/^https?:\/\//i.test(address)) {
    address = 'http://' + address;
  }
  const parsedUrl = url.parse(address);
  const lib = parsedUrl.protocol === 'https:' ? https : http;

  // Make the GET request.
  lib.get(address, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      // Regex to capture the content between <title> and </title>
      const match = data.match(/<title>([^<]*)<\/title>/i);
      if (match && match[1]) {
        callback(null, match[1]);
      } else {
        callback(new Error('No title found'));
      }
    });
  }).on('error', (err) => {
    callback(err);
  });
}

// Main function: getTitles
// Accepts an array of addresses and a callback.
// The callback will be called with (err, htmlResult)
function getTitles(addresses, callback) {
  // Ensure addresses is an array.
  if (!Array.isArray(addresses)) {
    addresses = [addresses];
  }
  const results = [];
  let pending = addresses.length;

  addresses.forEach((addr) => {
    fetchTitle(addr, (err, title) => {
      // On error, set title to "NO RESPONSE"
      if (err) {
        results.push({ address: addr, title: 'NO RESPONSE' });
      } else {
        results.push({ address: addr, title: title });
      }
      pending--;
      // When all addresses are processed...
      if (pending === 0) {
        // Build the HTML output.
        let html = `<html>
  <head></head>
  <body>
    <h1>Following are the titles of given websites:</h1>
    <ul>`;
        results.forEach((item) => {
          html += `<li>${item.address} - "${item.title}"</li>`;
        });
        html += `</ul>
  </body>
</html>`;
        // Return the final HTML.
        callback(null, html);
      }
    });
  });
}

module.exports = { getTitles };
