# ProductBox Node.js Task

This repository contains my solution for the ProductBox test. The objective was to build a Node.js server that responds to a single route (`/I/want/title`) and accepts one or more website addresses as query parameters. For every address provided, the server makes an HTTP/HTTPS request, extracts the content from the `<title>` tags, and returns an HTML page listing each address with its corresponding title. If the title isn’t found or an error occurs, “NO RESPONSE” is shown for that address.

---

## Project Structure

I've organized the solution so that the server and each asynchronous implementation are separated. This makes it easier to see how the task was solved using different approaches.

- **server.js**  
  Contains the HTTP server setup. It listens on port 3000 and routes incoming requests to the chosen implementation.

- **plainCallbacks.js**  
  Implements the task using plain Node.js callbacks. This is a straightforward version without any extra libraries.

- **asyncCallbacks.js**  
  Implements the task using the [async.js](https://caolan.github.io/async/) library, which simplifies managing multiple parallel asynchronous operations.

- **promises.js**  
  Implements the task using Promises and `Promise.all` to handle multiple requests concurrently.

- **rxjsStreams.js** (Bonus)  
  Implements the task using [RxJS](https://rxjs.dev/), treating the list of addresses as a stream and processing them with operators like `mergeMap` and `toArray`.

---

## Setup and Running

1. **Clone the Repository**

   ```bash
   git clone https://github.com/iTsmeSAADi/ProductBox-node.git
   cd ProductBox-node
