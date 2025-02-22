// This module implements the title-fetching logic using RxJS.
// It exports a function getTitlesRx(addresses) that returns an Observable which,
// when subscribed to, eventually yields an HTML string containing the titles
// for each provided address.

const http = require('http');
const https = require('https');
const url = require('url');
// Import required functions/operators from RxJS.
const { from } = require('rxjs');
const { mergeMap, toArray } = require('rxjs/operators');

/**
 * Helper function that wraps an HTTP/HTTPS request in a Promise.
 * It fetches the page from the given address and extracts the <title> tag.
 * If something goes wrong or no title is found, it resolves with "NO RESPONSE".
 *
 * @param {string} address - The website address.
 * @returns {Promise<Object>} A promise that resolves with an object { address, title }.
 */
function fetchTitleRx(address) {
  return new Promise((resolve) => {
    // If no protocol is provided, assume http://
    if (!/^https?:\/\//i.test(address)) {
      address = 'http://' + address;
    }
    const parsedUrl = url.parse(address);
    const lib = parsedUrl.protocol === 'https:' ? https : http;
    
    lib.get(address, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        // Use regex to extract content between <title> tags.
        const match = data.match(/<title>([^<]*)<\/title>/i);
        if (match && match[1]) {
          resolve({ address, title: match[1] });
        } else {
          resolve({ address, title: 'NO RESPONSE' });
        }
      });
    }).on('error', () => {
      resolve({ address, title: 'NO RESPONSE' });
    });
  });
}

/**
 * Main function that accepts an array (or single string) of addresses.
 * It converts the array into an Observable, uses mergeMap to process each
 * address with fetchTitleRx, and finally collects all results into an array.
 * The final Observable then maps that array into an HTML string.
 *
 * @param {string|string[]} addresses - One or more website addresses.
 * @returns {Observable<string>} An Observable that will emit the final HTML string.
 */
function getTitlesRx(addresses) {
  // Normalize addresses to an array.
  if (!Array.isArray(addresses)) {
    addresses = [addresses];
  }
  
  // Create an Observable from the addresses array.
  return from(addresses).pipe(
    // For each address, perform the HTTP request via fetchTitleRx.
    mergeMap((addr) => fetchTitleRx(addr)),
    // Collect all results into an array.
    toArray(),
    // Once all results are in, build the HTML string.
    mergeMap((results) => {
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
      // Wrap the final HTML in an Observable.
      return from(Promise.resolve(html));
    })
  );
}

module.exports = { getTitlesRx };
