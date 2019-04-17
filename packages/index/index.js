const extract = require('./lib/extract');
const route = require('./lib/route');

/**
 * Get app routes index and 404 route
 * @param  {Express}  app              Expressjs app instance
 * @param  {Function} [options.filter] Filter routes from list
 * @param  {Function} [options.should] Serve the 404 page
 * @return {Object}
 */
module.exports = (app, {filter, should} = {}) => {
	const result = extract(app, {filter});
	Object.defineProperty(
		result,
		'route',
		{
			value: route(result, {should}),
			enumerable: false,
			configurable: true,
			writable: true,
		}
	);

	return result;
};
