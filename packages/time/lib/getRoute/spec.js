const getRoutePath = require('.');

describe('stats/lib/getRoutePath', () => {
	it('defaults to empty string', () => {
		expect(getRoutePath()).to.equal('');
		expect(getRoutePath({path: ''})).to.equal('');
		expect(getRoutePath({route: {path: ''}})).to.equal('');
	});
	it('Extracts route path from request object', () => {
		const mockRequest = {
			route: {
				path: 'directory/path.ext',
			},
		};
		expect(getRoutePath(mockRequest)).to.equal('directory/path.ext');
	});
	it('Prefixes the baseUrl from request object', () => {
		const mockRequest = {
			baseUrl: '/root',
			route: {
				path: 'directory/path.ext',
			},
		};
		expect(getRoutePath(mockRequest)).to.equal('/root/directory/path.ext');
	});
});
