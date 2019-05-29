const getConnections = require('../getConnections');

/**
 * Force shutdown forceShutdown
 * @param  {net.Server} options.server
 * @param  {Number}     options.timeout
 * @param  {Function}   options.logger
 * @return {undefined<Promise>}
 */
module.exports = ({server, timeout, logger, onsuccess, onfail}) => new Promise(
	(resolve, reject) => setTimeout(
		async() => {
			try {
				const connections = await getConnections(server);

				if (connections > 0) {
					await logger.error(`Closed service forcefully with ${connections} connections.`);
					onfail();
				} else {
					await logger.info('Closed down with no connections');
					onsuccess();
				}
				resolve();
			} catch (error) {
				reject(error);
			}
		},
		timeout
	)
);
