// This module implements the title-fetching logic using async.js to manage flow control.
// It exports a function getTitles(addresses, callback) that, given an array of addresses,
// fetches each webpage, extracts the <title>, and returns an HTML string containing the results.

const http = require('http');
const https = require('https');
const url = require('url');
const async = require('async'); 

// Helper function: fetches the title from a given address using callbacks.
function fetchTitle(addr, callback) {
  // Prepend "http://" if protocol is missing.
  if (!/^https?:\/\//i.test(addr)) {
    addr = 'http://' + addr;
  }
  
  // Parse the URL and choose http or https.
  const parsedUrl = url.parse(addr);
  const lib = parsedUrl.protocol === 'https:' ? https : http;
  
  lib.get(addr, (res) => {
    let data = '';
    
    // Collect data chunks.
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    // When the response ends, extract the <title>.
    res.on('end', () => {
      const match = data.match(/<title>([^<]*)<\/title>/i);
      if (match && match[1]) {
        // Return an object with the address and the title.
        callback(null, { address: addr, title: match[1] });
      } else {
        // If no title found, return "NO RESPONSE".
        callback(null, { address: addr, title: 'NO RESPONSE' });
      }
    });
  }).on('error', () => {
    // On error, also return "NO RESPONSE" (we don’t want to break the entire flow).
    callback(null, { address: addr, title: 'NO RESPONSE' });
  });
}

// Accepts an array of addresses (or a single string) and a callback function.
// The callback is called with (error, htmlString) after all titles are processed.
function getTitles(addresses, callback) {
  // Ensure addresses is an array.
  if (!Array.isArray(addresses)) {
    addresses = [addresses];
  }
  
  // Use async.map to process each address concurrently.
  async.map(addresses, fetchTitle, (err, results) => {
    // Build an HTML string with the results.
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
    // Call the provided callback with the HTML result.
    callback(null, html);
  });
}

module.exports = { getTitles };
