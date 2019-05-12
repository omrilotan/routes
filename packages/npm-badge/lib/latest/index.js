const fetch = require('node-fetch');

/**
 * Retrieve "latest" tag version
 * @param  {String} name
 * @return {String}
 */
module.exports = name => fetch(`https://registry.npmjs.org/${name}/latest`)
	.then(result => result.json())
	.then(({version, error}) => {
		if (error) { throw error; }
		return `V${version}`;
	})
	.catch(error => { throw error; });
