const template = require('.');

describe('npm-badge/lib/template', () => {
	it('Should retrieve an SVG file', async() => {
		expect(await template()).to.include('<svg');
	});
	it('Should squish the SVG', async() => {
		expect(await template()).to.not.include('\n');
	});
});
