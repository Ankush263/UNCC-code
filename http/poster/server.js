const Butter = require('../butter');

// { userId: 1, tokan: 5266128 }
const SESSIONS = [];

const USERS = [
	{ id: 1, name: 'Liam Brown', username: 'liam23', password: 'string' },
	{ id: 2, name: 'Ankush Banik', username: 'ankush263', password: 'string' },
	{ id: 3, name: 'John Doe', username: 'John22', password: 'string' },
];

const POSTS = [
	{
		id: 1,
		title: 'This is a post title',
		body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
		userId: 1,
	},
];

const PORT = 8000;

const server = new Butter();

server.beforeEach((req, res, next) => {
	const routesToAuthenticate = [
		'GET /api/user',
		'PUT /api/user',
		'POST /api/posts',
		'DELETE /api/logout',
	];

	if (routesToAuthenticate.indexOf(req.method + ' ' + req.url) !== -1) {
		if (req.headers.cookie) {
			const token = req.headers.cookie.split('=')[1];

			const session = SESSIONS.find((session) => session.token === token);
			if (session) {
				req.userId = session.userId;
				return next();
			}
		}

		return res.status(401).json({ error: 'Unauthorized' });
	} else {
		next();
	}
});

const parseJSON = (req, res, next) => {
	// This is only good for bodies that their size is less than highWaterMark value
	if (req.headers['content-type'] === 'application/json') {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk.toString('utf-8');
		});

		req.on('end', () => {
			body = JSON.parse(body);
			req.body = body;
			return next();
		});
	} else {
		next();
	}
};

// For parsing small body
server.beforeEach(parseJSON);

// For different routes that need index.html file
server.beforeEach((req, res, next) => {
	const routes = ['/', '/login', '/profile', '/new-post'];
	if (routes.indexOf(req.url) !== -1 && req.method === 'GET') {
		return res.status(200).sendFile('./public/index.html', 'text/html');
	} else {
		next();
	}
});

// ---------- Files Routes ---------- //

server.route('get', '/styles.css', (req, res) => {
	res.sendFile('./public/styles.css', 'text/css');
});

server.route('get', '/scripts.js', (req, res) => {
	res.sendFile('./public/scripts.js', 'text/javascript');
});

// ---------- JSON Routes ---------- //

// Log an user and give them a token
server.route('post', '/api/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	// Check if the user exists
	const user = USERS.find((user) => user.username === username);

	// Check the password if the user was found
	if (user && user.password === password) {
		const token = Math.floor(Math.random() * 10000000).toString();

		SESSIONS.push({ userId: user.id, token: token });

		res.setHeader('Set-Cookie', `token=${token}; path=/;`);

		res.status(200).json({ message: 'Logged in successfully!' });
	} else {
		res.status(401).json({ error: 'Invalid username or password' });
	}
});

server.route('delete', '/api/logout', (req, res) => {
	// Remove the session object from the session array
	const sessionIndex = SESSIONS.findIndex(
		(session) => session.userId === req.userId
	);

	if (sessionIndex > -1) {
		SESSIONS.splice(sessionIndex, 1);
	}
	res.setHeader(
		'Set-Cookie',
		`token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
	);
	res.status(200).json({ message: 'Logged out successfully' });
});

server.route('put', '/api/user', (req, res) => {
	const username = req.body.username;
	const name = req.body.name;
	const password = req.body.password;

	const user = USERS.find((user) => user.id === req.userId);

	user.username = username;
	user.name = name;

	if (password) {
		user.password = password;
	}

	res.status(200).json({
		username: user.username,
		name: user.name,
		password_status: password ? 'updated' : 'not-updated',
	});
});

server.route('get', '/api/user', (req, res) => {
	const user = USERS.find((user) => user.id === req.userId);
	res.json({ username: user.username, name: user.name });
});

// Send the list of all the posts that we have
server.route('get', '/api/posts', (req, res) => {
	const posts = POSTS.map((post) => {
		const user = USERS.find((user) => user.id === post.userId);

		post.author = user.name;
		return post;
	});

	res.status(200).json(posts);
});

server.route('post', '/api/posts', (req, res) => {
	const title = req.body.title;
	const body = req.body.body;

	const post = {
		id: POSTS.length + 1,
		title: title,
		body: body,
		userId: req.userId,
	};

	POSTS.unshift(post);
	res.status(201).json(post);
});

server.listen(PORT, () => {
	console.log(`Server has started on port ${PORT}`);
});
