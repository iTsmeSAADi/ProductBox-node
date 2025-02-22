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



module.exports = { getTitles };
