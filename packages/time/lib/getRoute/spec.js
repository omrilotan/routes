const getRoute = require('.');

const app = express();
const router = express.Router();
let server;
let port;

describe('@routes/time/lib/getRoute', () => {
	before(() => {
		const cb = (request, response) => {
			response.send(
				getRoute(request),
			);
		};
		app.get('/v1/route_name/:metric/:value?', cb);
		app.get([ '/one', '/two' ], cb);
		router.route('/:user_id').get(cb);
		app.use('/user/', router);
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
	it('Should recognise array routes and return the first route', async() => {
		const route = await fetch(`http://localhost:${port}/two`).then(res => res.text());
		expect(route).to.equal('/one');
	});
	it('Should recognise router route and consolidate the result', async() => {
		const route = await fetch(`http://localhost:${port}/user/1234`).then(res => res.text());
		expect(route).to.equal('/user/:user_id');
	});
});
