/**
 * Shutdown Timeout
 * @type {Number}
 */
const SHUTDOWN_TIMEOUT = 10 * 1000;

/**
 * Status to message map
 * @type {Object}
 */
const TEXTS = {
	200: '💪',
	503: '💔',
};

/**
 * State of the application
 * @type {Boolean}
 */
let isShuttingDown = false;

/**
 * Create an Expressjs route handler
 * @param  {Function} check
 * @param  {Number}   options.timeout
 * @param  {Object}   options.logger
 * @return {Function}
 */
module.exports = function health(
	check = () => null,
	{
		timeout = SHUTDOWN_TIMEOUT,
		logger = console,
	} = {}
) {

	/**
	 * An Expressjs route handler
	 * @param  {Request} request
	 * @param  {Response} response
	 * @return {undefined}
	 */
	return async function route(request, response, next) {
		try {
			await check();
		} catch (error) {
			error.message = `Process will shut down. Error: ${error.message}`;
			logger && logger.error && logger.error(error);
			shutdown(timeout);
		}

		const status = isShuttingDown ? 503 : 200;

		response
			.status(status)
			.type('txt')
			.send(TEXTS[status]);

		next();
	};

};

function shutdown(delay) {
	if (isShuttingDown) { return; }

	isShuttingDown = true;

	setTimeout(
		() => process.kill(process.pid, 'SIGTERM'),
		delay
	);
}
