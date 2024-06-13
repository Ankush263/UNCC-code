const http = require('node:http');

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
	agent,
	hostname: 'localhost',
	port: 8050,
	method: 'POST',
	path: '/create-post',
	headers: {
		'Content-Type': 'application/json',
		// 'Content-Length': Buffer.byteLength(
		// 	JSON.stringify({ message: 'Hey are you still there?' }),
		// 	'utf-8'
		// ),
		name: 'Ankush',
	},
});

// This event is emitted only once
request.on('response', (response) => {
	console.log('-------STATUS: -------');
	console.log(response.statusCode);

	console.log('-------HEADERS: -------');
	console.log(response.headers);

	console.log('-------BODY: -------');
	response.on('data', (chunk) => {
		console.log(chunk.toString('utf-8'));
	});

	response.on('end', () => {
		console.log('No more data in response');
	});
});

request.end(
	JSON.stringify({
		title: 'Title of my post!',
		body: 'This is some demo text only for testing purpose',
	})
);
