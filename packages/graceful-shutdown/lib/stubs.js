/**
 * const { sockets, socket, server, timeout, logger, onsuccess, onfail } = require('../stubs');
 */
Object.defineProperty(
	module,
	'exports',
	{
		get: () => ({
			sockets: new Set(),
			socket: { setTimeout: stub() },
			server: { close: stub() },
			timeout: 7,
			logger: {
				info: stub(),
				error: stub(),
			},
			onsuccess: stub(),
			onfail: stub(),
		}),
	}
);
