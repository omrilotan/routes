import express from 'express';
import fs from 'fs';
import {join} from 'path';
import ping from './packages/ping';
import index from './packages/index';

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

(async() => {
	app.use(({url, method}, response, next) => {
		console.log(method, url);
		next();
	});

	app.get('/ping', ping);
	app.get('/users/:user_id', respond);
	app.patch('/users/:user_id', respond);
	app.delete('/users/:user_id', respond);
	app.get('/users', respond);
	app.post('/users', respond);
	app.all('*', index(app, (method, path) => !['/ping', '*'].includes(path)).route);


	const server = app.listen(
		PORT,
		() => console.log(
			`Listening on http://localhost:${server._connectionKey.split(':').pop()} with routes:`,
			'\n',
			index(app, (method, path) => path !== '*')
		)
	);
})();
