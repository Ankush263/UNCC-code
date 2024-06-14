const http = require('node:http');
const fs = require('node:fs/promises');

class Butter {
	constructor() {
		this.server = http.createServer();

		/*
    * {
    *  "get/": () => { ... }
    *  "post/upload": () => { ... }
    * }

    * this.routes["get/"]()
    */

		this.routes = {};
		this.middleware = [];

		// Send a file back to client
		this.server.on('request', (req, res) => {
			res.sendFile = async (path, mime) => {
				const fileHandle = await fs.open(path, 'r');
				const fileStream = fileHandle.createReadStream();

				res.setHeader('Content-Type', mime);

				fileStream.pipe(res);
			};

			// Set the status code of the response
			res.status = (code) => {
				res.statusCode = code;
				return res;
			};

			// Send JSON data back to the client (for small JSON data less than the highWatermark value)
			res.json = (data) => {
				// This is only good for bodies that their size is less than highWaterMark value
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(data));
			};

			const runMiddleware = (req, res, middleware, index) => {
				if (index === middleware.length) {
					// If the routes object does not have a key of req.methid + req.url, return 404
					if (!this.routes[req.method.toLowerCase() + req.url]) {
						return res
							.status(404)
							.json({ error: `Cannot ${req.method} ${req.url}` });
					}

					this.routes[req.method.toLowerCase() + req.url](req, res);
				} else {
					middleware[index](req, res, () => {
						runMiddleware(req, res, middleware, index + 1);
					});
				}
			};

			runMiddleware(req, res, this.middleware, 0);
		});
	}

	beforeEach(cb) {
		this.middleware.push(cb);
	}

	listen(port, cb) {
		this.server.listen(port, () => {
			cb();
		});
	}

	route(method, path, cb) {
		this.routes[method + path] = cb;
	}
}

module.exports = Butter;
