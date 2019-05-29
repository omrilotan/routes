const getConnections = require('../getConnections');
const forceShutdown = require('../forceShutdown');

/**
 * Shutdown gracefully (delayed event)
 * @param  {net.Server} options.server
 * @param  {Number}     options.timeout
 * @param  {Function}   options.logger
 * @param  {Set}        options.sockets
 * @return {undefined}
 */
module.exports = async function shutdown({server, timeout, logger, sockets, onsuccess, onfail}) {
	if (server.shuttingDown) { return; }
	server.shuttingDown = true;

	logger.info(`Started shutdown process with ${await getConnections(server)} connections and timeout of ${timeout} ms`);

	logger.info(`Setting timeout of ${timeout} for ${sockets.size} sockets`);
	sockets.forEach(socket => {
		socket.on('timeout', () => socket.end());
		socket.setTimeout(
			Math.max(timeout - 10, 0)
		);
	});

	try {
		logger.info('Asking server to close');
		server.close(function resolution() {
			logger.info('Closed out remaining connections');
			onsuccess();
		});

		await forceShutdown({server, timeout, logger, onsuccess, onfail});

	} catch (error) {
		logger.error(error);
	}
};
