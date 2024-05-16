const EventEmitter = require('./events');

class Emitter extends EventEmitter {}

const myE = new Emitter();

myE.on('foo', () => {
	console.log('An event Occurred 1.');
});

myE.on('foo', () => {
	console.log('An event Occurred 2.');
});

myE.on('foo', (x) => {
	console.log('An event with parameters Occurred.');
	console.log(x);
});

myE.emit('foo', 'Ankush Banik');
