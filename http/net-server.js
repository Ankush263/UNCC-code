const net = require('net');

const server = net.createServer((socket) => {
	socket.on('data', (data) => {
		console.log('form net-server: ', data.toString('utf-8'));
	});

	const response = Buffer.from(
		'485454502f312e3120323030204f4b0d0a436f6e74656e742d547970653a206170706c69636174696f6e2f6a736f6e0d0a446174653a205765642c203132204a756e20323032342030353a30373a343620474d540d0a436f6e6e656374696f6e3a206b6565702d616c6976650d0a4b6565702d416c6976653a2074696d656f75743d350d0a5472616e736665722d456e636f64696e673a206368756e6b65640d0a0d0a34350d0a7b226d657373616765223a22506f73742077697468207469746c65205469746c65206f66206d7920706f73742120776173206372656174656420627920416e6b757368227d0d0a300d0a0d0a',
		'hex'
	);

	socket.write(response);
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Opened server on: ', server.address());
});