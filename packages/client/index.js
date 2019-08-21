const FIELDS = [
	'body',
	'cookies',
	'signedCookies',
	'params',
	'query',
	'originalUrl',
	'baseUrl',
	'url',

	'protocol',
	'secure',
	'ip',
	'ips',
	'subdomains',
	'path',
	'hostname',
	'fresh',
	'stale',
	'xhr',
];

/**
 * Extract JSONable information from request
 * @param  {Request} request
 * @return {Object}
 */
const getInfo = request => Object.keys(request.headers).reduce(
	(accumulator, header) => Object.assign(
		accumulator,
		{[`headers.${header}`]: request.headers[header]}
	),
	FIELDS.reduce(
		(accumulator, item) => Object.assign(
			accumulator,
			{[item]: request[item]}
		),
		{}
	)
);

/**
 * Create an Expressjs route handler
 * @return {Function}
 */
module.exports = function client() {
	/**
	 * An Expressjs route handler
	 * @param  {Request} request
	 * @param  {Response} response
	 * @return {undefined}
	 */
	return function route(request, response) {
		const info = getInfo(request);
		const keys = getKeys(
			Object.keys(request.query),
			info
		);

		response.statusCode = 200
		response.end(JSON.stringify(info, keys, 2));
	};
};

function getKeys(requested, info) {
	if (!requested.length) {
		return null;
	}

	if (requested.includes('headers') || requested.includes('headers.*')) {
		requested.push(
			...Object.keys(info).filter(key => key.startsWith('headers.'))
		);
	}

	return requested;
}
