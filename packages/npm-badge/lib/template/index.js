const { promises: { readFile } } = require('fs');
const { join } = require('path');
let memoised;

/**
 * Get the template SVG. Memoise the result
 * @return {String}
 */
module.exports = async function template() {
	if (!memoised) {
		const buffer = await readFile(join(__dirname, 'badge.svg'));
		memoised = buffer.toString().replace(/\n\s*/g, '');
	}

	return memoised;
};
