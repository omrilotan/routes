/**
 * Gets route path string from request object
 * @param  {Object} request Server request (supports express)
 * @return {String} Route path
 */
module.exports = ({baseUrl, route = {}} = {}) => [
	baseUrl,
	getPath(route),
].filter(Boolean).join('/');

/**
 * Gets path route string or array
 * @param  {Object} request path
 * @return {String} Route path
 */
function getPath({ path } = {}) {
	const value = Array.isArray(path) ? path[0] : path;
	return typeof value === 'string' ? value : '*';
}
