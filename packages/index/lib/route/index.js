const flatten = require('@recursive/flatten');
const sort = require('../sort');

/**
 * Create an express route handler
 * @param  {Object}   index            Object representation of the available routes
 * @param  {Function} [options.should] Condition for sending the 404 page
 * @return {Fucntion}                  Express route handler
 */
module.exports = (index, {should = () => true} = {}) => {
	const routes = flatten(
		Object.entries(index)
			.map(
				([method, routes]) => routes
					.map(
						route => `- [${method.toUpperCase()}] ${route}`
					)
			)
	);

	routes.sort(sort);

	/**
	 * Express route handler
	 * @param  {Request} request
	 * @param  {Response} response
	 * @return {undefined}
	 */
	return (request, response, next) => {
		if (!should(request, response)) {
			next();
			return;
		}

		if (response.headersSent) {
			next();
			return;
		}

		const {url, method} = request;

		const message = [
			`404 error - Could not find route [${method.toUpperCase()}] ${url}`,
			'Here is a list of available routes:',
			...routes,
		].join('\n');

		response
			.status(404)
			.type('text/plain')
			.send(message);
	};
};
