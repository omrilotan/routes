const client = require('.');

describe('client', () => {
	let server;
	let port;

	before(async() => {
		const app = express();
		app.get('/client', client());
		server = await app.listen();
		port = server.address().port;
	});

	it('Should print a JSON data structure', async() => {
		const info = await fetch(`http://localhost:${port}/client`).then(res => res.text());
		expect(() => JSON.parse(info), info).to.not.throw();
	});
	it('Should print details of the request', async() => {
		const info = await fetch(`http://localhost:${port}/client`).then(res => res.json());
		const { params, url, xhr } = info;
		expect(params).to.be.an('object');
		expect(url).to.be.a('string');
		expect(xhr).to.be.a('boolean');
	});
	it('Should flatten headers', async() => {
		const info = await fetch(`http://localhost:${port}/client`).then(res => res.json());
		expect(info).to.include.keys([ 'headers.user-agent', 'headers.host' ]);
	});
	it('Should retrieve only what was asked', async() => {
		const info = await fetch(`http://localhost:${port}/client?url&headers.user-agent`).then(res => res.json());
		const { params, url, xhr } = info;
		expect(params).to.be.undefined;
		expect(url).to.be.a('string');
		expect(xhr).to.be.undefined;
		expect(info['headers.user-agent']).to.be.a('string');
		expect(info['headers.host']).to.be.undefined;
	});
});
