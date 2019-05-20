/**
 * Gets route path string from request object
 * @param  {Object} request Server request (supports express)
 * @return {String} Route path
 */
module.exports = ({baseUrl, route, path} = {}) => [
	baseUrl,
	route && route.path || path,
].filter(Boolean).join('/');
