const ping = require('.');

describe('ping', async() => {
	let app;
	let server;
	let response;
	let port;
	before(async() => {
		app = express();
		app.get('/ping', ping);
		server = await app.listen();
		port = server.address().port;
	});
	beforeEach(async() => {
		response = await fetch(`http://0.0.0.0:${port}/ping`);
	});

	it('Should respond with 200 status code, ok', () => {
		expect(response.status).to.equal(200);
		expect(response.ok).to.be.true;
	});
	it('Should respond with the text "pong"', async() => {
		expect(await response.text()).to.equal('pong');
	});
	it('Should not return JSON', async() => {
		expect(response.json()).to.be.rejected;
	});
});
