const isbot = require('isbot');
const defaultProps = ['length', 'name', 'arguments', 'caller', 'prototype'];

module.exports = function crawlerRequest(request, response, next) {
	let is;

	function get() {
		return is = typeof is === 'boolean'
			? is
			: isbot(request.get('user-agent'))
		;
	}

	Object.defineProperty(request, 'isbot', { get });

	next();
};

Object.assign(
	module.exports,
	...Object.getOwnPropertyNames(isbot).filter(
		prop => !defaultProps.includes(prop)
	).map(
		prop => ({ [prop]: isbot[prop] })
	)
);
