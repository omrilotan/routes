const badge = require('.');

describe('npm-badge', () => {
	let app;
	let server;
	let port;
	before(async() => {
		app = express();
		app.get('/npm-badge', badge);
		server = app.listen();
		port = server.address().port;
	});

	xit('Response should include input text', async() => {
		const moduleName = '@babel/plugin-proposal-decorators';
		const response = await fetch(`http://0.0.0.0:${port}/npm-badge?name=${moduleName}`).then(response => response.text());
		expect(response).to.include(`>${moduleName}`);
		expect(response).to.include('weekly downloads</text>');
	});
});
