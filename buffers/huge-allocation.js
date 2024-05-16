const { Buffer, constants } = require('buffer');

const b = Buffer.alloc(1e9); // 1,000,000,000 bytes (1GB)

console.log(constants.MAX_LENGTH);

setInterval(() => {
	// b.length is the size of the buffer in bytes
	// for (let i = 0; i < b.length; i++) {
	// 	b[i] = 0x22;
	// }

	b.fill(0x22);
}, 5000);
