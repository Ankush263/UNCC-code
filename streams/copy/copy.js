const fs = require('node:fs/promises');
const { pipeline } = require('node:stream');

// (async () => {
// 	console.time('copy: ');
// 	const destFile = await fs.open('test-copy.txt', 'w');
// 	const result = await fs.readFile('test.txt');

// 	await destFile.write(result);

// 	console.timeEnd('copy: ');
// })();

// (async () => {
// 	console.time('copy: ');

// 	const srcFile = await fs.open('test.txt', 'r');
// 	const destFile = await fs.open('test-copy.txt', 'w');

// 	let bytesRead = -1;

// 	while (bytesRead !== 0) {
// 		const readResult = await srcFile.read();
// 		bytesRead = readResult.bytesRead;

// 		if (bytesRead !== 16384) {
// 			const indexOfNotFilled = readResult.buffer.indexOf(0);
// 			const newBuffer = Buffer.alloc(indexOfNotFilled);
// 			readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
// 			await destFile.write(newBuffer);
// 		} else {
// 			await destFile.write(readResult.buffer);
// 		}
// 	}

// 	console.timeEnd('copy: ');
// })();

(async () => {
	console.time('copy: ');

	const srcFile = await fs.open('test.txt', 'r');
	const destFile = await fs.open('test-copy.txt', 'w');

	const readStream = srcFile.createReadStream();
	const writeStream = destFile.createWriteStream();

	// readStream.pipe(writeStream);

	// readStream.on('end', () => {
	// 	console.timeEnd('copy: ');
	// });

	pipeline(readStream, writeStream, (err) => {
		console.log(err);
		console.timeEnd('copy: ');
	});
})();
