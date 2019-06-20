const isbot = require('isbot');

module.exports = function crawlerRequest(request, response, next) {
	let is;

	function get() {
		return is = typeof is === 'boolean'
			?	is
			: isbot(request.headers['user-agent'])
		;
	}

	Object.defineProperty(request, 'isbot', { get });

	next();
};
