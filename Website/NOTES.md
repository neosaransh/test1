# Notes for whoever may continue this project

The site may be run in "development mode" by running `npm start`. This sets up a development server that provides error information, live updates of pages, and forwards API requests to `http://localhost:3001`; this is configured in package.json. A production 
version of the code may be generated by running `npm run-script build`. This generates a small tree of files to be served statically; eventually, this should be combined into the code in `Backend` to host everything from a single Node.js/express instance. The 
other websites (not yet in this repository) should probably also be included.

For API requests, there are a few options:
- Host the API and website on the same origin (protocol, domain/subdomain, and port) under a virtual directory such as `/api` (this can be accomplished with an express router). In this case, add a prefix to the path in `src/ApiRequest.js`, and in the equivalent 
location in the mobile app code.
- Host the API on a dedicated subdomain (on a dedicated Node.js/express instance), and forward requests to the actual subdomain through a virtual directory. This will also require a prefix to be added. This is more complex, but allows a single, separated instance 
of the API server to be accessed from multiple subdomains. Not worth it otherwise.
- Host the API on a dedicated subdomain (not necessarily on a separate instance), and configure express to provide cross-origin resource sharing headers as described [here](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing). This keeps things modular, 
while still keeping it efficient and relatively simple. Probably should chose this over second option.