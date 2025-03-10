// This module implements the title-fetching logic using Promises.
// It exports a function getTitles(addresses) that returns a Promise
// resolving with an HTML string containing the title info for each address.

const http = require('http');
const https = require('https');
const url = require('url');

// Helper function that returns a promise to fetch the title from the given address.
function fetchTitlePromise(address) {
  return new Promise((resolve) => {
    // Prepend "http://" if no protocol is present.
    if (!/^https?:\/\//i.test(address)) {
      address = 'http://' + address;
    }
    const parsedUrl = url.parse(address);
    const lib = parsedUrl.protocol === 'https:' ? https : http;

    lib.get(address, (res) => {
      let data = '';

      // Collect the data chunks.
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        // Try to extract the title using a regex.
        const match = data.match(/<title>([^<]*)<\/title>/i);
        if (match && match[1]) {
          resolve({ address, title: match[1] });
        } else {
          resolve({ address, title: 'NO RESPONSE' });
        }
      });
    }).on('error', () => {
      // On error, resolve with NO RESPONSE.
      resolve({ address, title: 'NO RESPONSE' });
    });
  });
}


// Main function: getTitles
// Accepts addresses (either a string or an array) and returns a Promise
// that resolves with the final HTML string.
function getTitles(addresses) {
    // Normalize addresses to an array.
    if (!Array.isArray(addresses)) {
      addresses = [addresses];
    }
  
    // Map each address to its corresponding Promise.
    return Promise.all(addresses.map(fetchTitlePromise))
      .then((results) => {
        // Build the HTML response.
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
        return html;
      });
  }

module.exports = { getTitles };
