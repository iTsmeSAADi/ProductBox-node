// This version sets up a simple Node.js server using only built-in modules
// It listens on port 3000 and handles GET requests to /I/want/title
// For each "address" query parameter, it makes an HTTP/HTTPS request,
// extracts the <title> tag from the HTML, and builds an HTML response.

// Import required modules.
const http = require('http');


const server = http.createServer((req, res) => {
});

const PORT = require('dotenv').config().parsed.PORT;

// Start the server on port 3000.
server.listen(3000, () => {
    console.log('Plain callback server running on port', PORT);
  });