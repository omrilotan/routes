let health;

const called = {
	send: [],
	status: [],
	error: [],
	kill: [],
	next: [],
};

function push(name, ...args) {
	args = args.length ? args : ['ø'];
	called[name].push(...args);
}

const request = undefined;
const response = {
	status: function(...args) {
		push('status', ...args);
		return this;
	},
	type: function() { return this; },
	send: (...args) => push('send', ...args),
};
const logger = {error: (...args) => push('error', ...args)};
const _next = (...args) => push('next', ...args);

describe('health', async() => {
	const {kill} = process;
	const {error} = console;
	before(() => {
		process.kill = (...args) => push('kill', ...args);
	});
	beforeEach(() => {
		delete require.cache[require.resolve('.')];
		health = require('.');

		Object.keys(called).forEach(key => {
			called[key].length = 0;
		});
	});
	afterEach(() => {
		console.error = error; // eslint-disable-line no-console
	});
	after(() => {
		process.kill = kill;
		setTimeout(() => process.exit(0), 2000);
	});

	it('Should call process.kill after timeout has expired', async() => {
		const route = health(
			() => { throw new Error(); },
			{
				timeout: 100,
				logger,
			}
		);
		await route(request, response, _next);
		const {kill} = called;

		expect(kill).to.be.lengthOf(0);
		await wait(50);
		expect(kill).to.be.lengthOf(0);
		await wait(150);
		expect(kill).to.be.lengthOf(2);
	});
	it('Should not kill process if no error was thrown', async() => {
		const route = health(
			() => null,
			{
				timeout: 50,
				logger,
			}
		);
		await route(request, response, _next);
		const {kill} = called;

		await wait(100);
		expect(kill).to.be.lengthOf(0);
	});
	it('Should log error to passed in logger', async() => {
		const route = health(
			() => { throw new Error(); },
			{
				timeout: 100,
				logger: {error: (...args) => push('error', ...args)},
			}
		);
		await route(request, response, _next);
		const {error} = called;
		expect(error).to.be.lengthOf(1);
	});
	it('Should use console as logger', async() => {
		console.error = (...args) => push('error', ...args); // eslint-disable-line no-console
		try {
			const route = health(
				() => { throw new Error(); }
			);
			await route(request, response, _next);
			const {error} = called;
			expect(error).to.be.lengthOf(1);
		} catch (err) {
			error(err);
		}
	});
	it('Should log the error thrown with additional message', async() => {
		const route = health(
			() => { throw new Error('Error details'); },
			{logger}
		);

		await route(request, response, _next);

		const [error] = called.error;
		expect(error).to.be.instanceOf(Error);
		expect(error.message).to.include('Process will shut down');
		expect(error.message).to.include('Error details');
	});
	it('Should return a route with an okay status', async() => {
		const route = health(
			() => null,
			{logger}
		);

		await route(request, response, _next);
		const {status: [code]} = called;
		expect(code).to.equal(200);
	});
	it('Should return a route with an error status', async() => {
		const route = health(
			() => { throw new Error(); },
			{logger}
		);

		await route(request, response, _next);
		const {status: [code]} = called;
		expect(code).to.equal(503);
	});
	it('Should call on "next" when all is good', async() => {
		const route = health(
			() => null,
			{logger}
		);

		await route(request, response, _next);
		const {next} = called;
		expect(next).to.have.lengthOf(1);
	});
	it('Should call on "next" when error is found', async() => {
		const route = health(
			() => { throw new Error(); },
			{logger}
		);

		await route(request, response, _next);
		const {next} = called;
		expect(next).to.have.lengthOf(1);
	});
	it('Should wait for async checks as well', async() => {
		const route = health(
			async() => {
				await wait(100);
				throw new Error();
			},
			{logger}
		);

		await route(request, response, _next);
		const {status: [code]} = called;
		expect(code).to.equal(503);
	});
});
