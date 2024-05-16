const EventEmitter = require('node:events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

myEmitter.on('test', () => {
	console.log('an event is occurred 1');
});

myEmitter.once('test', () => {
	console.log('an event is occurred 2');
	process.nextTick(() => {
		console.log('from callback'); // Asynchronously
	});
});

myEmitter.on('test', () => {
	console.log('an event is occurred 3');
});

myEmitter.emit('test');
myEmitter.emit('test');
