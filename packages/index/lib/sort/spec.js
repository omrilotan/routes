const sort = require('.');

describe('index/sort', () => {
	it('Should be a sort function', () => {
		const array = ['- [x] /c', '- [x] /b', '- [x] /a'];
		expect(array.sort(sort)).to.deep.equal(array.reverse());
	});
	it('Should sort by third word name', () => {
		expect(sort('- [b] /a', '- [a] /a')).to.equal(0);
	});
	it('Should by alphabetic order', () => {
		expect(sort('- [x] /c', '- [x] /a')).to.equal(1);
	});
	it('Should be case insensitive', () => {
		expect(sort('- [x] /a', '- [x] /C')).to.equal(-1);
	});
});
