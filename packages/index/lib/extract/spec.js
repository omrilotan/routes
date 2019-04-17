const {METHODS} = require('http');
const methods = METHODS.map(m => m.toLowerCase());
const exract = require('.');
const noop = () => null;
const fixture = app => {
	app.get('/ping', noop);
	app.get('/users', noop);
	app.post('/users', noop);
	app.put('/users', noop);
	app.patch('/users', noop);
	app.delete('/users', noop);
	app.get('/users/:user_id', noop);
	app.post('/users/:user_id', noop);
	app.put('/users/:user_id', noop);
	app.patch('/users/:user_id', noop);
	app.delete('/users/:user_id', noop);
};


describe('index/extract', () => {
	it('Should extract routes from app', () => {
		const app = express();
		fixture(app);
		const routes = exract(app);

		expect(routes).to.deep.equalInAnyOrder({
			get: ['/ping', '/users', '/users/:user_id'],
			post: ['/users', '/users/:user_id'],
			put: ['/users', '/users/:user_id'],
			patch: ['/users', '/users/:user_id'],
			delete: ['/users', '/users/:user_id'],
		});
	});
	it('Should filter routes by given function', () => {
		const app = express();
		fixture(app);
		app.all('*', () => null);

		const conditions = [
			method => method === 'patch',
			(method, path) => path === '/users' && /DELETE/i.test(method),
			(method, path) => path.includes('*'),
			(method, path) => path.endsWith('ping'),
		];

		const filter = (method, path) => !conditions.some(
			condition => condition(method, path)
		);
		const routes = exract(app, {filter});

		expect(routes).to.deep.equalInAnyOrder({
			get: ['/users', '/users/:user_id'],
			post: ['/users', '/users/:user_id'],
			put: ['/users', '/users/:user_id'],
			delete: ['/users/:user_id'],
		});
	});

	it('Should extract all methods', () => {
		const app = express();
		app.all('*', () => null);
		const routes = exract(app);

		expect(routes).to.have.all.keys(methods);
	});
});
