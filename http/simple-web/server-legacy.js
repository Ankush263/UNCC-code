const http = require('node:http');
const fs = require('node:fs/promises');

const server = http.createServer();

server.on('request', async (req, res) => {
	if (req.url === '/' && req.method === 'GET') {
		res.setHeader('Content-Type', 'text/html');

		const fileHandle = await fs.open('./public/index.html', 'r');
		const fileStream = fileHandle.createReadStream();

		fileStream.pipe(res);
	}

	if (req.url === '/styles.css' && req.method === 'GET') {
		res.setHeader('Content-Type', 'text/css');

		const fileHandle = await fs.open('./public/styles.css', 'r');
		const fileStream = fileHandle.createReadStream();

		fileStream.pipe(res);
	}

	if (req.url === '/scripts.js' && req.method === 'GET') {
		res.setHeader('Content-Type', '	text/javascript');

		const fileHandle = await fs.open('./public/scripts.js', 'r');
		const fileStream = fileHandle.createReadStream();

		fileStream.pipe(res);
	}

	if (req.url === '/login' && req.method === 'POST') {
		res.setHeader('Content-Type', 'application/json');
		res.statusCode = 200;

		const body = {
			message: 'Logging you in...',
		};

		res.end(JSON.stringify(body));
	}

	if (req.url === '/user' && req.method === 'PUT') {
		res.setHeader('Content-Type', 'application/json');
		res.statusCode = 200;

		const body = {
			message: 'Updating your info...',
		};

		res.end(JSON.stringify(body));
	}

	if (req.url === '/upload' && req.method === 'PUT') {
		const fileHandle = await fs.open('./storage/image.png', 'w');
		const fileStream = fileHandle.createWriteStream();
		res.setHeader('Content-Type', 'application/json');

		req.pipe(fileStream);

		req.on('end', () => {
			res.end(JSON.stringify({ message: 'File was uploaded successfully!' }));
		});
	}
});

server.listen(9000, () => {
	console.log('Web server is live at http://localhost:9000');
});
