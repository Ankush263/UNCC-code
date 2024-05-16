const fs = require('node:fs/promises');

(async () => {
	// commands
	const CREATE_FILE = 'create a file';
	const DELETE_FILE = 'delete the file';
	const RENAME_FILE = 'rename the file';
	const ADD_TO_FILE = 'add to the file';

	const createFile = async (path) => {
		try {
			const existingFileHandle = await fs.open(path, 'r');
			existingFileHandle.close();

			// We already have the file...
			return console.log(`The file ${path} already exists.`);
		} catch (error) {
			// we don't have the file, now we should create it
			const newFileHandle = await fs.open(path, 'w');
			console.log('A new file was successfully created');
			newFileHandle.close();
		}
	};

	const deleteFile = async (path) => {
		try {
			const existingFileHandle = await fs.open(path, 'r');
			existingFileHandle.close();
			await fs.unlink(path);
			console.log(`Deleting ${path} Successfull...`);
		} catch (error) {
			console.log(`File Path: ${path} does not exists`);
		}
	};

	const renameFile = async (oldPath, newPath) => {
		try {
			const existingFileHandle = await fs.open(oldPath, 'r');
			existingFileHandle.close();
			await fs.rename(oldPath, newPath);
			console.log(`Renaming Successfull...`);
		} catch (error) {
			console.log(`File Path: ${oldPath} does not exists`);
		}
	};

	let addedContent;

	const addToFile = async (path, content) => {
		if (addedContent === content) return;
		try {
			const existingFileHandle = await fs.open(path, 'a');
			await existingFileHandle.write(content);
			addedContent = content;
			console.log(`Adding Successfull...`);
			existingFileHandle.close();
		} catch (error) {
			console.log(`File Path: ${path} does not exists`);
		}
	};

	const commandFileHandler = await fs.open('./command.txt', 'r');

	commandFileHandler.on('change', async () => {
		// Get the file size in bytes
		const size = (await commandFileHandler.stat()).size;
		// allocate our buffer with the size of the file
		const buff = Buffer.alloc(size);
		// the location at which we want to start filling out buffer
		const offset = 0;
		// how many bytes we want to read
		const length = buff.byteLength;
		// the position that we want to start reading the file from
		const position = 0;

		// we always want to read the whole content (from beginning all the way to the end)
		await commandFileHandler.read(buff, offset, length, position);

		const commands = buff.toString('utf-8');

		if (commands.includes(CREATE_FILE)) {
			const filePath = commands.substring(CREATE_FILE.length + 1);
			createFile(filePath);
		}

		if (commands.includes(DELETE_FILE)) {
			const filePath = commands.substring(DELETE_FILE.length + 1);
			deleteFile(filePath);
		}

		if (commands.includes(RENAME_FILE)) {
			const _idx = commands.indexOf(' to ');
			const oldFilePath = commands.substring(RENAME_FILE.length + 1, _idx);
			const newFilePath = commands.substring(_idx + 4);

			renameFile(oldFilePath, newFilePath);
		}

		if (commands.includes(ADD_TO_FILE)) {
			const _idx = commands.indexOf(' this content: ');
			const filePath = commands.substring(ADD_TO_FILE.length + 1, _idx);
			const content = commands.substring(_idx + 15);

			addToFile(filePath, content);
		}
	});

	const watcher = fs.watch('./command.txt');
	// JS async iterator
	for await (const event of watcher) {
		// Check for the content changes
		if (event.eventType === 'change') {
			commandFileHandler.emit('change');
		}
	}
})();
