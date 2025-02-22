// This file sets up the HTTP server and delegates request handling
// for GET /I/want/title to the plainCallbacks implementation.

const http = require('http');
const url = require('url');
const { getTitles } = require('./cb');

// Create the HTTP server.
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Check that the method is GET and the pathname is /I/want/title.
  if (req.method === 'GET' && parsedUrl.pathname === '/I/want/title') {
    // Extract the "address" query parameter(s).
    let addresses = parsedUrl.query.address;
    
    // Call our getTitles function from plainCallbacks.js.
    getTitles(addresses, (err, html) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      }
    });
  } else {
    // For any other route, return 404.
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Start the server on port 3000.
server.listen(3000, () => {
  console.log('Server running on port', 3000);
});
