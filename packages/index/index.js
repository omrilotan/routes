const extract = require('./lib/extract');
const route = require('./lib/route');
const flatten = require('@recursive/flatten');

/**
 * Get app routes index and 404 route
 * @param  {Express}  app              Expressjs app instance
 * @param  {Function} [options.filter] Filter routes from list
 * @param  {Function} [options.should] Serve the 404 page
 * @return {Object}
 */
module.exports = (app, {filter, should} = {}) => {
	const result = extract(app, {filter});
	Object.defineProperties(
		result,
		{
			route: {
				value: route(result, {should}),
				enumerable: false,
				configurable: true,
				writable: true,
			},
			flat: {
				get: () => Array.from(
					new Set(
						flatten(
							Object.values(
								result
							)
						)
					)
				),
				enumerable: false,
				configurable: true,
			},
		}
	);

	return result;
};
