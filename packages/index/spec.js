function clean() {
	[ '.', './lib/extract', './lib/route' ].forEach(route => {
		delete require.cache[require.resolve(route)];
	});
}

const called = {
	extract: [],
	route: [],
};
function mock(route, fake) {
	const name = route.split('/').pop();
	require(route);
	require.cache[require.resolve(route)].exports = (...args) => {
		called[name].push(...(args.length ? args : [ undefined ]));
		return fake(...args);
	};
}
const dummy = {
	get: [ '/users', '/users/:user_id' ],
	post: [ '/users', '/users/:user_id' ],
	put: [ '/users', '/users/:user_id' ],
	delete: [ '/users/:user_id' ],
};

describe('index', () => {
	let index;
	let app;
	let routes;
	const middleware = Symbol();

	before(() => {
		clean();
		mock('./lib/extract', () => dummy);
		mock('./lib/route', () => middleware);
		index = require('.');

		routes = index(app);
	});
	beforeEach(() => Object.keys(called).forEach(key => {
		called[key].length = 0;
	}));
	after(clean);

	it('Should pass app to extract', () => {
		index('something');
		const [ app ] = called.extract;
		expect(app).to.equal('something');
	});
	it('Should pass filter option to extract', () => {
		index('something', { filter: 'some filter' });
		const [ , { filter } ] = called.extract;
		expect(filter).to.equal('some filter');
	});
	it('Should pass the result of "extract" to "route"', () => {
		const extracted = require('./lib/extract')();
		index();
		const [ result ] = called.route;
		expect(result).to.equal(extracted);
	});
	it('Should pass the "should" option to "route" module', () => {
		index(undefined, { should: 'Should I?' });
		const [ , { should } ] = called.route;
		expect(should).to.equal('Should I?');
	});
	it('Should expose routes object with all methods', () => {
		expect(routes).to.have.all.keys([ 'get', 'post', 'put', 'delete' ]);
	});
	it('Should expose "route" function', () => {
		expect(routes.route).to.equal(middleware);
	});
	it('Should have "route" entry non enumerable', () => {
		expect(routes).not.to.have.keys([ 'route' ]);
	});
	it('Should expose "flat" getter', () => {
		expect(routes.flat).to.be.an('array');
	});
	it('Should have "flat" entry non enumerable', () => {
		expect(routes).not.to.have.keys([ 'flat' ]);
	});
	it('Should get a flat list of all routes', () => {
		expect(routes.flat).to.include('/users');
		expect(routes.flat).to.include('/users/:user_id');
	});
	it('Should dedup routes from flat list', () => {
		expect(routes.flat).to.deep.equalInAnyOrder([ '/users', '/users/:user_id' ]);
	});
});
