// const fs = require('node:fs/promises');

// (async () => {
// 	const fileHandle = await fs.open(`${__dirname}/test.txt`, 'w');

// 	console.time('writeMany');
// 	for (let i = 0; i < 1000000; i++) {
// 		await fileHandle.write(`${i} \n`);
// 	}
// 	console.timeEnd('writeMany');

// 	fileHandle.close();
// })();

// const fs = require('node:fs');

// (async () => {
// 	console.time('writeMany');

// 	fs.open(`${__dirname}/test.txt`, 'w', (error, fd) => {
// 		for (let i = 0; i < 1000000; i++) {
// 			const buff = Buffer.from(` ${i} `, 'utf-8');
// 			fs.writeSync(fd, buff);
// 		}
// 		console.timeEnd('writeMany');
// 	});
// })();

// const fs = require('node:fs/promises');

// (async () => {
// 	console.time('writeMany');
// 	const fileHandle = await fs.open(`${__dirname}/test.txt`, 'w');

// 	const stream = fileHandle.createWriteStream();

// 	for (let i = 0; i < 1000000; i++) {
// 		const buff = Buffer.from(` ${i} `, 'utf-8');
// 		stream.write(buff);
// 	}
// 	console.timeEnd('writeMany');

// 	fileHandle.close();
// })();

const fs = require('node:fs/promises');

(async () => {
	console.time('writeMany');
	const fileHandle = await fs.open(`${__dirname}/test.txt`, 'w');

	const stream = fileHandle.createWriteStream();

	// console.log(stream.writableHighWaterMark);

	// const buff = Buffer.alloc(16383, 'a');
	// console.log(stream.write(buff));
	// console.log(stream.write(Buffer.alloc(1, 'a')));

	// stream.on('drain', () => {
	// 	console.log('We are now safe to write more');
	// });

	// setInterval(() => {}, 1000);

	// console.timeEnd('writeMany');
	let i = 0;

	const numberOfWrites = 1000000;

	const writeMany = () => {
		while (i < numberOfWrites) {
			const buff = Buffer.from(` ${i} `, 'utf-8');

			i++;

			if (i === numberOfWrites - 1) {
				return stream.end();
			}

			if (!stream.write(buff)) {
				break;
			}
		}
	};

	writeMany();

	stream.on('drain', () => {
		writeMany();
	});

	stream.on('finish', () => {
		console.timeEnd('writeMany');
		fileHandle.close();
	});
})();
