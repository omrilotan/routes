const fetch = require('node-fetch');
const { toHumanString } = require('human-readable-numbers');

/**
 * Retrieve weekly number of module downloads from NPM registry
 * @param  {String} name
 * @return {String}
 */
module.exports = name => fetch(`https://api.npmjs.org/downloads/point/last-week/${name}`)
	.then(result => result.json())
	.then(({downloads, error}) => {
		if (error) { throw error; }
		downloads = Number(downloads) || 0;
		return `${toHumanString(downloads)} weekly downloads`;
	})
	.catch(error => { throw error; });
