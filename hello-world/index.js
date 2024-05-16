const http = require('node:http');
const fs = require('node:fs');

const server = http.createServer();

server.on('request', (request, response) => {
	const results = fs.readFileSync('./dummy.txt');

	response.setHeader('Content-Type', 'text/plain');

	response.end(results);
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Server is listening to the: ', server.address());
});
