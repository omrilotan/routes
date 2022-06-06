const wait = require('@lets/wait');
const time = require('.');

describe('@routes/time', () => {
	let server;
	let port;
	let delay = 100;
	const mesaurements = [];
	before(async() => {
		const measure = time(mesaurement => mesaurements.push(mesaurement));

		const app = express();
		app.use(measure);
		app.get('/user/:user_id', async(req, res, next) => {
			res.set('Service-Name', 'my-service');
			await wait(delay);
			res.sendStatus(206);
			next();
		});
		server = await app.listen();
		port = server.address().port;
	});
	afterEach(() => {
		delay = 100;
		mesaurements.length = 0;
	});
	it('measures the route', async() => {
		await fetch(`http://127.0.0.1:${port}/user/234`);
		const [ {
			duration, method, route, status, request, response
		} ] = mesaurements;
		expect(duration).to.be.at.least(100);
		expect(method).to.equal('GET');
		expect(route).to.equal('/user/:user_id');
		expect(status).to.equal(206);
		expect(request.url).to.equal('/user/234');
		console.log('ENDED', response.finished);
		expect(response.get('service-name')).to.equal('my-service');
	});
});
