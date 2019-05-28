const { clean, override } = abuser(__filename);

const socketManager = stub();
const shutdown = stub();
let procedure;

const { sockets, server, timeout, logger, onsuccess, onfail } = require('../stubs');

describe('graceful-shutdown/lib/procedure', () => {
	const { exit } = process;
	before(() => {
		process.exit = stub();
	});
	beforeEach(() => {
		clean('.');
		override('../socketManager', socketManager);
		override('../shutdown', shutdown);
		procedure = require('.');
	});
	afterEach(() => {
		socketManager.reset();
		socketManager.returns(sockets);
		onsuccess.reset();
		onfail.reset();
		shutdown.reset();
		logger.info.reset();
		logger.error.reset();
		process.exit.reset();
	});

	after(() => {
		clean('.');
		process.exit = exit;
	});

	it('Should pass server and logger to socket manager', async() => {
		await procedure(server, {timeout, logger, onsuccess, onfail});
		expect(socketManager).to.have.been.calledWith({server});
	});
	it('Should return a shutdown callback bound to arguments and sockets', async() => {
		const callback = await procedure(server, {timeout, logger, onsuccess, onfail});
		callback();
		expect(shutdown).to.have.been.calledWith({server, timeout, logger, sockets, onsuccess, onfail });
	});
	it('Should default timeout to 10 seconds', async() => {
		const callback = await procedure(server);
		callback();
		const [{logger}] = shutdown.firstCall.args;
		expect(logger).to.equal(console);
	});
	it('Should default logger to console', async() => {
		const callback = await procedure(server);
		callback();
		const [{timeout}] = shutdown.firstCall.args;
		expect(timeout).to.equal(1e4);
	});
	it('Should default onsuccess to process.exit', async() => {
		const callback = await procedure(server);
		callback();
		const [{onsuccess}] = shutdown.firstCall.args;
		onsuccess();
		expect(process.exit).to.have.been.calledWith(0);
	});
	it('Should default onfail to process.exit', async() => {
		const callback = await procedure(server);
		callback();
		const [{onfail}] = shutdown.firstCall.args;
		onfail();
		expect(process.exit).to.have.been.calledWith(1);
	});
	it('Should create a proxy when logger is set to false', async() => {
		const callback = await procedure(server, {timeout, logger: false, onsuccess, onfail});
		callback();
		const [{logger}] = shutdown.firstCall.args;
		expect(logger.anything).to.be.a('function');
		expect(logger.info()).to.equal(null);
	});
});
