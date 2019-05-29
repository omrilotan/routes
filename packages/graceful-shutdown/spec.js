const { clean, override } = abuser(__filename);

const { server, timeout, logger } = require('./lib/stubs');
const procedure = stub();
let gracefulShutdown;

describe('graceful-shutdown', () => {
	const { on } = process;
	const { resume } = process.stdin;

	before(() => {
		override('./lib/procedure', procedure);
		process.stdin.resume = stub();
		process.on = stub();
		gracefulShutdown = require('.');
	});
	afterEach(() => {
		process.stdin.resume.reset();
		process.on.reset();
		procedure.reset();
	});
	after(() => {
		clean('.');
		process.on = on;
		process.stdin.resume = resume;
	});

	it('Should interrupt natural process exiting by signal', () => {
		gracefulShutdown();
		expect(process.stdin.resume).to.have.been.called;
	});
	it('Should register to SIGTERM and SIGINT by default', () => {
		gracefulShutdown();

		const events = [
			process.on.firstCall,
			process.on.secondCall,
		].map(call => call.args[0]);

		expect(events).to.include('SIGTERM').and.to.include('SIGINT');
	});
	it('Should register to custom events', () => {
		gracefulShutdown(server, {events: ['one', 'two']});

		const events = [
			process.on.firstCall,
			process.on.secondCall,
		].map(call => call.args[0]);

		expect(events).to.include('one').and.to.include('two');
	});
	it('Should pass server and options to "procedure"', () => {
		gracefulShutdown(server, {timeout, logger});
		expect(procedure).to.be.calledWith(server, {timeout, logger});
	});
	it('Should default logger to console', () => {
		gracefulShutdown();
		const { logger } = procedure.firstCall.args[1];
		expect(logger).to.equal(console);
	});
	it('Should default timeout to 10 seconds', () => {
		gracefulShutdown();
		const { timeout } = procedure.firstCall.args[1];
		expect(timeout).to.equal(1e4);
	});
	it('Should assign callback received from "procedure" to process events', () => {
		procedure.returns('something');
		gracefulShutdown();
		expect(process.on.firstCall.args[1]).to.equal('something');
	});

});
