const getRoute = require('.');

const app = express();
let server;
let port;

describe('time/lib/getRoute', () => {
	before(() => {
		const cb = (request, response) => {
			response.send(
				getRoute(request),
			);
		};
		app.get('/v1/route_name/:metric/:value?', cb);
		app.use(cb);
		server = app.listen();
		port = server.address().port;
	});

	it('defaults to empty string', () => {
		expect(getRoute()).to.equal('*');
		expect(getRoute({ path: '' })).to.equal('*');
		expect(getRoute({ route: { path: '' } })).to.equal('');
	});
	it('Extracts route path from request object', () => {
		const mockRequest = {
			route: {
				path: 'directory/path.ext',
			},
		};
		expect(getRoute(mockRequest)).to.equal('directory/path.ext');
	});
	it('Prefixes the baseUrl from request object', () => {
		const mockRequest = {
			baseUrl: '/root',
			route: {
				path: 'directory/path.ext',
			},
		};
		expect(getRoute(mockRequest)).to.equal('/root/directory/path.ext');
	});
	it('Drops baseUrl when route handler is not available', () => {
		const mockRequest = {
			baseUrl: '/root',
			route: undefined,
		};
		expect(getRoute(mockRequest)).to.equal('*');
	});
	it('Should get the route value', async() => {
		const route = await fetch(`http://localhost:${port}/v1/route_name/my-metric/twelve`).then(res => res.text());
		expect(route).to.equal('/v1/route_name/:metric/:value?');
	});
	it('Should return wildcard when no route pattern matches', async() => {
		const route = await fetch(`http://localhost:${port}/some/route`).then(res => res.text());
		expect(route).to.equal('*');
	});
});
