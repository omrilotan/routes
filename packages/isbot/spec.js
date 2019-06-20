const isbot = require('.');

describe('isbot', async() => {
	let app;
	let server;
	let request;
	before(async() => {
		app = express();
		app.use(isbot);
		server = app.listen(3337);
		app.get('/ping', (_request, response) => {
			request = _request;
			response.sendStatus(200);
		});
	});
	beforeEach(async() => {
		await fetch('http://0.0.0.0:3337/ping');
	});
	afterEach(() => {
		request = null;
	});
	after(() => server.close());

	it('Should find if isbot from request', async() => {
		request.headers['user-agent'] = 'Googlebot';

		expect(request.isbot).to.be.true;
	});
	it('Should memoise the result if isbot from request', async() => {
		request.headers['user-agent'] = 'Chrome';

		expect(request.isbot).to.be.false;
		request.headers['user-agent'] = 'Googlebot';

		expect(request.isbot).to.be.false;
	});
	[
		'extend',
		'exclude',
	].forEach(fn => it(
		'Should have all isbot methods',
		() => expect(isbot[fn]).to.be.a('function')
	));
});
