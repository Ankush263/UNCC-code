const dgram = require('dgram');

// max size: 9216 bytes

const sender = dgram.createSocket({ type: 'udp4', sendBufferSize: 20000 });

sender.send('This is a string', 8000, '127.0.0.1', (err, bytes) => {
	if (err) console.log(err);
	console.log(bytes);
});
