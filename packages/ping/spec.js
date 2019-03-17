const ping = require('.');

describe('ping', async() => {
	let app;
	let server;
	let response;
	before(async() => {
		app = express();
		app.get('/ping', ping);
		server = app.listen(3337);
	});
	beforeEach(async() => {
		response = await fetch('http://0.0.0.0:3337/ping');
	});
	after(() => server.close());

	it('Should respond with 200 status code, ok', () => {
		expect(response.status).to.equal(200);
		expect(response.ok).to.be.true;
	});
	it('Should respond with the text "pong"', async() => {
		expect(await response.text()).to.equal('pong');
	});
	it('Should not return JSON', async() => {
		let result = false;

		try {
			await response.json();
		} catch (error) {
			result = true;
		}

		assert(result);
	});
});
