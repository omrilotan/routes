const { clean, override } = abuser(__filename);

const getConnections = stub();
const forceShutdown = stub();
let shutdown;

const { sockets, socket, server, timeout, logger, onsuccess, onfail } = require('../stubs');

describe('graceful-shutdown/lib/shutdown', () => {
	beforeEach(() => {
		clean('.');
		override('../getConnections', getConnections);
		override('../forceShutdown', forceShutdown);
		shutdown = require('.');
	});
	afterEach(() => {
		getConnections.reset();
		forceShutdown.reset();
		onsuccess.reset();
		onfail.reset();
		server.close.reset();
		socket.setTimeout.reset();
		logger.info.reset();
		logger.error.reset();
	});

	after(() => clean('.'));

	it('Should call server.close', async() => {
		await shutdown({server, timeout, logger, sockets, onsuccess, onfail});
		expect(server.close).to.have.been.called;
	});
	it('Should log an error when server close can not be called', async() => {
		const error = new Error('Something must have gone wrong');
		server.close.throws(error);
		await shutdown({server, timeout, logger, sockets});
		expect(logger.error).to.have.been.called;
	});
	it('Should call server.close only once', async() => {
		await shutdown({server, timeout, logger, sockets, onsuccess, onfail});
		expect(server.close).to.have.been.called;
		server.close.reset();
		await shutdown({server, timeout, logger, sockets});
		expect(server.close).to.not.have.been.called;
	});
	it('Should exit the onsucess finally after server is closed correctly', async() => {
		await shutdown({server, timeout, logger, sockets, onsuccess, onfail});
		server.close.firstCall.args[0](); // Call the callback
		expect(onsuccess).to.have.been.called;
	});
	it('Calls forceShutdown finally', async() => {
		await shutdown({server, timeout, logger, sockets, onsuccess, onfail});
		expect(forceShutdown).to.have.been.calledWith({server, timeout, logger, onsuccess, onfail});
	});
});
