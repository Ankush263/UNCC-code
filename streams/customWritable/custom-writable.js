const { Writable } = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
	constructor({ highWaterMark, fileName }) {
		super({ highWaterMark });

		this.fileName = fileName;
		this.fd = null;
		this.chunks = [];
		this.chunksSize = 0;
		this.writesCount = 0;
	}

	// This will run after the constructor, and it will put off all calling the other
	// methods until we call the callback function
	_construct(callback) {
		fs.open(this.fileName, 'w', (err, fd) => {
			if (err) {
				// If we call the callback with an argument, it means that we have an error
				// and we should not proceed
				callback(err);
			} else {
				this.fd = fd;
				// no argument means it was successful
				callback();
			}
		});
	}

	_write(chunk, encoading, callback) {
		this.chunks.push(chunk);
		this.chunksSize += chunk.length;

		if (this.chunksSize > this.writableHighWaterMark) {
			fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
				if (err) {
					return callback(err);
				}
				this.chunks = [];
				this.chunksSize = 0;
				++this.writesCount;
				callback();
			});
		} else {
			callback();
		}
	}

	_final(callback) {
		fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
			if (err) return callback(err);

			this.chunks = [];
			callback();
		});
	}

	_destroy(error, callback) {
		console.log('Number of writes: ', this.writesCount);

		if (this.fd) {
			fs.close(this.fd, (err) => {
				callback(err || error);
			});
		} else {
			callback(error);
		}
	}
}

// const stream = new FileWriteStream({
// 	highWaterMark: 1800,
// 	fileName: 'text.txt',
// });

// stream.write(Buffer.from('This is some string'));
// stream.end(Buffer.from('Our last write.'));

// stream.on('finish', () => {
// 	console.log('Stream was finished.');
// });
// // stream.on('drain', () => {});

(async () => {
	console.time('writeMany');

	const stream = new FileWriteStream({
		fileName: 'text.txt',
	});

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
	});
})();
