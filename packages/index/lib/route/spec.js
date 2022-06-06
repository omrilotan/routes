const route = require('.');

const called = {
	send: [],
	next: [],
};

const request = {
	url: '/index',
	method: 'get',
};
const response = {
	status: function() { return this; },
	type: function() { return this; },
	send: content => called.send.push(content),
};
const next = () => called.next.push(1);

describe('index/route', () => {
	beforeEach(() => {
		called.send.length = 0;
		called.next.length = 0;
	});

	it('Should format a message listing all available routes', () => {
		route({
			get: [ '*', '/ping', '/users', '/users/:user_id' ],
			post: [ '/users', '/users/:user_id' ],
			put: [ '/users/:user_id' ],
			delete: [ '/users/:user_id' ],
		})(
			request,
			response,
			next,
		);

		const [ content ] = called.send;
		expect(content).to.equal([
			'404 error - Could not find route [GET] /index',
			'Here is a list of available routes:',
			'- [GET] *',
			'- [GET] /ping',
			'- [GET] /users',
			'- [POST] /users',
			'- [GET] /users/:user_id',
			'- [POST] /users/:user_id',
			'- [PUT] /users/:user_id',
			'- [DELETE] /users/:user_id',
		].join('\n'));
	});
	it('Should not respond if headers were already sent', () => {
		route(
			{ get: [ '*', '/ping', '/users', '/users/:user_id' ] },
		)(
			request,
			Object.assign({ headersSent: true }, response),
			next,
		);
		expect(called.send).to.be.empty;
	});
	it('Should call next function when "should" condition is falsy', () => {
		route(
			{ get: [ '*', '/ping', '/users', '/users/:user_id' ] },
			{ should: () => false },
		)(
			request,
			response,
			next,
		);
	});
});
