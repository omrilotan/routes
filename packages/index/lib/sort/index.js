/**
 * Sort function strings by their third word
 * @param  {String} a
 * @param  {String} b
 * @return {Number}
 */
module.exports = function sort(a, b) {
	const [,,_a] = a.toLowerCase().split(' ');
	const [,,_b] = b.toLowerCase().split(' ');

	if (_a < _b) { return -1; }
	if (_a > _b) { return 1; }
	return 0;
};
