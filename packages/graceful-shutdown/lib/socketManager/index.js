const TERMINATION_EVENTS = [
	'close',   // Emitted once the socket is fully closed
	'error',   // Emitted when an error occurs
	'timeout', // Emitted if the socket times out from inactivity
];

/**
 * Manage sockets for timing them out later
 * @param  {net.Server} server
 * @return {Set}
 */
module.exports = function socketManager({server}) {
	const sockets = new Set();

	server.on(
		'connection',

		/**
		 * Collect socket into set with self removal upon termination
		 * @param  {net.Socket} socket
		 * @return {undefined}
		 */
		function collectSocket(socket) {
			sockets.add(socket);

			TERMINATION_EVENTS.forEach(
				name => socket.on(
					name,
					() => sockets.delete(socket)
				)
			);
		}
	);

	return sockets;
};
