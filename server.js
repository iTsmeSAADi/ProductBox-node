// This file sets up the HTTP server and delegates request handling
// for GET /I/want/title to the plainCallbacks implementation.

const http = require('http');
const url = require('url');
// const { getTitles } = require('./cb');
// const { getTitles } = require('./async_cb');
// const { getTitles } = require('./promise');
const { getTitlesRx } = require('./rxJS_stream');


// Create the HTTP server.
// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true);
  
//   // Check that the method is GET and the pathname is /I/want/title.
//   if (req.method === 'GET' && parsedUrl.pathname === '/I/want/title') {
//     // Extract the "address" query parameter(s).
//     let addresses = parsedUrl.query.address;
    
//     // Call our getTitles function from plainCallbacks.js.
//     getTitles(addresses, (err, html) => {
//       if (err) {
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('Internal Server Error');
//       } else {
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(html);
//       }
//     });
//   } else {
//     // For any other route, return 404.
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('404 Not Found');
//   }
// });

// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true);
  
//   // Check for GET /I/want/title.
//   if (req.method === 'GET' && parsedUrl.pathname === '/I/want/title') {
//     let addresses = parsedUrl.query.address;
    
//     if (!Array.isArray(addresses)) {
//       addresses = [addresses];
//     }
    
//     // Call the getTitles function from our asyncCallbacks module.
//     getTitles(addresses, (err, html) => {
//       if (err) {
//         // On error, send 500.
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('Internal Server Error');
//       } else {
//         // Otherwise, send the HTML.
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(html);
//       }
//     });
//   } else {
//     // For any other routes, return 404.
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('404 Not Found');
//   }
// });

// const server = http.createServer((req, res) => {
//   const parsedUrl = url.parse(req.url, true);

//   // Check for the correct method and path.
//   if (req.method === 'GET' && parsedUrl.pathname === '/I/want/title') {
//     let addresses = parsedUrl.query.address;
    
//     if (!Array.isArray(addresses)) {
//       addresses = [addresses];
//     }

//     // Call getTitles, which returns a Promise.
//     getTitles(addresses)
//       .then((html) => {
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(html);
//       })
//       .catch((err) => {
//         // Should rarely occur because fetchTitlePromise always resolves.
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('Internal Server Error');
//       });
//   } else {
//     // For all other routes, return a 404.
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end('404 Not Found');
//   }
// });

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // Only handle GET requests for /I/want/title.
  if (req.method === 'GET' && parsedUrl.pathname === '/I/want/title') {
    let addresses = parsedUrl.query.address;
    // Normalize to array if a single address is provided.
    if (!Array.isArray(addresses)) {
      addresses = [addresses];
    }
    
    // Call getTitlesRx, which returns an Observable.
    getTitlesRx(addresses).subscribe({
      next: (html) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      },
      error: () => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
  } else {
    // Return 404 for any other routes.
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});


// Start the server on port 3000.
server.listen(3000, () => {
  console.log('Server running on port', 3000);
});
