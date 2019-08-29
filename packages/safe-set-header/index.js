const { ServerResponse } = require('http');

const METHODS = [
	'setHeader',
	'removeHeader',
];

/**
 * safeSetHeader
 * @param  {Function} [options.log=noop] Log an error object
 */
module.exports = (
	{
		log = () => null,
	} = {}
) => METHODS.forEach(
	method => {
		const original = ServerResponse.prototype[method];

		ServerResponse.prototype[method] = function(...args) {
			if (this.headersSent) {
				log(
					new Error(`Tried to call ${method} with arguments: ${args.join(', ')} - but response headers are already set.`)
				);
			} else {
				original.apply(this, args);
			}
			return this;
		};
	}
);
