const { Socket } = require('net');
const socket = new Socket();
const socketManager = require('.');

const server = {
	on: (name, callback) => {
		server.callback = callback;
	},
};

describe('graceful-shutdown/lib/socketManager', () => {
	beforeEach(() => {
		delete server.callback;
	});

	it('Should create and return a set', () => {
		expect(socketManager({server})).to.be.a('set');
	});
	it('Should add sockets to the set when new connection callback is called', () => {
		const sockets = socketManager({server});
		server.callback(socket);
		expect(sockets.size).to.equal(1);
		expect(sockets).to.include(socket);
	});
	it('Should remove socket from collection on timeout', async() => {
		const sockets = socketManager({server});
		server.callback(socket);
		expect(sockets.size).to.equal(1);
		socket.setTimeout(10);
		await wait(20);
		expect(sockets.size).to.equal(0);
	});
});
