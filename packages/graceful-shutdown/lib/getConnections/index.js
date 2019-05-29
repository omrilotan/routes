/**
 * Express server getConnections in promise form
 * @param  {net.Server} server Express server instance
 * @return {Number<Promise>}
 */
module.exports = server => new Promise(
	(resolve, reject) => server.getConnections(
		(error, connections) => error
			? reject(error)
			: resolve(connections)
	)
);
