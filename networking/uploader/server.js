const net = require('net');
const fs = require('node:fs/promises');

const server = net.createServer(() => {});

server.on('connection', (socket) => {
	console.log('New connection!');

	let fileHandle, fileWriteStream;

	socket.on('data', async (data) => {
		if (!fileHandle) {
			socket.pause(); // pause receiving data from the client

			const indexOfDivider = data.indexOf('-------');
			const fileName = data.subarray(10, indexOfDivider).toString('utf-8');

			fileHandle = await fs.open(`storage/${fileName}`, 'w');
			fileWriteStream = fileHandle.createWriteStream(); // The stream to write to

			fileWriteStream.write(data.subarray(indexOfDivider + 7));

			socket.resume(); // resume receiving data from the client
			fileWriteStream.on('drain', () => {
				socket.resume();
			});
		} else {
			if (!fileWriteStream.write(data)) {
				socket.pause();
			}
		}
	});

	socket.on('end', () => {
		if (fileHandle) fileHandle.close();
		console.log('Connection ended');
		fileHandle = undefined;
		fileWriteStream = undefined;
	});
});

server.listen(5050, '::1', () => {
	console.log('Uploader server opened on', server.address());
});
