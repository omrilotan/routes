const fetch = require('node-fetch');

/**
 * Retrieve weekly number of module downloads from NPM registry
 * @param  {String} name
 * @return {Number}
 */
module.exports = name => fetch(`https://api.npmjs.org/downloads/point/last-week/${name}`)
	.then(result => result.json())
	.then(({downloads, error}) => {
		if (error) { throw error; }
		return Number(downloads) || 0;
	})
	.catch(error => { throw error; });
