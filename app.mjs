import express from 'express';
import fs from 'fs';
import scope from 'module-scope';
import {join} from 'path';

const {__dirname} = scope(import.meta.url);

process.on('unhandledRejection', console.error);
const {promises: {lstat, readdir}} = fs;
const isDirectory = async source => (await lstat(source)).isDirectory();
const lsdir = async source => (await readdir(source))
	.map(
		name => join(source, name)
	).filter(isDirectory);

const app = express();
app.set('x-powered-by', false);
app.set('etag', () => null);

const {PORT = 1337} = process.env;

(async() => {
	const base = join(__dirname, 'packages');
	const routes = await lsdir(base);
	const clean = route => route.replace(base, '');
	const li = str => `• ${str}`;

	async function addRoute(route) {
		const {default: handler} = await import(route);
		app.get(
			clean(route),
			handler
		);
	}

	app.get('/', (request, response, next) => {
		response
			.status(200)
			.type('text/html')
			.send(
				routes
					.map(clean)
					.map(route => `<li><a href="${route}">${route}</a></li>`)
					.join('\n')
			);
	});

	await Promise.all(routes.map(addRoute));

	const server = app.listen(
		PORT,
		() => console.log([
			`Listening on http://0.0.0.0:${server._connectionKey.split(':').pop()} with routes:`,
			...routes.map(clean).map(li),
		].join('\n'))
	);
})();
