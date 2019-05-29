const { clean, override } = abuser(__filename);
const getConnections = stub();

let forceShutdown;

const { server, logger, onsuccess, onfail } = require('../stubs');


describe('graceful-shutdown/lib/forceShutdown', () => {
	before(() => {
		override('../getConnections', getConnections);
		forceShutdown = require('.');
	});
	afterEach(() => {
		getConnections.reset();
		onsuccess.reset();
		onfail.reset();
		logger.info.reset();
		logger.error.reset();
	});
	after(() => clean('.'));

	it('Should call on getConnections', async() => {
		await forceShutdown({server, logger, onsuccess, onfail});
		expect(getConnections).to.have.been.calledWith(server);
	});
	it('Should log error and exit with code 1 if there are open connections', async() => {
		getConnections.returns(2);
		await forceShutdown({server, logger, onsuccess, onfail});
		expect(logger.info).to.not.have.been.called;
		expect(logger.error).to.have.been.called;
		expect(onfail).to.have.been.called;
	});
	it('Should log info and exit with code 0 if there are open connections', async() => {
		getConnections.returns(0);
		await forceShutdown({server, logger, onsuccess, onfail});
		expect(logger.error).to.not.have.been.called;
		expect(logger.info).to.have.been.called;
		expect(onsuccess).to.have.been.called;
	});
	it('Should wait for async logger before exiting', async() => {
		const later = spy();
		await forceShutdown({server, onsuccess, onfail, logger: {
			info: async() => {
				await wait(400);
				expect(onsuccess).to.not.have.been.called;
				expect(onfail).to.not.have.been.called;
				later();
			},
		}});
		expect(later).to.have.been.called;
		expect(onsuccess).to.have.been.called;
	});
});
