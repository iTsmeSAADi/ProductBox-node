// This module implements the title-fetching logic using RxJS.
// It exports a function getTitlesRx(addresses) that returns an Observable which,
// when subscribed to, eventually yields an HTML string containing the titles
// for each provided address.

const http = require('http');
const https = require('https');
const url = require('url');


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


