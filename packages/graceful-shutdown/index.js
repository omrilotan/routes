const procedure = require('./lib/procedure');

/**
 * Default process events to listen to
 * @type {Array}
 */
const DEFAULT_EVENTS = [
	'SIGTERM',
	'SIGINT',
];

/**
 * Register signal termination to shut service down gracefully
 * @param  {net.Server} server  net.Server
 * @param  {Number}     [options.timeout=10000]
 * @param  {Object}     [options.logger=console]
 * @return {undefined}
 */
function graceful(server, {timeout = 10000, logger = console, events = DEFAULT_EVENTS} = {}) {
	const callback = procedure(server, {timeout, logger});

	process.stdin.resume();
	events.forEach(event => process.on(event, callback));
}

graceful.procedure = procedure;

module.exports = graceful;
