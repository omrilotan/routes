const app = express();
const client = require('.');
const { clean } = abuser(__filename);

describe('client', () => {
	let server;

	before(() => {
		app.get('/client', client());
		server = app.listen(3456);
	});
	after(() => {
		clean('.');
		server.close(() => null);
	});

	it('Should print a JSON data structure', async() => {
		const info = await fetch('http://localhost:3456/client').then(res => res.text());
		expect(() => JSON.parse(info), info).to.not.throw();
	});
	it('Should print details of the request', async() => {
		const info = await fetch('http://localhost:3456/client').then(res => res.json());
		const { params, url, xhr } = info;
		expect(params).to.be.an('object');
		expect(url).to.be.a('string');
		expect(xhr).to.be.a('boolean');
	});
	it('Should flatten headers', async() => {
		const info = await fetch('http://localhost:3456/client').then(res => res.json());
		expect(info).to.include.keys(['headers.user-agent', 'headers.host']);
	});
	it('Should retrieve only what was asked', async() => {
		const info = await fetch('http://localhost:3456/client?url&headers.user-agent').then(res => res.json());
		const { params, url, xhr } = info;
		expect(params).to.be.undefined;
		expect(url).to.be.a('string');
		expect(xhr).to.be.undefined;
		expect(info['headers.user-agent']).to.be.a('string');
		expect(info['headers.host']).to.be.undefined;
	});
});
