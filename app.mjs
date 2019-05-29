import express from 'express';
import fs from 'fs';
import { join } from 'path';
import ping from './packages/ping';
import index from './packages/index';
import health from './packages/health';
import client from './packages/client';
import graceful from './packages/graceful-shutdown';
import time from './packages/time';

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
const respond = (request, response) => response.send('-');

const sanitise = str => String(str).replace(/\W/g, '_').toLowerCase();

const timer = time(({
    method,
    route,
    status,
    duration,
}) => console.log(
    'route statistics',
    [
        'method',
        method,
        'route',
        route,
        'status',
        status,
    ].map(sanitise).join('.'),
    duration
));

(async() => {
	let server;
	app.use(timer);
	app.use(({url, method}, response, next) => {
		console.log(method, url);
		next();
	});

	app.get('/ping', ping);
	// app.get('/health', health);
	app.get('/client', client());
	app.get('/wait/:delay', ({params: {delay = 0}}, response) => setTimeout(() => response.status(200).type('txt').send(delay), Number(delay)));
	app.get('/users/:user_id', respond);
	app.patch('/users/:user_id', respond);
	app.delete('/users/:user_id', respond);
	app.get('/users', respond);
	app.post('/users', respond);
	app.get(
		'/health',
		(request, response) => response.status(server.shuttingDown ? 503 : 200).end()
	);

	app.all(
		'*',
		index(
			app,
			{
				filter: (method, path) => !['/ping', '*'].includes(path)
			}
		).route
	);


	server = app.listen(
		PORT,
		() => console.log(
			`Listening on http://localhost:${server._connectionKey.split(':').pop()} with routes:`,
			'\n',
			index(
				app,
				{
					filter: (method, path) => path !== '*'
				}
			)
		)
	);

	graceful(server, {timeout: 10000});

	server.on(
		'connection',
		(socket, start = Date.now()) => ['close', 'error', 'timeout'].forEach(
			event => socket.on(
				event,
				() => console.debug(`Socket terminated after ${Date.now() - start}ms on ${event} event`)
			)
		)
	);

})();
