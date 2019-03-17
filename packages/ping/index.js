module.exports = (request, response) => response
	.status(200)
	.type('txt')
	.send('pong');
