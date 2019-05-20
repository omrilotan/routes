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
		const responseEnd = response.end && response.end.bind(response); // Shadow end request

		/**
		 * Monkey-patch response end
		 * @param  {...Any} args
		 * @return {undefined}
		 */
		response.end = function end(...args) {

			// Call the response end function (release the application)
			responseEnd && responseEnd(...args);

			// Now lets start computing
			const route = getRoute(request) || 'unknown';
			const method = request.method || 'unknown';
			const status = response.statusCode || 0;
			const s = Number(start);
			const e = Number(process.hrtime.bigint());
			const duration = (e - s) / 1e6; // convert nanoseconds to milliseconds

			callback({
				method,
				route,
				status,
				duration,
			});
		};
		next();
	};
};
