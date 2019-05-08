const badge = require('.');

describe('npm-badge', () => {
	let app;
	let server;
	before(async() => {
		app = express();
		app.get('/npm-badge', badge);
		server = app.listen(3337);
	});
	after(() => server.close());

	it('Response should include input text', async() => {
		const moduleName = '@babel/plugin-proposal-decorators';
		const response = await fetch(`http://0.0.0.0:3337/npm-badge?name=${moduleName}`).then(response => response.text());
		expect(response).to.include(`>${moduleName}`);
		expect(response).to.include('weekly downloads</text>');
	});
});
