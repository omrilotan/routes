const getRoutePath = require('.');

const app = express();
let server;

describe('time/lib/getRoutePath', () => {
	before(() => {
		const cb = (request, response) => {
			response.send(
				getRoutePath(request)
			);
		};
		app.get('/v1/route_name/:metric/:value?', cb);
		app.use(cb);
		server = app.listen(3456);
	});
	after(() => {
		server.close(() => null);
	});

	it('defaults to empty string', () => {
		expect(getRoutePath()).to.equal('*');
		expect(getRoutePath({path: ''})).to.equal('*');
		expect(getRoutePath({route: {path: ''}})).to.equal('');
	});
	it('Extracts route path from request object', () => {
		const mockRequest = {
			route: {
				path: 'directory/path.ext',
			},
		};
		expect(getRoutePath(mockRequest)).to.equal('directory/path.ext');
	});
	it('Prefixes the baseUrl from request object', () => {
		const mockRequest = {
			baseUrl: '/root',
			route: {
				path: 'directory/path.ext',
			},
		};
		expect(getRoutePath(mockRequest)).to.equal('/root/directory/path.ext');
	});
	it('Drops baseUrl when route handler is not available', () => {
		const mockRequest = {
			baseUrl: '/root',
			route: undefined,
		};
		expect(getRoutePath(mockRequest)).to.equal('*');
	});
	it('Should get the route value', async() => {
		const route = await fetch('http://localhost:3456/v1/route_name/my-metric/twelve').then(res => res.text());
		expect(route).to.equal('/v1/route_name/:metric/:value?');
	});
	it('Should return wildcard when no route pattern matches', async() => {
		const route = await fetch('http://localhost:3456/some/route').then(res => res.text());
		expect(route).to.equal('*');
	});
});
