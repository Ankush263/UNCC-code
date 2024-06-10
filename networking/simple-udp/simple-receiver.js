const dgram = require('dgram');

const receiver = dgram.createSocket('udp4');

receiver.on('message', (message, rinfo) => {
	console.log(`Server got:  ${message} from ${rinfo.address}:${rinfo.port}`);
});

receiver.bind({ port: 8000, address: '127.0.0.1' });

receiver.on('listening', () => {
	console.log('Server listening: ', receiver.address());
});
