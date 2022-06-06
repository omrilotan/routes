const assign = require('@recursive/assign');

/**
 * Extract all routes from an expressjs app
 * @param  {Array}    options._router.stack
 * @param  {Function} [options.filter]
 * @return {Object}
 */
module.exports = ({ _router: { stack } }, { filter = () => true } = {}) => assign(
	{},
	...stack
		.map(
			({ route }) => route,
		)
		.filter(Boolean)
		.map(
			({ path, methods }) => assign(
				{},
				...Object.keys(methods)
					.filter(
						method => filter(method, path),
					)
					.map(
						method => ({ [method]: [ path ] }),
					),
			),
		),
);
