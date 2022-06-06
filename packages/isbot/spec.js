const isbot = require('.');

describe('isbot', async() => {
	let app;
	let server;
	let request;
	let port;
	before(async() => {
		app = express();
		app.use(isbot);
		server = app.listen();
		port = server.address().port;
		app.get('*', (_request, response) => {
			request = _request;
			response.sendStatus(200);
		});
	});
	beforeEach(async() => {
		await fetch(`http://0.0.0.0:${port}/something`);
	});
	afterEach(() => {
		request = null;
	});

	it('Should find if isbot from request', async() => {
		request.headers['user-agent'] = 'Googlebot';

		expect(request.isbot).to.be.true;
	});
	it('Should memoise the result if isbot from request', async() => {
		request.headers['user-agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36';

		expect(request.isbot).to.be.false;
		request.headers['user-agent'] = 'Googlebot';

		expect(request.isbot).to.be.false;
	});
	[
		'extend',
		'exclude',
	].forEach(fn => it(
		'Should have all isbot methods',
		() => expect(isbot[fn]).to.be.a('function'),
	));
});
