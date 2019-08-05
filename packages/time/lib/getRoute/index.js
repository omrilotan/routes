/**
 * Gets route path string from request object
 * @param  {Object} request Server request (supports express)
 * @return {String} Route path
 */
module.exports = ({baseUrl, route = {}} = {}) => [
	baseUrl,
	typeof route.path === 'string' ? route.path : '*',
].filter(Boolean).join('/');
