const net = require('net');

const socket = net.createConnection({ host: '127.0.0.1', port: 3099 }, () => {
	const buff = Buffer.alloc(2);
	buff[0] = 24;
	buff[1] = 18;

	socket.write(buff);
});
