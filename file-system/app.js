const fs = require('node:fs/promises');

(async () => {
	const watcher = fs.watch('./command.txt');

	// JS async iterator
	for await (const event of watcher) {
		if (event.eventType === 'change') {
			console.log('The file was changed');
		}
		console.log(event);
	}
})();
