/**
 * Register signal termination to shut service down gracefully
 * @param  {Server} server  Express Server
 * @param  {Number} [options.timeout=10000]
 * @param  {Object} [options.logger=console]
 * @return {undefined}
 */
module.exports = function gracefulShutdown(server, {timeout = 10000, logger = console} = {}) {
	/**
	 * Call on logger method safely
	 * @param  {String} type    Logger method to call on
	 * @param  {String} message Message to log
	 * @param  {Number} [code]  Exit code when applicable
	 * @return {undefined}
	 */
	async function log(type, message, code) {
		if (!logger || !logger[type]) {
			return;
		}

		await logger[type](message);
		typeof code === 'number' && process.exit(code);
	}

	let callback = () => {
		shutdown({server, timeout, log});
		callback = () => null;
	};

	process.stdin.resume();
	[
		'SIGTERM',
		'SIGINT',
	].forEach(event => process.on(event, callback));
};

/**
 * Shutdown gracefully (delayed event)
 * @param  {Server}   options.server
 * @param  {Number}   options.timeout
 * @param  {Function} options.log
 * @return {undefined}
 */
async function shutdown({server, timeout, log}) {
	logStart({server, timeout, log});

	try {
		server.close(
			() => log(
				'info',
				'Closed out remaining connections',
				0
			)
		);

		await forceShutdown({server, timeout, log});

	} catch (error) {
		log('error', error);
	}
}

/**
 * [logStart description]
 * @param  {Server}   options.server
 * @param  {Number}   options.timeout
 * @param  {Function} options.log
 * @return {undefined}
 */
const logStart = async ({server, timeout, log}) => log('info', `Started shutdown process with ${await getConnections(server)} connections and timeout of ${timeout} ms`);

/**
 * Force shutdown
 * @param  {Server}   options.server
 * @param  {Number}   options.timeout
 * @param  {Function} options.log
 * @return {undefined<Promise>}
 */
const forceShutdown = ({server, timeout, log}) => new Promise(
	(resolve, reject) => setTimeout(
		async() => {
			try {
				const connections = await getConnections(server);

				if (connections > 0) {
					await log('error', `Closed service forcefully with ${connections} connections.`, 1);
				} else {
					await log('info', 'Closed down with no connections', 0);
				}
				resolve(); // unreachable, but whatever
			} catch (error) {
				reject(error);
			}
		},
		timeout
	)
);

/**
 * Express server getConnections in promise form
 * @param  {Server} server Express server instance
 * @return {Number<Promise>}
 */
const getConnections = server => new Promise(
	(resolve, reject) => server.getConnections(
		(error, connections) => error
			? reject(error)
			: resolve(connections)
	)
);
