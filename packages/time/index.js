const getRoute = require('./lib/getRoute');

/**
 * Register a callback to be called with request time
 * @param  {Function} callback
 * @return {undefined}
 */
module.exports = function timeMiddleware(callback) {

	/**
	 * Express middleware
	 * @param  {Request}   request
	 * @param  {Response}  response
	 * @param  {Function}  next
	 * @return {undefined}
	 */
	return function middleware(request, response, next) {
		const start = process.hrtime.bigint();
		response.on('finish', function () {
			const route = getRoute(request) || 'unknown';
			const url = request.originalUrl || request.url || 'unknown';
			const method = request.method || 'unknown';
			const status = response.statusCode || 0;
			const s = start;
			const e = process.hrtime.bigint();
			const duration = Number(e - s) / 1e6; // convert nanoseconds to milliseconds

			callback({
				method,
				route,
				url,
				status,
				duration,
			});
		});
		next();
	};
};
